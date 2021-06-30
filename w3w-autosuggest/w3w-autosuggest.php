<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since             4.0.0
 * @package           w3w-autosuggest
 *
 * @wordpress-plugin
 * Plugin Name:       what3words Address Field
 * Plugin URI:        https://github.com/what3words/wordpress-autosuggest-plugin
 * Description:       Official plugin to allow customers to enter and validate a what3words address on your checkout for accurate deliveries
 * Version:           4.0.0
 * Author:            what3words
 * Author URI:        https://what3words.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       what3words-searchbox
 * Domain Path:       /languages
 */

/*
what3words Address Field is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 2 of the License, or
any later version.

what3words Address Field is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with what3words Address Field. If not, see https://what3words.com.
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Plugin base name
 */
if ( !defined( 'W3W_AUTOSUGGEST_PLUGIN_BASENAME' ) ) {
  define( 'W3W_AUTOSUGGEST_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
}
/**
 * Current plugin version.
 */
if ( !defined( 'W3W_PLUGIN_VERSION' ) ) {
  define( 'W3W_PLUGIN_VERSION', '4.0.0' );
}
/**
 * Plugin settings name
 */
if ( !defined( 'W3W_SETTINGS_NAME' ) ) {
  define( 'W3W_SETTINGS_NAME', 'w3w_autosuggest_settings' );
}

/**
 * Defines the JS-library to point to (includes the version of the JS-library)
 */
if ( !defined( 'W3W_JS_LIB_CDN_URL' ) ) {
  define ( 'W3W_JS_LIB_CDN_URL', 'https://cdn.what3words.com/javascript-components@4.0.0/dist/what3words' );
}

/**
 * Defines the internationalisation domain
 */
if ( !defined( 'W3W_I18N_DOMAIN' ) ) {
  define ( 'W3W_I18N_DOMAIN', 'what3words' );
}

/**
 * The URL to the settings page for the w3w_autosuggest
 */
if ( !defined('W3W_SETTINGS_URL' ) ) {
  DEFINE( 'W3W_SETTINGS_URL', esc_html( admin_url( 'admin.php?page=what3words' ) ) );
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-w3w-autosuggest-activator.php
 */
if ( !function_exists( 'activate_w3w_autosuggest' ) ) {
  function activate_w3w_autosuggest() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-w3w-autosuggest-activator.php';
    W3W_Autosuggest_Activator::activate( W3W_PLUGIN_VERSION, W3W_SETTINGS_NAME );
  }
  register_activation_hook( __FILE__, 'activate_w3w_autosuggest' );
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-w3w-autosuggest-deactivator.php
 */
if ( !function_exists( 'deactivate_w3w_autosuggest' ) ) {
  function deactivate_w3w_autosuggest() {
    require_once plugin_dir_path( __FILE__ ) . 'includes/class-w3w-autosuggest-deactivator.php';
    W3W_Autosuggest_Deactivator::deactivate();
  }
  register_deactivation_hook( __FILE__, 'deactivate_w3w_autosuggest' );
}

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-w3w-autosuggest.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    4.0.0
 */
function run_w3w_autosuggest() {

  $plugin_name = 'w3w-autosuggest';

	$plugin = new W3W_Autosuggest(
    $plugin_name,
    W3W_PLUGIN_VERSION,
    W3W_AUTOSUGGEST_PLUGIN_BASENAME,
    W3W_SETTINGS_NAME,
    W3W_JS_LIB_CDN_URL,
    W3W_I18N_DOMAIN,
    W3W_SETTINGS_URL
  );
	$plugin->run();

}
run_w3w_autosuggest();
