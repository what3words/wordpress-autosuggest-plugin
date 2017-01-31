<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       http://codetheory.london
 * @since      1.0.0
 *
 * @package    What3words_autosuggest_wp
 * @subpackage What3words_autosuggest_wp/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    What3words_autosuggest_wp
 * @subpackage What3words_autosuggest_wp/includes
 * @author     Jozsef Francovszky <franszo@codetheory.london>
 */
class What3words_autosuggest_wp_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'what3words_autosuggest_wp',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
