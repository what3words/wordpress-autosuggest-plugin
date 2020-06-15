<?php
/*
 * Name: PluginBase
 * Description: Base class for developing WordPress plugins; contains helper functions to add WordPress hooks consistently and sanitise hook method names.
 * Version: 1.0.0
 * Author: what3words, Travis Smith
 * Author URI: http://what3words.com
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Acknowledgements: Based on WP_Plugin_Base_v1 by Travis Smith (http://wpsmith.net)
 */

if (!class_exists('PluginBase')) {
    class PluginBase {
        protected $plugin_name;

        protected function __construct() {
            isset($this->plugin_name) or die(__CLASS__ . ': Bad plugin implementation; $this->plugin_name is not set');
        }

        protected function hook($hook) {
            $priority = 10;
            $method = $this->sanitise_method($hook);
            $args = func_get_args();
            unset ($args[0]);
            foreach ((array)$args as $arg) {
                if (is_int($arg)) {
                    $priority = $arg;
                }
                else {
                    $method = $arg;
                }
            }	// end-foreach

            return add_action($hook, array ($this, $method), $priority, 999);
        }

        protected function get_option() {
            $num_args = func_num_args();
            $options = get_option($this->plugin_name);

            if ($num_args > 0) {
                $args = func_get_args();
                $key = $args[0];
                $value = '';
                if (isset($options[$key])) {
                    $value = $options[$key];
                }
                return $value;
            }

            return $options;
        }

        protected function set_option($key, $value) {
            $options = get_option($this->plugin_name);
            $options[$key] = $value;
            update_option($this->plugin_name, $options);
        }

        protected function update_option($settings) {
            update_option($this->plugin_name, $settings);
        }

        private function sanitise_method($method) {
            return str_replace (['.', '-'], ['_DOT_', '_DASH'], $method);
        }
    }   // end-class PluginBase
}   // end-if (!class_exists(PluginBase))

?>
