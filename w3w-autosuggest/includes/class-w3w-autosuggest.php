<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      4.0.0
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/includes
 * @author     Your Name <email@example.com>
 */
class W3W_Autosuggest {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    4.0.0
	 * @access   protected
	 * @var      W3W_Autosuggest_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    4.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The plugin basename.
	 *
	 * @since    4.0.0
	 * @access   protected
	 * @var      string    $plugin_basename    The string used for the plugin basename.
	 */
	protected $plugin_basename;

	/**
	 * The current version of the plugin.
	 *
	 * @since    4.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

  protected $settings_name;
  protected $js_lib_cdn_url;
  protected $i18n_domain;
  protected $settings_url;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    4.0.0
	 */
  public function __construct(
    $name,
    $version,
    $basename,
    $settings_name,
    $js_lib_cdn_url,
    $i18n_domain,
    $settings_url
  ) {

    $this->plugin_name = $name;
		$this->version = $version;
    $this->plugin_basename = $basename;
    $this->settings_name = $settings_name;
    $this->js_lib_cdn_url = $js_lib_cdn_url;
    $this->i18n_domain = $i18n_domain;
    $this->settings_url = $settings_url;

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - W3W_Autosuggest_Loader. Orchestrates the hooks of the plugin.
	 * - W3W_Autosuggest_i18n. Defines internationalization functionality.
	 * - W3W_Autosuggest_Admin. Defines all hooks for the admin area.
	 * - W3W_Autosuggest_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    4.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-w3w-autosuggest-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-w3w-autosuggest-i18n.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-w3w-autosuggest-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-w3w-autosuggest-public.php';

		$this->loader = new W3W_Autosuggest_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the W3W_Autosuggest_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    4.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new W3W_Autosuggest_i18n( $this->i18n_domain );

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    4.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new W3W_Autosuggest_Admin(
      $this->get_plugin_name(),
      $this->get_version(),
      $this->settings_name,
      $this->i18n_domain,
      $this->settings_url
    );
    $plugin_action_name = 'plugin_action_links_' . $this->plugin_basename;
    $wc_billing_action_name = 'woocommerce_admin_order_data_after_billing_address';
    $wc_shipping_action_name = 'woocommerce_admin_order_data_after_shipping_address';
    $order_data_filter = 'woocommerce_admin_order_preview_get_order_details';
    $wc_preview_action_name = 'woocommerce_admin_order_preview_start';

    $this->loader->add_action( 'admin_menu', $plugin_admin, 'options_page' );
    $this->loader->add_action( 'admin_notices', $plugin_admin, 'admin_notices' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );
    $this->loader->add_action( $wc_preview_action_name, $plugin_admin, 'render_order_data_before', 11, 2 );
    $this->loader->add_action( $wc_billing_action_name, $plugin_admin, 'add_billing_address_to_order_page' );
    $this->loader->add_action( $wc_shipping_action_name, $plugin_admin, 'add_shipping_address_to_order_page' );
    $this->loader->add_filter( $plugin_action_name, $plugin_admin, 'plugin_action_links', 10, 4 );
    $this->loader->add_filter( 'plugin_row_meta', $plugin_admin, 'plugin_row_meta', 10, 2 );
    $this->loader->add_filter( $order_data_filter, $plugin_admin, 'set_order_data', 10, 2 );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    4.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new W3W_Autosuggest_Public(
      $this->get_plugin_name(),
      $this->get_version(),
      $this->settings_name,
      $this->js_lib_cdn_url
    );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
    $this->loader->add_action( 'woocommerce_order_details_after_customer_details', $plugin_public, 'checkout_page' );
    $this->loader->add_filter( 'script_loader_tag', $plugin_public, 'add_attribute', 10, 3 );
    $this->loader->add_filter( 'woocommerce_checkout_fields', $plugin_public, 'add_fields_to_checkout_form', 10, 1 );

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    4.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     4.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     4.0.0
	 * @return    W3W_Autosuggest_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     4.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
