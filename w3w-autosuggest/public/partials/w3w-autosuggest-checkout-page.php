<?php

/**
 * Add the collected billing and shipping 3wa information to the order confirmation page (customer view)
 *
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/public/partials
 */
?>
<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<section class="woocommerce-columns woocommerce-columns--2 woocommerce-columns--addresses col2-set addresses">
  <?php if ( isset( $billing_words ) ) { ?>
  <div class="woocommerce-column woocommerce-column--1 woocommerce-column--billing-address col-1">
  </div>
  <?php } ?>

  <?php if ( isset( $shipping_words ) ) { ?>
  <div class="woocommerce-column woocommerce-column--2 woocommerce-column--shipping-address col-2">
    <p><strong>what3words Address:</strong></p>
    <p>
      <a
        href="http://what3words.com/<?php echo str_replace( '///', '', $shipping_words ); ?>"
        target="_blank"
        data-testid="shipping_words"><?php echo $shipping_words; ?></a>
    </p>
    <p><small data-testid="shipping_nearest_place"><?php echo $shipping_nearest_place; ?></small></p>
  </div>
  <?php } ?>
</section>
