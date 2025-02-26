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
   * you can get the value from js through wc.wcSettings.getSetting('key');
   */
  public function get_script_data()
  {
    // return [
    //   'apiKey' => get_option('w3w_api_key'),
    //   'language' => get_locale(),
    //   'ajaxUrl' => admin_url('admin-ajax.php'),
    //   'nonce' => wp_create_nonce('w3w_autosuggest_nonce'),
    //   'defaultCountry' => get_option('w3w_default_country', 'GB')
    // ];
    return [];
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