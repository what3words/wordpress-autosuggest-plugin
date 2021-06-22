<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      4.0.0
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 * @author     what3words
 */
class W3W_Autosuggest_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    4.0.0
	 */
	public function load_plugin_textdomain( $domain ) {

		load_plugin_textdomain(
			$domain,
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
