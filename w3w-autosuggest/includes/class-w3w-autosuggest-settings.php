<?php

/**
 * Helper class for extracting and normalizing plugin settings.
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 * @author     what3words
 */
class W3W_Autosuggest_Settings_Helper
{

  /**
   * Get normalized settings array that can be used by both public and blocks integration.
   *
   * @param bool $include_system_info Whether to include WordPress/WooCommerce system information.
   * @return array Normalized settings array.
   */
  public static function get_exposed_settings($include_system_info = false)
  {
    global $wp_version, $woocommerce;

    $settings = get_option(W3W_SETTINGS_NAME);
    $exposed_settings = array();

    // System information (only for public-facing scripts)
    if ($include_system_info) {
      $has_woocommerce = class_exists('woocommerce');
      $exposed_settings['version'] = isset($settings['version']) ? $settings['version'] : '1.0.0';
      $exposed_settings['php_version'] = phpversion();
      $exposed_settings['wp_version'] = $wp_version;
      $exposed_settings['wc_version'] = isset($woocommerce) ? $woocommerce->version : 'N/A';
      $exposed_settings['woocommerce_activated'] = $has_woocommerce;
      $exposed_settings['woocommerce_checkout'] = $has_woocommerce ? is_checkout() : false;
    }

    // API key
    $exposed_settings['api_key'] = isset($settings['api_key']) ? $settings['api_key'] : '';

    // Version (if not already set by system info)
    if (!$include_system_info) {
      $exposed_settings['version'] = isset($settings['version']) ? $settings['version'] : '1.0.0';
    }

    // WooCommerce enabled
    if (isset($settings['woocommerce_enabled'])) {
      $exposed_settings['woocommerce_enabled'] = $settings['woocommerce_enabled'];
    }

    // Placeholder settings
    if (isset($settings['enable_placeholder'])) {
      $exposed_settings['enable_placeholder'] = $settings['enable_placeholder'];
    }
    if (isset($settings['placeholder']) && !empty($settings['placeholder'])) {
      $exposed_settings['placeholder'] = $settings['placeholder'];
    }

    // Label settings
    if (isset($settings['enable_label'])) {
      $exposed_settings['enable_label'] = $settings['enable_label'];
    }
    if (isset($settings['label']) && !empty($settings['label'])) {
      $exposed_settings['label'] = $settings['label'];
    }

    // Save nearest place
    if (isset($settings['save_nearest_place']) && !empty($settings['save_nearest_place'])) {
      $exposed_settings['save_nearest_place'] = $settings['save_nearest_place'];
    }

    // Clip to country
    if (isset($settings['enable_clip_to_country'])) {
      $exposed_settings['enable_clip_to_country'] = $settings['enable_clip_to_country'];
    }
    if (isset($settings['clip_to_country']) && !empty($settings['clip_to_country'])) {
      $exposed_settings['clip_to_country'] = $settings['clip_to_country'];
    }

    // Clip to bounding box
    if (isset($settings['enable_clip_to_bounding_box'])) {
      $exposed_settings['enable_clip_to_bounding_box'] = $settings['enable_clip_to_bounding_box'];
    }
    if (isset($settings['clip_to_bounding_box_ne_lat']) && !empty($settings['clip_to_bounding_box_ne_lat'])) {
      $exposed_settings['clip_to_bounding_box_ne_lat'] = $settings['clip_to_bounding_box_ne_lat'];
    }
    if (isset($settings['clip_to_bounding_box_ne_lng']) && !empty($settings['clip_to_bounding_box_ne_lng'])) {
      $exposed_settings['clip_to_bounding_box_ne_lng'] = $settings['clip_to_bounding_box_ne_lng'];
    }
    if (isset($settings['clip_to_bounding_box_sw_lat']) && !empty($settings['clip_to_bounding_box_sw_lat'])) {
      $exposed_settings['clip_to_bounding_box_sw_lat'] = $settings['clip_to_bounding_box_sw_lat'];
    }
    if (isset($settings['clip_to_bounding_box_sw_lng']) && !empty($settings['clip_to_bounding_box_sw_lng'])) {
      $exposed_settings['clip_to_bounding_box_sw_lng'] = $settings['clip_to_bounding_box_sw_lng'];
    }

    // Clip to circle
    if (isset($settings['enable_clip_to_circle'])) {
      $exposed_settings['enable_clip_to_circle'] = $settings['enable_clip_to_circle'];
    }
    if (isset($settings['clip_to_circle_lat']) && !empty($settings['clip_to_circle_lat'])) {
      $exposed_settings['clip_to_circle_lat'] = $settings['clip_to_circle_lat'];
    }
    if (isset($settings['clip_to_circle_lng']) && !empty($settings['clip_to_circle_lng'])) {
      $exposed_settings['clip_to_circle_lng'] = $settings['clip_to_circle_lng'];
    }
    if (isset($settings['clip_to_circle_radius']) && !empty($settings['clip_to_circle_radius'])) {
      $exposed_settings['clip_to_circle_radius'] = $settings['clip_to_circle_radius'];
    }

    // Return coordinates
    if (isset($settings['return_coordinates'])) {
      $exposed_settings['return_coordinates'] = $settings['return_coordinates'];
    }

    // Selector (only used in public-facing scripts)
    if (isset($settings['selector']) && !empty($settings['selector'])) {
      $exposed_settings['selector'] = $settings['selector'];
    }

    return $exposed_settings;
  }
}

