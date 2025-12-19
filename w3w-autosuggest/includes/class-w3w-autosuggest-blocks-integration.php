<?php

use Automattic\WooCommerce\Blocks\Integrations\IntegrationInterface;

class W3W_Autosuggest_Blocks_Integration implements IntegrationInterface
{

  public function get_name()
  {
    return 'what3words-autosuggest';
  }

  public function initialize()
  {
    $this->register_block_frontend_scripts();
    $this->register_block_editor_scripts();
  }

  public function get_script_handles()
  {
    return ['what3words-autosuggest-blocks-frontend'];
  }

  public function get_editor_script_handles()
  {
    return ['what3words-autosuggest-blocks-editor'];
  }

  /**
   * Useful when you need to pass PHP data to your JavaScript code that will be used in the WooCommerce blocks
   * you can get the value from js through window.wcSettings['what3words-autosuggest_data'];
   */
  public function get_script_data()
  {
    $settings = get_option(W3W_SETTINGS_NAME);
    return [
      'apiKey' => isset($settings['api_key']) ? $settings['api_key'] : '',
      'version' => isset($settings['version']) ? $settings['version'] : '1.0.0',
      'jsLibCdnUrl' => 'https://cdn.what3words.com/javascript-components@4.1.1',
      'enableLabel' => isset($settings['enable_label']) ? $settings['enable_label'] : true,
      'label' => isset($settings['label']) ? $settings['label'] : 'what3words Address',
      'enablePlaceholder' => isset($settings['enable_placeholder']) ? $settings['enable_placeholder'] : false,
      'placeholder' => isset($settings['placeholder']) ? $settings['placeholder'] : '',
      'saveNearestPlace' => isset($settings['save_nearest_place']) ? $settings['save_nearest_place'] : false,
      'enableClipToCountry' => isset($settings['enable_clip_to_country']) ? $settings['enable_clip_to_country'] : false,
      'clipToCountry' => isset($settings['clip_to_country']) ? $settings['clip_to_country'] : '',
      'enableClipToBoundingBox' => isset($settings['enable_clip_to_bounding_box']) ? $settings['enable_clip_to_bounding_box'] : false,
      'clipToBoundingBoxNeLat' => isset($settings['clip_to_bounding_box_ne_lat']) ? $settings['clip_to_bounding_box_ne_lat'] : '',
      'clipToBoundingBoxNeLng' => isset($settings['clip_to_bounding_box_ne_lng']) ? $settings['clip_to_bounding_box_ne_lng'] : '',
      'clipToBoundingBoxSwLat' => isset($settings['clip_to_bounding_box_sw_lat']) ? $settings['clip_to_bounding_box_sw_lat'] : '',
      'clipToBoundingBoxSwLng' => isset($settings['clip_to_bounding_box_sw_lng']) ? $settings['clip_to_bounding_box_sw_lng'] : '',
      'enableClipToCircle' => isset($settings['enable_clip_to_circle']) ? $settings['enable_clip_to_circle'] : false,
      'clipToCircleLat' => isset($settings['clip_to_circle_lat']) ? $settings['clip_to_circle_lat'] : '',
      'clipToCircleLng' => isset($settings['clip_to_circle_lng']) ? $settings['clip_to_circle_lng'] : '',
      'clipToCircleRadius' => isset($settings['clip_to_circle_radius']) ? $settings['clip_to_circle_radius'] : '',
      'returnCoordinates' => isset($settings['return_coordinates']) ? $settings['return_coordinates'] : false,
    ];
  }

  public function register_block_editor_scripts()
  {
    $script_path = '/public/blocks/w3w-autosuggest-blocks-edit.js';
    $script_url = plugins_url('', dirname(__FILE__)) . $script_path;
    $script_asset_path = plugins_url('', dirname(__FILE__)) . '/public/blocks/index.asset.php';
    $script_asset = file_exists($script_asset_path)
      ? require $script_asset_path
      : [
        'dependencies' => [],
        'version' => $this->get_file_version($script_asset_path),
      ];

    wp_register_script(
      'what3words-autosuggest-blocks-editor',
      $script_url,
      $script_asset['dependencies'],
      $script_asset['version'],
      true
    );
  }

  public function register_block_frontend_scripts()
  {
    $script_path = '/public/blocks/w3w-autosuggest-blocks-frontend.js';
    $script_url = plugins_url('', dirname(__FILE__)) . $script_path;
    $script_asset_path = plugins_url('', dirname(__FILE__)) . '/public/blocks/w3w-autosuggest-blocks-frontend.asset.php';

    $script_asset = file_exists($script_asset_path)
      ? require $script_asset_path
      : [
        'dependencies' => [],
        'version' => $this->get_file_version($script_asset_path),
      ];

    wp_register_script(
      'what3words-autosuggest-blocks-frontend',
      $script_url,
      $script_asset['dependencies'],
      $script_asset['version'],
      true
    );
  }

  protected function get_file_version($file)
  {
    if (defined('SCRIPT_DEBUG') && SCRIPT_DEBUG && file_exists($file)) {
      return filemtime($file);
    }
    return "1.0.0";
  }

}