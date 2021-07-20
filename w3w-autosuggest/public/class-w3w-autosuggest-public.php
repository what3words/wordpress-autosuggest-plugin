<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/public
 * @author     what3words
 */
class W3W_Autosuggest_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    4.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    4.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

  /**
   * This modular javascript components distribution
   * 
   * @since    4.0.0
   * @access   private
   * @var      string    $js_comp_esm_lib  The handle for the modular JS script
   */
  private $js_comp_esm_lib;

  /**
   * This webpack-compiled javascript components distribution
   * 
   * @since    4.0.0
   * @access   private
   * @var      string    $js_comp_webpack_lib  The handle for the webpack JS script
   */
  private $js_comp_webpack_lib;

  private $settings_name;

  private $js_lib_cdn_url;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    4.0.0
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version, $settings_name, $js_lib_cdn_url ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
    $this->js_comp_esm_lib = $this->plugin_name . '-autosuggest-esm-js';
    $this->js_comp_webpack_lib = $this->plugin_name . '-autosuggest-webpack-js';
    $this->settings_name = $settings_name;
    $this->js_lib_cdn_url = $js_lib_cdn_url;

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    4.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style(
      $this->plugin_name,
      plugin_dir_url( __FILE__ ) . 'css/w3w-autosuggest-public.css',
      array(),
      $this->version,
      'all'
    );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    4.0.0
	 */
	public function enqueue_scripts() {
    global $wp_version;
    global $woocommerce;

    $settings = get_option( W3W_SETTINGS_NAME );
    $settings['wp_version'] = $wp_version;
    $settings['wc_version'] = isset( $woocommerce ) ? $woocommerce->version : 'N/A';
    $settings['php_version'] = phpversion();
    $data = 'const W3W_AUTOSUGGEST_SETTINGS = ' . json_encode( $settings ) . ';';

    /**
     * Add modular JS component script tag
     */
    wp_enqueue_script(
      $this->js_comp_esm_lib,
      $this->js_lib_cdn_url . '/what3words.esm.js',
      array(),
      $this->version,
      false
    );
    
    /**
     * Add webpack-compiled JS components script tag as a fallback for older browsers that don't support modular.
     */
    wp_enqueue_script(
      $this->js_comp_webpack_lib,
      $this->js_lib_cdn_url . '/what3words.js',
      array(),
      $this->version,
      false
    );

    /**
     * Add the WordPress plugin JS file in /public/js directory
     * 
     * N.B - dependencies are supplied 
     */
    $dependencies = array( 'jquery', $this->js_comp_esm_lib, $this->js_comp_webpack_lib );
		wp_enqueue_script(
      $this->plugin_name,
      plugin_dir_url( __FILE__ ) . 'js/w3w-autosuggest-public.js',
      $dependencies,
      $this->version,
      true
    );

    /**
     * Expose settings stored in get_options() to the JS files
     * https://developer.wordpress.org/reference/functions/wp_add_inline_script/
     * 
     * N.B - The data is injected 'before' the JS scripts so that it is available when they load
     */
    wp_add_inline_script(
      $this->plugin_name,
      $data,
      'before'
    );

	}

  /**
	 * Add module and nomodule attributes to javascript-components script tags using the script_loader_tag filter
   * https://developer.wordpress.org/reference/hooks/script_loader_tag/
	 *
	 * @since    4.0.0
	 */
  public function add_attribute( $tag, $handle, $src ) {

    if ( $handle === $this->js_comp_esm_lib ) {
      return '<script type="module" src="' . esc_url( $src ) . '"></script>';
    }

    if ( $handle === $this->js_comp_webpack_lib ) {
      return '<script nomodule src="' . esc_url( $src ) . '"></script>';
    }

    return $tag;

  }

  /**
	 * Adds inputs 'billing_w3w' and 'shipping_w3w' to a WooCommerce checkout page using the woocommerce_checkout_fields
   * filter
   * https://docs.woocommerce.com/document/tutorial-customising-checkout-fields-using-actions-and-filters/
	 *
	 * @since    4.0.0
	 */
  public function add_fields_to_checkout_form( $fields ) {

    $settings = get_option( W3W_SETTINGS_NAME );
    $label = $settings['enable_label'] ? $settings['label'] : 'what3words address';
    $placeholder = $settings['enable_placeholder'] ? $settings['placeholder'] : '';

    if ( $settings['woocommerce_enabled'] ) {

      $fields['billing']['billing_w3w'] = [
        'id' => 'w3w-billing',
        'label' => __( $label, 'what3words' ),
        'placeholder' => __( $placeholder, 'what3words' ),
        'required' => false,
        'class' => ['form-row-wide'],
        'clear' => true
      ];
      $fields['shipping']['shipping_w3w'] = [
        'id' => 'w3w-shipping',
        'label' => __( $label, 'what3words' ),
        'placeholder' => __( $placeholder, 'what3words' ),
        'required' => false,
        'class' => ['form-row-wide'],
        'clear' => true
      ];

      if ( $settings['save_nearest_place'] ) {

        $fields['billing']['billing_nearest_place'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => true,
          'class' => ['hidden', 'form-row-wide'],
        ];
        $fields['shipping']['shipping_nearest_place'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => true,
          'class' => ['hidden', 'form-row-wide'],
        ];

      }

      if ( $settings['return_coordinates'] ) {

        $fields['billing']['billing_w3w_lat'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => false,
          'class' => ['hidden', 'form-row-wide']
        ];
        $fields['billing']['billing_w3w_lng'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => false,
          'class' => ['hidden', 'form-row-wide']
        ];
        $fields['shipping']['shipping_w3w_lat'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => false,
          'class' => ['hidden', 'form-row-wide']
        ];
        $fields['shipping']['shipping_w3w_lng'] = [
          'type' => 'hidden',
          'required' => false,
          'clear' => false,
          'class' => ['hidden', 'form-row-wide']
        ];

      }

    }

    return $fields;

  }

  public function checkout_page( $order ) {

    $order_id = $order->get_id();
    $settings = get_option( W3W_SETTINGS_NAME );
    $billing_words = get_post_meta( $order_id, '_billing_w3w', true );
    $billing_nearest_place = get_post_meta( $order_id, '_billing_nearest_place', true );
    $shipping_words = get_post_meta( $order_id, '_shipping_w3w', true );
    $shipping_nearest_place = get_post_meta( $order_id, '_shipping_nearest_place', true );
    $label = $settings['enable_label'] ? $settings['label'] : 'w3w Address';

    require_once plugin_dir_path( __FILE__ ) . 'partials/w3w-autosuggest-checkout-page.php';

  }

}
