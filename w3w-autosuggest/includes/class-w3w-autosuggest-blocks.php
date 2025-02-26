<?php

use Automattic\WooCommerce\StoreApi\Schemas\V1\CheckoutSchema;


if (!defined('W3W_SHIPPING_ADDRESS_METADATA_KEY')) {
  DEFINE('W3W_SHIPPING_ADDRESS_METADATA_KEY', 'what3words_shipping_address');
}

if (!defined('W3W_BILLING_ADDRESS_METADATA_KEY')) {
  DEFINE('W3W_BILLING_ADDRESS_METADATA_KEY', 'what3words_billing_address');
}

class W3W_Autosuggest_Blocks
{
  public function __construct($loader)
  {
    $loader->add_action('woocommerce_blocks_loaded', $this, 'register_blocks_endpoint_data');
    $loader->add_action('woocommerce_blocks_checkout_block_registration', $this, 'add_blocks_to_checkout_form', 11);
    $loader->add_action('woocommerce_store_api_checkout_update_order_from_request', $this, 'update_order_meta', 10, 2);
    $loader->add_action('wp_enqueue_scripts', $this, 'enqueue_block_styles');
    $loader->add_action('woocommerce_after_order_details', $this, 'display_fields_on_order_confirmation_page');
  }

  public function cb_data_callback()
  {
    return array(
      'what3words_shipping_address' => '',
      'what3words_billing_address' => '',
    );
  }

  public function cb_schema_callback()
  {
    return array(
      'what3words_shipping_address' => array(
        'description' => __('What3words Shipping Address', 'what3words-autosuggest-blocks'),
        'type' => array('string', 'null'),
        'readonly' => false,
      ),
      'what3words_billing_address' => array(
        'description' => __('What3words Billing Address', 'what3words-autosuggest-blocks'),
        'type' => array('string', 'null'),
        'readonly' => false,
      ),
    );
  }

  public function register_blocks_endpoint_data()
  {
    if (function_exists('woocommerce_store_api_register_endpoint_data')) {
      woocommerce_store_api_register_endpoint_data(
        array(
          'endpoint' => CheckoutSchema::IDENTIFIER,
          'namespace' => 'what3words-autosuggest-blocks',
          'data_callback' => [$this, 'cb_data_callback'],
          'schema_callback' => [$this, 'cb_schema_callback'],
          'schema_type' => ARRAY_A,
        )
      );
    }
  }

  public function enqueue_block_styles()
  {
    if (is_wc_endpoint_url('order-received')) {
      wp_enqueue_style(
        'what3words-autosuggest-blocks-order-confirmed',
        plugins_url('', dirname(__FILE__)) . '/public/blocks/w3w-autosuggest-order-confirmed.css',
        array(),
        '1.0.0'
      );
    }

    if (is_checkout()) {
      wp_enqueue_style(
        'what3words-autosuggest-blocks',
        plugins_url('', dirname(__FILE__)) . '/public/blocks/w3w-autosuggest-blocks-frontend.css',
        array(),
        '1.0.0'
      );
    }
  }

  public function add_blocks_to_checkout_form($integration_registry)
  {
    if (!class_exists('W3W_Autosuggest_Blocks_Integration')) {
      require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-w3w-autosuggest-blocks-integration.php';
    }
    $integration_registry->register(new W3W_Autosuggest_Blocks_Integration());
  }

  public static function update_order_meta($order, $request)
  {
    $data = isset($request['extensions']['what3words-autosuggest-blocks']) ? $request['extensions']['what3words-autosuggest-blocks'] : array();

    if (isset($data['what3words_shipping_address'])) {
      $order->update_meta_data(W3W_SHIPPING_ADDRESS_METADATA_KEY, $data['what3words_shipping_address']);
    }
    if (isset($data['what3words_billing_address'])) {
      $order->update_meta_data(W3W_BILLING_ADDRESS_METADATA_KEY, $data['what3words_billing_address']);
    }
  }

  public function display_fields_on_order_confirmation_page($order)
  {
    $w3w_shipping_address = $order->get_meta(W3W_SHIPPING_ADDRESS_METADATA_KEY);
    $w3w_billing_address = $order->get_meta(W3W_BILLING_ADDRESS_METADATA_KEY);

    $query_params = array();
    if (!empty($w3w_shipping_address)) {
      $query_params['what3words_shipping_address'] = $w3w_shipping_address;
    }
    if (!empty($w3w_billing_address)) {
      $query_params['what3words_billing_address'] = $w3w_billing_address;
    }

    $query_string = !empty($query_params) ? '?' . http_build_query($query_params) : '';

    wp_enqueue_script(
      'what3words-autosuggest-blocks-order-confirmed',
      plugins_url('', dirname(__FILE__)) . '/public/blocks/w3w-autosuggest-order-confirmed.js' . $query_string,
      array(),
      '1.0.0',
      true
    );
  }

}