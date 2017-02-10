<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://codetheory.london
 * @since             1.0.0
 * @package           What3words_autosuggest_wp
 *
 * @wordpress-plugin
 * Plugin Name:       what3words Autosuggest Wordpress plugin
 * Plugin URI:        http://what3words.com
 * Description:       A plugin that showing what3word address suggestions as you type in a field.
 * Version:           1.0.1
 * Author:            Jozsef Francovszky
 * Author URI:        http://codetheory.london
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       what3words_autosuggest_wp
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-what3words_autosuggest_wp-activator.php
 */
function activate_what3words_autosuggest_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-what3words_autosuggest_wp-activator.php';
	What3words_autosuggest_wp_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-what3words_autosuggest_wp-deactivator.php
 */
function deactivate_what3words_autosuggest_wp() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-what3words_autosuggest_wp-deactivator.php';
	What3words_autosuggest_wp_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_what3words_autosuggest_wp' );
register_deactivation_hook( __FILE__, 'deactivate_what3words_autosuggest_wp' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-what3words_autosuggest_wp.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_what3words_autosuggest_wp() {

	$plugin = new What3words_autosuggest_wp();
	$plugin->run();

}
run_what3words_autosuggest_wp();



// Hook in Woocommerce fields only when option is checked
$options = get_option('w3w_options');

if ($options['w3w_field_woocommerce_fields'] == 1) {

	// Hook in
	add_filter( 'woocommerce_checkout_fields' , 'custom_override_checkout_fields' );

	// Our hooked in function - $fields is passed via the filter!
	function custom_override_checkout_fields( $fields ) {
	     $fields['shipping']['shipping_w3w'] = array(
	        'label'     => __('3 word address', 'woocommerce'),
		    'placeholder'   => _x('3 word address', 'placeholder', 'woocommerce'),
		    'required'  => false,
		    'class'     => array('form-row-wide'),
		    'clear'     => true
	     );

	     $fields['billing']['billing_w3w'] = array(
	        'label'     => __('3 word address', 'woocommerce'),
		    'placeholder'   => _x('3 word address', 'placeholder', 'woocommerce'),
		    'required'  => false,
		    'class'     => array('form-row-wide'),
		    'clear'     => true
	     );

	     return $fields;
	}

	/**
	 * Display field values on the order edit page
	 */

	add_action( 'woocommerce_admin_order_data_after_shipping_address', 'my_custom_checkout_field_display_admin_order_meta', 10, 1 );

	add_action( 'woocommerce_admin_order_data_after_billing_address', 'my_custom_checkout_field_display_admin_billing_order_meta', 10, 1 );

	function my_custom_checkout_field_display_admin_order_meta($order){
	    echo '<p><strong>'.__('w3w Address').':</strong> ' . get_post_meta( $order->id, '_shipping_w3w', true ) . '</p>';
	}

	function my_custom_checkout_field_display_admin_billing_order_meta($order){
	    echo '<p><strong>'.__('w3w Address').':</strong> ' . get_post_meta( $order->id, '_billing_w3w', true ) . '</p>';
	}


	/**
	 * Add a 4th scanning place for Woocommerce template overrides within the plugin directory
	 */

	add_filter( 'woocommerce_locate_template', 'woo_adon_plugin_template', 1, 3 );
	   function woo_adon_plugin_template( $template, $template_name, $template_path ) {
	     global $woocommerce;
	     $_template = $template;
	     if ( ! $template_path )
	        $template_path = $woocommerce->template_url;

	     $plugin_path  = untrailingslashit( plugin_dir_path( __FILE__ ) )  . '/template/woocommerce/';

	    // Look within passed path within the theme - this is priority
	    $template = locate_template(
	    array(
	      $template_path . $template_name,
	      $template_name
	    )
	   );

	   if( ! $template && file_exists( $plugin_path . $template_name ) )
	    $template = $plugin_path . $template_name;

	   if ( ! $template )
	    $template = $_template;

	   return $template;
	}
}

add_filter( 'woocommerce_ship_to_different_address_checked', '__return_false' );


// Add scripts to wp_footer()
function w3w_autosuggest_footer_scripts() {
	$options = get_option('w3w_options');

		$elements = $options['w3w_field_input'];
		if ($elements != '') {
			if ($options['w3w_field_woocommerce_fields'] == 1) {
				$elements = $elements . ', ' . '#shipping_w3w, #billing_w3w';
			}
		} else {
			if ($options['w3w_field_woocommerce_fields'] == 1) {
				$elements = '#shipping_w3w, #billing_w3w';
			}
		}
	?>

	<script>
		;(function($) {

			var plugin_path = '<?php echo plugin_dir_path( __FILE__ ); ?>'

			$('<?php echo $elements; ?>').w3wAddress({
				debug: false,
				key: '<?php echo esc_attr( $options['w3w_field_api_key'] ); ?>',
				items_to_show: <?php echo esc_attr( $options['w3w_field_items_to_show'] ); ?>,
				country_selector: '<?php echo esc_attr( $options['w3w_field_country'] ); ?>',
				auto_detect_lang: <?php echo esc_attr( $options['w3w_field_lang_auto'] ); ?>,
				lang: '<?php echo esc_attr( $options['w3w_field_lang'] ); ?>',
				direction: '<?php echo esc_attr( $options['w3w_field_direction'] ); ?>',
				placeholder : '<?php echo esc_attr( $options['w3w_field_placeholder'] ); ?>',
				path_to_flags: '<?php echo plugin_dir_url( __FILE__ ) . 'public/images/flags/' ?>'
			});

		})(jQuery);
	</script>

<?php }
add_action( 'wp_footer', 'w3w_autosuggest_footer_scripts', 80 );



