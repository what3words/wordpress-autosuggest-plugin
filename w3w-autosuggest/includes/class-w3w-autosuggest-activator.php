<?php

/**
 * Fired during plugin activation
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      4.0.0
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 * @author     what3words
 */
if ( !class_exists( 'W3W_Autosuggest_Activator' ) ) {
  class W3W_Autosuggest_Activator {

    /**
     * You would use this to provide a function to set up your plugin — for example, creating some default settings in
     * the options table.
     *
     * @since    4.0.0
     */
    public static function activate( $plugin_version, $settings_name ) {
      $min_version = '5.2';
      $curr_version = phpversion();
      $legacy_v1_name = 'w3w_options';
      $legacy_v3_name = 'What3wordsSearchbox';

      if ( version_compare( $min_version, $curr_version, '>' ) ) {
        deactivate_plugins( plugin_basename( __FILE__ ) );
        wp_die( 'This plugin requires PHP Version ' . $min_version . ' or greater.' );
        return;
      }

      /**
       * @param w3w_field_api_key => api_key
       * @param w3w_field_input => selector
       * @param w3w_field_placeholder => placeholder
       * @param w3w_field_woocommerce_fields => woocommerce_enabled
       */
      $legacy_v1 = get_option( $legacy_v1_name );

      /**
       * @param api_key => api_key
       * @param input_selectors => selector
       * @param input_placeholder => placeholder
       * @param woocommerce_enabled => woocommerce_enabled
       */
      $legacy_v3 = get_option( $legacy_v3_name );

      $api_key = isset( $legacy_v3['api_key'] )
        ? $legacy_v3['api_key']
        : isset( $legacy_v1['w3w_field_api_key'] )
          ? $legacy_v1['w3w_field_api_key']
          : ''
      ;

      $selector = isset( $legacy_v3['input_selectors'] )
        ? $legacy_v3['input_selectors']
        : isset( $legacy_v1['w3w_field_input'] )
          ? $legacy_v1['w3w_field_input']
          : ''
      ;

      $woocommerce_enabled = isset( $legacy_v3['woocommerce_enabled'] )
        ? $legacy_v3['woocommerce_enabled']
        : isset( $legacy_v1['w3w_field_woocommerce_fields'] )
          ? self::convert_to_boolean( $legacy_v1['w3w_field_woocommerce_fields'] )
          : true
      ;

      $placeholder = isset( $legacy_v3['input_placeholder'] )
        ? $legacy_v3['input_placeholder']
        : isset( $legacy_v1['w3w_field_placeholder'] )
          ? $legacy_v1['w3w_field_placeholder']
          : ''
      ;

      $enable_placeholder = strlen( $placeholder ) > 0;

      $default = [
        'version' => $plugin_version,
        'api_key' => $api_key,
        'selector' => $selector,
        'woocommerce_enabled' => $woocommerce_enabled,
        'return_coordinates' => false,
        'save_nearest_place' => false,
        'enable_label' => false,
        'label' => '',
        'enable_placeholder' => $enable_placeholder,
        'placeholder' => $placeholder,
        'enable_clip_to_country' => false,
        'clip_to_country' => '',
        'enable_clip_to_circle' => false,
        'clip_to_circle_lat' => '',
        'clip_to_circle_lng' => '',
        'clip_to_circle_radius' => '',
        'enable_clip_to_bounding_box' => false,
        'clip_to_bounding_box_sw_lat' => '',
        'clip_to_bounding_box_sw_lng' => '',
        'clip_to_bounding_box_ne_lat' => '',
        'clip_to_bounding_box_ne_lng' => '',
        'enable_clip_to_polygon' => false,
        'clip_to_polygon' => '',
      ];
      $settings = get_option( $settings_name, $default );
      update_option( $settings_name, $settings );
      delete_option( $legacy_v1_name );
      delete_option( $legacy_v3_name );
    }

    private static function convert_to_boolean( $value ) {

      if ( !is_string( $value ) ) return (bool) $value;

      switch ( strtolower( $value ) ) {
        
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
}
