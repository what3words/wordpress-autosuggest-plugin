<?php
/*
Plugin Name: what3words Autosuggest Plugin
Plugin URI: https://github.com/what3words/wordpress-autosuggest-plugin
Description: WordPress plugin to capture and validate what3word's 3 word addresses
Version: 3.0.11
Author: what3words
Author URI: http://what3words.com
License: GPLv2
Text Domain: what3words-searchbox
*/

if (!defined('ABSPATH')) exit;

$plugin_dirs = explode('/', __DIR__);
define('WHAT3WORDS_PLUGIN_DIRNAME', array_pop($plugin_dirs));
define('WHAT3WORDS_SEARCHBOX_URL', plugin_dir_url(__FILE__));
define('WHAT3WORDS_SEARCHBOX_PATH', plugin_dir_path(__FILE__));
define('WHAT3WORDS_SEARCHBOX_NAME', plugin_basename(__FILE__));
define('WHAT3WORDS_SEARCHBOX_FILE', __FILE__);
define('WHAT3WORDS_SEARCHBOX_DEBUG', false);

define('WHAT3WORDS_SEARCHBOX_SETTINGS_FILTER', 'what3words_searchbox_default_settings');

require_once(WHAT3WORDS_SEARCHBOX_PATH . '/PluginBase.php');
require_once(WHAT3WORDS_SEARCHBOX_PATH . '/What3wordsSearchboxAdmin.php');

if (!class_exists('What3wordsSearchbox')) {
    class What3wordsSearchbox extends PluginBase {
        const VERSION = '309';
        const DISPLAY_VERSION = '3.0.9';

        protected static $instance;

        protected $languages = null;
        protected $countries = null;

        protected function __construct() {
            $this->plugin_name = __CLASS__;
            register_activation_hook(__FILE__, [$this, 'add_settings']);
            $this->hook('plugins_loaded');
            parent::__construct();
        }

        public static function get_instance() {
            if (!isset(self::$instance)) {
                $c = __CLASS__;
                self::$instance = new $c();
            }

            return self::$instance;
        }

        /**
         * "plugins_loaded" action hook; called after all active plugins/pluggable functions
         * are loaded.
         */
        public function plugins_loaded() {
            $this->hook('init');
            $this->hook('wp_enqueue_scripts', 'enqueue_scripts');

            if (class_exists('WooCommerce')) {
                $settings = $this->get_option();
                if ($settings['woocommerce_enabled']) {
                    $this->hook('woocommerce_checkout_fields');
                    $this->hook('woocommerce_admin_order_data_after_shipping_address');
                    $this->hook('woocommerce_admin_order_data_after_billing_address');
                    $this->hook('woocommerce_locate_template', 3);
                }
            }
        }

        /**
         * plugin activation / "activate_[pluginname]" action hook; called when the plugin is
         * first activated.
         *
         * Defines and sets up the default settings and options for the plugin. The default set
         * of options are configurable, at activation time, via the 'what3words_searchbox_default_settings'
         * filter hook.
         */
        public function add_settings() {
            $settings = $this->get_option();
            if (!is_array($settings)) {
                $settings = apply_filters(WHAT3WORDS_SEARCHBOX_SETTINGS_FILTER,
                    [
                        'version' => self::VERSION,
                        'api_key' => '',
                        'input_selectors' => '',
                        'input_placeholder' => 'e.g. `index.home.raft`',
                        'woocommerce_enabled' => false
                    ]
                );

                update_option($this->plugin_name, $settings);
            }
        }

        /**
         * "init" action hook; called to initialise the plugin
         */
        function init() {
            $lang_dir = WHAT3WORDS_PLUGIN_DIRNAME . '/languages';
            load_plugin_textdomain ('what3words-searchbox', false, $lang_dir);
        }

        /**
         * "wp_enqueue_scripts" action hook; used when enqueuing items that are meant
         * to appear on the front end. Despite the name, it is used for enqueuing both
         * scripts and styles.
         */
        public function enqueue_scripts() {
            global $wp_version;
            global $woocommerce;
            //  Get settings so we can append api key to script src
            $settings = $this->get_option();

            //  This is the plugin script that loads web component
            $handle = 'what3words-searchbox-autosuggest-js';
            $src = 'https://assets.what3words.com/sdk/v3.1/what3words.js?';
            $deps = [];
            $ver = NULL;
            $in_footer = true;

            wp_enqueue_script($handle, $src, $deps, $ver, $in_footer);

            //  Replace specified inputs with What3Words' AutoSuggest component
            $handle = 'what3words-searchbox-init-js';
            $src = WHAT3WORDS_SEARCHBOX_URL . 'assets/js/what3words-searchbox-init.js';
            $deps = ['jquery', 'what3words-searchbox-autosuggest-js'];
            $ver = NULL;
            $in_footer = true;

            wp_enqueue_script($handle, $src, $deps, $ver, $in_footer);

            $settings = $this->get_option();

            if (isset($settings['api_key']) && !empty($settings['api_key'])) {
                $selectors = [];

                if (isset($settings['input_selectors']) && !empty($settings['input_selectors'])) {
                    $selectors[] = $settings['input_selectors'];
                }

                if (isset($settings['woocommerce_enabled']) && $settings['woocommerce_enabled']) {
                    $selectors[] = '#shipping_w3w,#billing_w3w';
                }
                if (!empty($selectors)) {
                    $data['input_selectors'] = implode(',', $selectors);
                    $data['api_key'] = $settings['api_key'];
                    $data['input_placeholder'] = $settings['input_placeholder'];
                    $data['php_version'] = PHP_VERSION;
                    $data['wp_version'] = $wp_version;
                    $data['wc_version'] = (isset($woocommerce)) 
                        ? $woocommerce->version
                        : 'NA';
                    $data['w3_version'] = self::DISPLAY_VERSION;
                //    $data['color'] = $settings['color'];
                    wp_localize_script($handle, 'What3wordsSearchbox', $data);
                }
            }
        }

        /**
         * "woocommerce_checkout_fields" filter hook; enables custom checkout fields.
         */
        public function woocommerce_checkout_fields($fields) {
            $fields['shipping']['shipping_w3w'] = [
                'label' => __('what3words address', 'what3words-searchbox'),
                'placeholder' => _x('Delivery 3 word address', 'placeholder', 'what3words-searchbox'),
                'required' => false,
                'class' => ['form-row-wide'],
                'clear' => true
            ];

            $fields['billing']['billing_w3w'] = [
                'label' => __('what3words address', 'what3words-searchbox'),
                'placeholder' => _x('Billing 3 word address', 'placeholder', 'what3words-searchbox'),
                'required' => false,
                'class' => ['form-row-wide'],
                'clear' => true
            ];

            return $fields;
        }

        /**
         * "woocommerce_admin_order_data_after_shipping_address" action hook; displays
         * custom order edit field values after the shipping address.
         */
        public function woocommerce_admin_order_data_after_shipping_address($order) {
            echo '<p><strong>' . __('w3w Address', 'what3words-searchbox') . ':</strong> ' . get_post_meta($order->id, '_shipping_w3w', true) . '</p>';
        }

        /**
         * "woocommerce_admin_order_data_after_billing_address" action hook; displays
         * custom order edit field values after the billing address.
         */
        public function woocommerce_admin_order_data_after_billing_address($order) {
            echo '<p><strong>' . __('w3w Address', 'what3words-searchbox') . ':</strong> ' . get_post_meta($order->id, '_billing_w3w', true) . '</p>';
        }

        /**
         * "woocommerce_locate_template" filter hook; adds a 4th template directory to used
         * the plugin's template.
         */
        public function woocommerce_locate_template($template, $name, $path) {
            global $woocommerce;    // Uurrrrghhhh
            $saved_template = $template;
            if (!$path) {
                $path = $woocommerce->template_url;
            }

            $plugin_path  = untrailingslashit(WHAT3WORDS_SEARCHBOX_PATH) . '/templates/woocommerce/';

            // Look within passed path within the theme - this is priority
            $template = locate_template([
                $path . $name,
                $name
            ]);

            if (!$template && file_exists($plugin_path . $name)) {
                $template = $plugin_path . $name;
            }

            if (!$template) {
                $template = $saved_template;
            }

            return $template;
        }

        public function get_languages() {
            if ($this->languages === null) {
                $this->languages = json_decode(file_get_contents(WHAT3WORDS_SEARCHBOX_PATH . '/assets/json/lang-codes.json'), true);
            }

            return $this->languages;
        }

        public function get_country_codes($lang='en') {
            if ($this->countries === null) {
                $this->countries = json_decode(file_get_contents(WHAT3WORDS_SEARCHBOX_PATH . '/assets/json/country-codes.json'), true);
            }

            $codes = [];
            foreach ($this->countries as $country) {
                $key = 'name_' . $lang;
                $name = (isset($country[$key]) && !empty($country[$key]) ? $country[$key] : $country['name_en']);
                $codes[] = ['iso' => strtolower($country['ISO']), 'name' => $name];
            }

            uasort($codes, function($a, $b) {
                return strcmp($a['name'], $b['name']);
            });
            return $codes;
        }

        private function get_default_language() {
            $site_lang = substr(get_bloginfo('language'), 0, 2);

            foreach ($this->get_languages() as $lang) {
                if ($site_lang === $lang['code']) {
                    return $lang['code'];
                }
            }

            return 'en';
        }
    }   // end-class What3wordsSearchbox
}   // end-if (!class_exists('What3wordsSearchbox'))

What3wordsSearchbox::get_instance();
What3wordsSearchboxAdmin::get_instance();

?>
