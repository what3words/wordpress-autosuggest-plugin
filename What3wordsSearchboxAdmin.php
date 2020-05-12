<?php

if (!defined('ABSPATH')) exit;

if (!class_exists('What3wordsSearchboxAdmin')) {
    class What3wordsSearchboxAdmin extends PluginBase {
        protected static $instance;

        protected function __construct() {
            $this->plugin_name = 'What3wordsSearchbox';

            if (is_admin()) {
                $this->hook('plugins_loaded');
            }
        }

        public static function get_instance() {
            if (!isset(self::$instance)) {
                $c = __CLASS__;
                self::$instance = new $c();
            }

            return self::$instance;
        }

        /**
         * "plugins_loaded" action hook; fired after active plugins and pluggable functions are
         * loaded.
         */
        public function plugins_loaded() {
            $this->hook('admin_init');
            $this->hook('admin_menu');
            $this->hook('admin_enqueue_scripts');
        }

        public function admin_enqueue_scripts() {
            $handle = 'what3words-expander-admin-js';
            $src = WHAT3WORDS_SEARCHBOX_URL . 'assets/js/what3words-searchbox-admin.js';
            $deps = ['jquery'];
            $ver = NULL;
            $in_footer = true;
            wp_enqueue_script($handle, $src, $deps, $ver, $in_footer);
        }

        /**
         * "plugin_action_links_[plugin-name]" filter hook; applied to the list of links to display
         * on the plugins page (beside the activate/deactivate links)
         */
        public function action_links($actions, $plugin_file, $plugin_data, $context) {
            $settings = sprintf('<a href="%s">%s</a>', admin_url('options-general.php?page=3-word-address-validation-field/What3wordsSearchboxAdmin.php'),  __('Settings', 'what3words-searchbox'));
            array_unshift($actions, $settings);

            return $actions;
        }

        /**
    	 * "admin_init" action hook; called after the admin panel is initialised.
    	 */

    	public function admin_init () {
            if (!empty($GLOBALS['pagenow']) && $GLOBALS['pagenow'] === 'plugins.php') {
                $errors = $this->check_plugin_requirements();

                if (!empty($errors)) {
                    unset($_GET['activate']);
                    $name = get_file_data(WHAT3WORDS_SEARCHBOX_FILE, ['Plugin Name'], 'plugin');

                    printf(
                        '<div class="error notice is-dismissible"><p>%1$s</p><p><i>%2$s</i> has been deactivated.</p></div>',
                        join('</p><p>', $errors),
                        $name[0]
                    );
                    deactivate_plugins(WHAT3WORDS_SEARCHBOX_NAME);
                    return;
                }
            }

            $this->hook('plugin_action_links_' . WHAT3WORDS_SEARCHBOX_NAME, 'action_links');
            $this->upgrade_settings();
            $this->hook('admin_notices');
        }

        /**
         * "admin_menu" action hook; called after the basic admin panel menu structure is in
         * place.
         */
        public function admin_menu() {
            if (function_exists('add_options_page')) {
                $page = __('What3words Searchbox - Settings', 'what3words-searchbox');
                $menu = __('What3words Searchbox', 'what3words-searchbox');
                add_options_page($page, $menu, 'manage_options', __FILE__, [$this, 'display_settings']);
            }
        }

        /**
         * "admin_notices" action hook; displays notices near the top of the admin pages.
         */
        public function admin_notices() {
            $meta = get_current_screen();
            if (!empty($GLOBALS['pagenow']) && ($GLOBALS['pagenow'] === 'plugins.php' || ($GLOBALS['pagenow'] === 'options-general.php' && $meta->base !== 'settings_page_what3words-searchbox/What3wordsSearchboxAdmin'))) {
                $settings = $this->get_option();
                if (current_user_can('manage_options')) {
                    $notice = [];
                    if (empty($settings['api_key'])) {
                        $notice[] = __('You need to enter your what3words API key to use the What3words Searchbox plugin', 'what3words-searchbox');
                    }

                    if (empty($settings['input_selectors']) && !$settings['woocommerce_enabled']) {
                        $notice[] = __('You need to enter at least one jQuery input selector to use the What3words Searchbox plugin', 'what3words-searchbox');
                    }

                    if (!empty($notice)) {
                        $notice[] = sprintf('You can go to the <a href="%s">What3words Searchbox Settings page</a> to do this now', admin_url('options-general.php?page=3-word-address-validation-field/What3wordsSearchboxAdmin.php'));
                        echo '<div class="error notice is-dismissible"><p>' . implode('. ', $notice) . '</p></div>';
                    }
                }
            }
        }

        private function check_plugin_requirements()  {
            $min_version = '5.6';
            $errors = [];
            $curr_version = phpversion();

            if (version_compare($min_version, $curr_version, '>')) {
                $errors[] = sprintf(__('Cannot activate What3words Searchbox; your server is running PHP version %d but this plugin requires at least PHP %s', 'what3words-searchbox'), $curr_version, $min_version);
            }

            return $errors;
        }

        /**
         * Called in response to the "admin_init" action hook; checks the current set of
         * settings/options and upgrades them according to the new version of the plugin.
         */
        private function upgrade_settings() {
            $this->upgrade_v1_settings();

            $settings = null;
            $settings = $this->get_option();

            if (is_array($settings) && !empty($settings['version']) && $settings['version'] === What3wordsSearchbox::VERSION) {
                return;
            }

            if (!is_array($settings)) {
                What3wordsSearchbox::get_instance()->add_settings();
            }
        }

        private function upgrade_v1_settings() {
            $legacy_settings = get_option('w3w_options');
            if (is_array($legacy_settings) && !empty($legacy_settings)) {
                $settings = $this->get_option();
                if (!is_array($settings)) {
                    return;
                }

                if (isset($legacy_settings['w3w_field_api_key']) && !empty($legacy_settings['w3w_field_api_key'])) {
                    $settings['api_key'] = $legacy_settings['w3w_field_api_key'];
                }

                if (isset($legacy_settings['w3w_field_input']) && !empty($legacy_settings['w3w_field_input'])) {
                    $settings['input_selectors'] = $legacy_settings['w3w_field_input'];
                }

                if (isset($legacy_settings['w3w_field_lang_auto']) && !empty($legacy_settings['w3w_field_lang_auto'])) {
                    $settings['multilingual'] = $this->to_boolean($legacy_settings['w3w_field_lang_auto']);
                }

                if (isset($legacy_settings['w3w_field_lang']) && !empty($legacy_settings['w3w_field_lang'])) {
                    $settings['lang'] = $legacy_settings['w3w_field_lang'];
                }

                if (isset($legacy_settings['w3w_field_lang']) && !empty($legacy_settings['w3w_field_lang'])) {
                    $settings['lang'] = $legacy_settings['w3w_field_lang'];
                }

                if (isset($legacy_settings['w3w_field_items_to_show']) && !empty($legacy_settings['w3w_field_items_to_show'])) {
                    $settings['suggestions'] = intval($legacy_settings['w3w_field_items_to_show']);
                }

                if (isset($legacy_settings['w3w_field_placeholder']) && !empty($legacy_settings['w3w_field_placeholder'])) {
                    $settings['input_placeholder'] = $legacy_settings['w3w_field_placeholder'];
                }

                if (isset($legacy_settings['w3w_field_direction']) && !empty($legacy_settings['w3w_field_direction'])) {
                    $settings['text_direction'] = $legacy_settings['w3w_field_direction'];
                }

                if (isset($legacy_settings['w3w_field_woocommerce_fields']) && !empty($legacy_settings['w3w_field_woocommerce_fields'])) {
                    $settings['woocommerce_enabled'] = $this->to_boolean($legacy_settings['w3w_field_woocommerce_fields']);
                }

                // self::update_option($settings);
                // delete_option('w3w_options');
            }
        }

        public function display_settings() {
            $settings = $this->save_settings();
            $display = '';
            $disabled = '';

            if (!$settings['country_filter'] && !$settings['country_filter_selector']) {
                $display = 'style="display: none;"';
            }

            if($settings['country_filter_selector'] !== '') {
                $disabled = 'disabled=true';
            }

            if($settings['disabled_selector_bool'] != true) {
                $disabled_selector_bool = 'style="display: none;"';
            }

            if (empty($settings['api_key'])) {
                echo '<div class="error notice is-dismissible"><p>' . __('You need to enter your what3words API key to use this plugin', 'what3words-searchbox') . '</p></div>';
            }

            if (empty($settings['input_selectors']) && !$settings['woocommerce_enabled']) {
                echo '<div class="error notice is-dismissible"><p>' . __('You need to enter at least one jQuery selector to use this plugin', 'what3words-searchbox') . '</p></div>';
            }
            ?>
            <div class="wrap">
                <h1><?php echo '<img src="https://assets.what3words.com/images/what3words_header_logo_261x43.png" /><br />' . esc_html(get_admin_page_title()); ?></h1>
                <form method="post" action="<?php echo esc_html(admin_url('options-general.php?page=3-word-address-validation-field/What3wordsSearchboxAdmin.php')); ?>">
                    <div id="what3words-searchbox-wrap">
                        <h2><?php _e('what3words API Settings', 'what3words-searchbox'); ?></h2>
                        <div id="what3words-searchbox-api-wrap">
                            <p>
                                <strong><?php _e('API Key', 'what3words-searchbox'); ?></strong><br />
                                <input type="text" name="what3words-searchbox-api-key" id="what3words-searchbox-api-key" class="what3words-searchbox-input regular-text" value="<?php echo $settings['api_key']; ?>" /><br /><small><?php _e('An API key is required to allow the plugin to connect to the what3words API key; if you don\'t have an API key yet, you can quickly and easily <a href="https://what3words.com/register?dev=true" target="_blank">sign up</a> for one.', 'what3words-searchbox'); ?></small>
                            </p>
                        </div>  <!-- what3words-searchbox-api-wrap -->

                        <h2><?php _e('General Settings', 'what3words-searchbox'); ?></h2>
                        <div id="what3words-searchbox-general-wrap">
                            <p>
                                <strong><?php _e('Input Selector(s)', 'what3words-searchbox'); ?></strong><br />
                                <input type="text" name="what3words-searchbox-input-selector" id="what3words-searchbox-input-selector" class="what3words-searchbox-input regular-text" value="<?php echo $settings['input_selectors']; ?>" /><br /><small><?php _e('The input field(s) that should be validated as a 3 word address, specified as a list of jQuery object selectors. Multiple fields can be supplied using commas e.g. ".class, #id".', 'what3words-searchbox'); ?></small>
                            </p>
                            <?php
                            if ($settings['woocommerce_enabled']) {
                            ?>
                            <p>
                                <strong><?php _e('WooCommerce Input Selector', 'what3words-searchbox'); ?></strong><br />
                                <input type="text" name="what3words-searchbox-woocommerce-selector" id="what3words-searchbox-woocommerce-selector" class="what3words-searchbox-input regular-text" value="#shipping_w3w,#billing_w3w" disabled="disabled" /><br /><small><?php _e('WooCommerce checkout support is currently enabled; this plugin has automatically added these selectors.', 'what3words-searchbox'); ?></small>
                            </p>
                            <?php
                            }
                            ?>
                            <p>
                                <strong><?php _e('Input Placeholder Text', 'what3words-searchbox'); ?></strong><br />
                                <input type="text" name="what3words-searchbox-input-placeholder" id="what3words-searchbox-input-placeholder" class="what3words-searchbox-input regular-text" value="<?php echo $settings['input_placeholder']; ?>" /><br /><small><?php _e('Optional placeholder to be initially displayed in the input field(s), e.g. "index.home.raft" or "Start typing a 3 word address".', 'what3words-searchbox'); ?></small>
                            </p>
                            <p>
                                <strong><?php _e('Disable field until validated', 'what3words-searchbox'); ?></strong><br />
                                <input type="checkbox" name="what3words-disable-field-boolean" id="what3words-disable-field-boolean" <?php checked(($settings['disabled_selector_bool'] ? 1 : 0), 1, true); ?> />&nbsp;<small><?php _e('Sets whether to activate a button or field only when it has been validated.', 'what3words-searchbox'); ?></small>
                            </p>
                            <div id="what3words-disable-field" <?php echo $disabled_selector_bool; ?>>
                                <p>
                                    <strong><?php _e('Enter field selectors to disable until 3 word address validation', 'what3words-searchbox'); ?></strong><br />
                                    <input type="text" name="what3words-disable-element-selector" id="what3words-disable-element-selector" class="what3words-disable-element-selector regular-text" value="<?php echo $settings['disabled_selector']; ?>" /><br /><small><?php _e('Set a selector to be disabled until your 3 word address is validated. Multiple elements can be supplied using commas e.g. ".button, #select".', 'what3words-searchbox'); ?></small>
                                </p>
                            </div>
                            <p>
                                <strong><?php _e('Suggestion Count', 'what3words-searchbox'); ?></strong><br />
                                <select id="what3words-searchbox-suggestion-count" name="what3words-searchbox-suggestion-count">
                                <?php
                                for ($count=1; $count <= 8; $count++) {
                                    ?>
                                    <option value="<?php echo $count; ?>" <?php selected($settings['suggestions'], $count, true); ?>><?php echo "$count"; ?></option>
                                    <?php
                                }
                                ?>
                            </select><br /><small><?php _e('The maximum number of 3 word address suggestions to display', 'what3words-searchbox'); ?></small>
                            </p>
                        </div>  <!-- what3words-searchbox-general-wrap -->

                        <h2><?php _e('Localisation Settings', 'what3words-searchbox'); ?></h2>
                        <div id="what3words-searchbox-locale-wrap">
                            <p>
                                <strong><?php _e('Input Language', 'what3words-searchbox'); ?></strong><br />
                                <select id="what3words-searchbox-language" name="what3words-searchbox-language">
                                <?php
                                $languages = What3wordsSearchbox::get_instance()->get_languages();
                                foreach ($languages as $lang) {
                                ?>
                                    <option value="<?php echo $lang['code']; ?>" <?php selected($settings['lang'], $lang['code'], true); ?> ><?php echo $lang['native_name']; ?></option>
                                <?php
                                }   // end-foreach (....)
                                ?>
                                </select><br /><small><?php _e('The language that should be used to search for 3 word addresses', 'what3words-searchbox'); ?></small>
                            </p>
                            <p>
                                <strong><?php _e('Multilingual Search', 'what3words-searchbox'); ?></strong><br />
                                <input type="checkbox" name="what3words-searchbox-multilingual" id="what3words-searchbox-multilingual" <?php checked(($settings['multilingual'] ? 1 : 0), 1, true); ?> />&nbsp;<small><?php _e('Specifies whether to search for <em>only</em> the specified language or to search across multiple languages <em>including</em> the specified language.', 'what3words-searchbox'); ?></small>
                            </p>
                            <p>
                                <strong><?php _e('Enable Country Filtering', 'what3words-searchbox'); ?></strong><br />
                                <input type="checkbox" name="what3words-searchbox-country-filter" id="what3words-searchbox-country-filter" <?php checked(($settings['country_filter'] ? 1 : 0), 1, true); ?> />&nbsp;<small><?php _e('Specifies whether to filter 3 word address suggestions by country.', 'what3words-searchbox'); ?></small>
                            </p>
                            <div id="what3words-searchbox-country-wrap" <?php echo $display; ?>>
                                <p>
                                    <strong><?php _e('Set Country Filtering Selector(s)', 'what3words-searchbox'); ?></strong><br />
                                    <input type="text" name="what3words-searchbox-country-filter-selector" id="what3words-searchbox-country-filter-selector" value="<?php echo $settings['country_filter_selector']; ?>" />&nbsp;<small><?php _e('If you want to enable country filtering, users can specify their own country. Any value input here disallows a country selection, below.', 'what3words-searchbox'); ?></small>
                                </p>
                                <p>
                                    <strong><?php _e('Country', 'what3words-searchbox'); ?></strong><br />
                                    <select id="what3words-searchbox-country" name="what3words-searchbox-country" <?php echo $disabled; ?>>
                                    <?php
                                    $countries = What3wordsSearchbox::get_instance()->get_country_codes($settings['lang']);
                                    foreach ($countries as $country) {
                                    ?>
                                        <option value="<?php echo $country['iso']; ?>" <?php selected($settings['country_code'], $country['iso'], true); ?> ><?php echo $country['name']; ?></option>
                                    <?php
                                    }   // end-foreach (....)
                                    ?>
                                </select><br /><small><?php _e('Limit 3 word address suggestions to a single country.', 'what3words-searchbox'); ?></small>
                                </p>
                            </div>
                            <p>
                                <strong><?php _e('Text Direction', 'what3words-searchbox'); ?></strong><br />
                                <select id="what3words-searchbox-text-direction" name="what3words-searchbox-text-direction">
                                    <option value="ltr" <?php selected($settings['text_direction'], 'ltr', true); ?> >Left to right</option>
                                    <option value="rtl" <?php selected($settings['text_direction'], 'rtl', true); ?> >Right to left</option>
                                </select><br /><small><?php _e('Text layout direction for your locale\'s input language', 'what3words-searchbox'); ?></small>
                            </p>
                        </div>  <!-- what3words-searchbox-locale-wrap -->

                        <h2><?php _e('WooCommerce Support', 'what3words-searchbox'); ?></h2>
                        <div id="what3words-searchbox-woocommerce-wrap">
                            <p>
                                <strong><?php _e('Enable WooCommerce Checkout Support', 'what3words-searchbox'); ?></strong><br />
                                <input type="checkbox" name="what3words-searchbox-woocommerce" id="what3words-searchbox-woocommerce" <?php checked($settings['woocommerce_enabled'], 1, true); ?> />&nbsp;<small><?php _e('Enable support for using the plugin in a WooCommerce checkout page', 'what3words-searchbox'); ?></small>
                            </p>
                        </div>  <!-- what3words-searchbox-woocommerce-wrap -->
                    </div><!-- what3words-searchbox-wrap -->
                    <?php
                    $referer = true;
                    $echo = true;
                    wp_nonce_field('what3words-searchbox-save-settings', 'what3words-searchbox-nonce', $referer, $echo);
                    submit_button(
                        sprintf(__('Save %s Settings', 'what3words-searchbox'), 'What3words Searchbox'),
                        'primary',
                        'what3words-searchbox-submit'
                    );
                    ?>
                </form>
            </div><!-- wrap -->
            <?php
        }

        public function save_settings() {
            $settings = $this->get_option();

            if (!empty($_POST['what3words-searchbox-submit'])) {
                if (strstr($_GET['page'], '3-word-address-validation-field') && check_admin_referer('what3words-searchbox-save-settings', 'what3words-searchbox-nonce')) {
                    $settings['api_key'] = $this->option('what3words-searchbox-api-key');
                    $settings['input_selectors'] = $this->option('what3words-searchbox-input-selector');
                    $settings['input_placeholder'] = $this->option('what3words-searchbox-input-placeholder');
                    $settings['disabled_selector_bool'] = $this->boolean_option('what3words-disable-field-boolean');
                    $settings['disabled_selector'] = $this->option('what3words-disable-element-selector');
                    $settings['suggestions'] = $this->option('what3words-searchbox-suggestion-count');
                    $settings['text_direction'] = $this->option('what3words-searchbox-text-direction');
                    $settings['lang'] = $this->option('what3words-searchbox-language');
                    $settings['multilingual'] = $this->boolean_option('what3words-searchbox-multilingual');
                    $settings['country_filter'] = $this->boolean_option('what3words-searchbox-country-filter');
                    $settings['country_filter_selector'] = $this->option('what3words-searchbox-country-filter-selector');
                    $settings['country_code'] = $this->option('what3words-searchbox-country');
                    $settings['woocommerce_enabled'] = $this->boolean_option('what3words-searchbox-woocommerce');
                    $this->update_option($settings);

                    ?>
                    <div id="updatemessage" class="updated fade">
                        <p>
                            <?php echo sprintf(__('%s Settings Updated', 'what3words-searchbox'), 'What3words Searchbox'); ?>
                        </p>
                    </div>
                    <script type="text/javascript">setTimeout(function() { jQuery('#updatemessage').hide('slow');}, 3000);</script>
                    <?php
                }
            }
            return $settings;
        }

        private function option($field) {
            return (isset($_POST[$field]) ? sanitize_text_field($_POST[$field]) : '');
        }

        private function boolean_option($field) {
            return (isset($_POST[$field]) ? $this->to_boolean(sanitize_text_field($_POST[$field])) : false);
        }

        private function to_boolean($value) {
            if (!is_string($value)) {
                return (bool) $value;
            }

            switch (strtolower($value)) {
                case '1':
                case 'true':
                case 'on':
                case 'yes':
                case 'y':
                    return true;
                default:
                    return false;
            }
        }
    }
}   // end-if (!class_exists('What3wordsSearchboxAdmin'))

?>
