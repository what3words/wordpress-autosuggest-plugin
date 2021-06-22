<?php

/**
 * Adds 3wa information to the order preview page
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/admin/partials
 */
?>
<!-- This file should primarily consist of HTML with a little bit of PHP. -->

<div class="wc-order-preview-addresses">
  <div class="wc-order-preview-address">
    <strong>{{data.label_w3w}}</strong>
    <a href="https://what3words.com/{{data.shipping_w3w}}?partner=wordpress" target="_blank">
      ///{{data.shipping_w3w}}
    </a><br />
    <small>{{data.shipping_nearest_place}}</small>
  </div>
</div>