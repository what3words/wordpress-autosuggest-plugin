<?php

/**
 * Adds 3wa information to the order page
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

<p>
  <strong><?php echo __( $label, $this->i18n_domain ); ?>:</strong><br />
  <a href="http://what3words.com/<?php echo str_replace( '///', '', $words ); ?>?partner=wordpress" target="_blank">
    <?php echo $words; ?>
  </a>
  <?php if ( isset( $nearest_place ) ) { ?>
  <br /><?php echo $nearest_place; ?>
  <?php } ?>
  <?php if ( isset( $lat ) ) { ?>
  <?php echo '(' . $lat . ', ' . $lng . ')'; ?>
  <?php } ?>
</p>