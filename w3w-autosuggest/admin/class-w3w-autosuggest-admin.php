<?php


/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/admin
 * @author     Your Name <email@example.com>
 */
if ( !class_exists( 'W3W_Autosuggest_Admin' ) ) {
  class W3W_Autosuggest_Admin {
    
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
    
    private $settings_name;
    
    private $i18n_domain;
    
    private $settings_url;
    
    /**
     * Initialize the class and set its properties.
     *
     * @since    4.0.0
     * @param      string    $plugin_name       The name of this plugin.
     * @param      string    $version    The version of this plugin.
     */
    public function __construct( $plugin_name, $version, $settings_name, $i18n_domain, $settings_url ) {
      
      $this->plugin_name = $plugin_name;
      $this->version = $version;
      $this->settings_name = $settings_name;
      $this->i18n_domain = $i18n_domain;
      $this->settings_url = $settings_url;
      
      $this->handle_form_submission( $_POST );

    }

    /**
     * Register the stylesheets for the admin area.
     *
     * @since    4.0.0
     */
    public function enqueue_styles() {

      /**
       * This function is provided for demonstration purposes only.
       *
       * An instance of this class should be passed to the run() function
       * defined in Plugin_Name_Loader as all of the hooks are defined
       * in that particular class.
       *
       * The Plugin_Name_Loader will then create the relationship
       * between the defined hooks and the functions defined in this
       * class.
       */
      wp_enqueue_style(
        $this->plugin_name,
        plugin_dir_url( __FILE__ ) . 'css/w3w-autosuggest-admin.css',
        array(),
        $this->version,
        'all'
      );

    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    4.0.0
     */
    public function enqueue_scripts() {

      /**
       * This function is provided for demonstration purposes only.
       *
       * An instance of this class should be passed to the run() function
       * defined in Plugin_Name_Loader as all of the hooks are defined
       * in that particular class.
       *
       * The Plugin_Name_Loader will then create the relationship
       * between the defined hooks and the functions defined in this
       * class.
       */
      wp_enqueue_script(
        $this->plugin_name,
        plugin_dir_url( __FILE__ ) . 'js/w3w-autosuggest-admin.js',
        array(),
        $this->version,
        false
      );

    }

    public function options_page() {

      $parent_slug = 'what3words';

      add_menu_page(
        __( 'what3words', $this->i18n_domain ),
        __( 'what3words', $this->i18n_domain ),
        'manage_options',
        $parent_slug,
        array( $this, 'run' ),
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDI1LjMuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IndoYXQzd29yZHMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCAyMCAyMCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjAgMjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHBhdGggZD0iTTE2LjksMkgzLjFDMi41LDIsMiwyLjUsMiwzLjF2MTMuN0MyLDE3LjUsMi41LDE4LDMuMSwxOGgxMy43YzAuNiwwLDEuMS0wLjUsMS4xLTEuMVYzLjFDMTgsMi41LDE3LjUsMiwxNi45LDJ6IE01LjgsMTMuNQoJYy0wLjMtMC4xLTAuNS0wLjQtMC40LTAuN2wyLTZjMC4xLTAuMywwLjQtMC41LDAuNy0wLjRjMC4zLDAuMSwwLjUsMC40LDAuNCwwLjdjMCwwLDAsMCwwLDBsLTIsNkM2LjQsMTMuNSw2LjEsMTMuNiw1LjgsMTMuNXoKCSBNOC44LDEzLjVjLTAuMy0wLjEtMC41LTAuNC0wLjQtMC43bDItNmMwLjEtMC4zLDAuNC0wLjUsMC43LTAuNGMwLjMsMC4xLDAuNSwwLjQsMC40LDAuN2MwLDAsMCwwLDAsMGwtMiw2CglDOS40LDEzLjUsOS4xLDEzLjYsOC44LDEzLjVMOC44LDEzLjV6IE0xNC42LDcuMmwtMiw2Yy0wLjEsMC4zLTAuNCwwLjUtMC43LDAuNGMtMC4zLTAuMS0wLjUtMC40LTAuNC0wLjdjMCwwLDAsMCwwLDBsMi02CgljMC4xLTAuMywwLjQtMC41LDAuNy0wLjRDMTQuNSw2LjYsMTQuNyw2LjksMTQuNiw3LjJDMTQuNiw3LjIsMTQuNiw3LjIsMTQuNiw3LjJ6Ii8+Cjwvc3ZnPgo=',
        58
      );

    }

    public function admin_notices() {

      $settings = get_option( $this->settings_name );

      if ( !isset( $settings['api_key'] ) || !$settings['api_key'] )

      require_once plugin_dir_path( __FILE__ ) . '/partials/add-admin-notice.php';

    }

    public function plugin_action_links( $actions, $plugin_file, $plugin_data, $context ) {

      $settings = sprintf(
        '<a href="%s">%s</a>', $this->settings_url, __( 'Settings', $this->i18n_domain )
      );
      array_unshift( $actions, $settings );

      return $actions;

    }

    /**
     * Show row meta on the plugin screen.
     *
     * @param mixed $links Plugin Row Meta.
     * @param mixed $file  Plugin Base file.
     *
     * @return array
     */
    public function plugin_row_meta( $links, $file ) {

      if ( $file === 'w3w-autosuggest/w3w-autosuggest.php' ) {

        $row_meta = array(
          'docs'    => '<a href="' . esc_url( apply_filters( 'w3w_autosuggest_docs_url', 'https://developer.what3words.com/tutorial/javascript-autosuggest-component-v4' ) ) . '" aria-label="' . esc_attr__( 'View Autosuggest documentation', $this->i18n_domain ) . '">' . esc_html__( 'Docs', $this->i18n_domain ) . '</a>',
          'apidocs' => '<a href="' . esc_url( apply_filters( 'what3words_apidocs_url', 'https://developer.what3words.com/public-api/docs#autosuggest' ) ) . '" aria-label="' . esc_attr__( 'View What3words Autosuggest docs', $this->i18n_domain ) . '">' . esc_html__( 'API docs', $this->i18n_domain ) . '</a>',
          'support' => '<a href="' . esc_url( apply_filters( 'what3words_support_url', 'https://developer.what3words.com/support' ) ) . '" aria-label="' . esc_attr__( 'Help & Support', $this->i18n_domain ) . '">' . esc_html__( 'Help & Support', $this->i18n_domain ) . '</a>',
        );
        
        return array_merge( $links, $row_meta );

      }

      return $links;

    }

    /**
     * Add the shipping 3wa to the checkout complete page using the woocommerce_admin_order_data_after_shipping_address
     * action
     * 
     * @since    4.0.0
     */
    public function add_shipping_address_to_order_page( $order ) {

      $order_id = $order->get_id();
      $settings = get_option( $this->settings_name );
      $words = get_post_meta( $order_id, '_shipping_w3w', true );
      $nearest_place = get_post_meta( $order_id, '_shipping_nearest_place', true );
      $lat = get_post_meta( $order_id, '_shipping_w3w_lat', true );
      $lng = get_post_meta( $order_id, '_shipping_w3w_lng', true );
      $label = $settings['enable_label'] ? $settings['label'] : 'w3w Address';

      require plugin_dir_path( __FILE__ ) . 'partials/add-address-to-order-page.php';

    }

    public function set_order_data( $data, $order ) {
      
      $order_id = $order->get_id();
      $settings = get_option( $this->settings_name );
      $words = get_post_meta( $order_id, '_shipping_w3w', true );

      if ( !!$words ) {
        
        $data['formatted_shipping_address'] .= '<br/>' . $words;
        $data['shipping_address_map_url'] = 'https://what3words.com/' .
                                            str_replace( '///', '', $words ) .
                                            '?application=wordpress';
      
      }

      return $data;

    }

    public function run() {

      require_once plugin_dir_path( __FILE__ ) . 'partials/w3w-autosuggest-admin-display.php';

    }

    private function handle_form_submission() {

      $settings = get_option( $this->settings_name );

      if ( isset( $_POST ) && $_POST ) {

        wp_die( 'FORM SUBMISSION DETECTED' );
        
        if ( isset( $_POST['settings_form'] ) ) {
          $settings['return_coordinates'] = false;
          $settings['save_nearest_place'] = false;
          $settings['enable_label'] = false;
        }

        if ( isset( $_POST['advanced_form'] ) ) {
          $settings['enable_placeholder'] = false;
          $settings['enable_clip_to_country'] = false;
          $settings['enable_clip_to_circle'] = false;
          $settings['enable_clip_to_bounding_box'] = false;
          $settings['enable_clip_to_polygon'] = false;
        }

        foreach ( $_POST as $key => $val ) {
          if ( $key === 'woocommerce_enabled' ) $settings[$key] = $val === 'on' ? true : false;
          else if ( $key === 'return_coordinates' && $val === 'on' ) $settings[$key] = true;
          else if ( $key === 'save_nearest_place' && $val === 'on' ) $settings[$key] = true;
          else if ( $key === 'enable_label' && $val === 'on' ) $settings[$key] = true;
          else if ( $key === 'enable_placeholder' ) $settings[$key] = $val === 'on' ? true : false;
          else if ( $key === 'enable_clip_to_country' ) $settings[$key] = $val === 'on' ? true : false;
          else if ( $key === 'enable_clip_to_circle' ) $settings[$key] = $val === 'on' ? true : false;
          else if ( $key === 'enable_clip_to_bounding_box' ) $settings[$key] = $val === 'on' ? true : false;
          else if ( $key === 'enable_clip_to_polygon' ) $settings[$key] = $val === 'on' ? true : false;
          else $settings[$key] = $val;
        }

        update_option( $this->settings_name, $settings );

      }

    }

  }

}
