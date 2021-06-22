<?php

/**
 * Provide an admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://developer.what3words.com/tutorial/installing-the-wordpress-plugin
 * @since      4.0.0
 *
 * @package    W3W_Autosuggest
 * @subpackage W3W_Autosuggest/admin/partials
 */

$settings = get_option( $this->settings_name );

if ( isset( $_POST ) && $_POST ) {
  
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
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">
  <div class="container-md">

  <div class="wp-header-end"></div>

    <div class="row">
      <div class="col max-width">

        <!--- Block: API Key --->
        <div class="row g-0 mb-4">
          <div class="col-md-9 bg-white py-3 px-3" style="max-width: 540px;">
            <div class="row g-0">
              
              <!--- Logo --->
              <div class="col-12 mb-2">
                <?php require_once( plugin_dir_path( __DIR__ ) . '/img/logo.svg' ); ?>
              </div>

              <div class="col-12 fs-3 mb-3">what3words Address Field</div>
              <div class="col-12 text mb-3">
                Add a what3words address field to your checkout page for validated entries, and precise delivery
                locations.
              </div>
              <?php if ( !$settings['api_key'] ) { ?>
              <div class="col-12 text mb-3">
                Before you can use the what3words search field, you will need to get a what3words API key.
              </div>
              <div class="col-12 text mb-3 w3w-warning p-3">
                <span class="fw-bold">Warning - </span>Your plugin will not validate entries until a what3words API key has been entered.
              </div>
              <div class="col-12 mb-3">
                <a
                  id="get_api_key"
                  class="btn btn-w3w text-white"
                  href="https://accounts.what3words.com/create-api-key"
                  target="_blank"
                  data-testid="get_api_key">
                  Get an API key
                </a>
              </div>
              <?php } ?>
              <form method="POST" action="<?php echo $this->settings_url; ?>">
                <input type="hidden" name="api_key_form">
                <div class="col-12 mb-3">
                  <div class="row g-1">
                    <div class="col-12">
                      <label for="w3w_api_key" class="form-label fw-bold">API Key (required)</label>
                    </div>
                    <div class="col-3">
                      <input
                        type="text"
                        class="form-control form-control-lg"
                        id="w3w_api_key"
                        name="api_key"
                        value="<?php echo $settings['api_key']; ?>"
                        tabindex="1"
                        data-testid="api_key">
                    </div>
                    <div class="col d-flex align-items-center">
                      <button
                        id="api_key_btn"
                        type="submit"
                        class="btn btn-w3w"
                        tabindex="2"
                        disabled
                        data-testid="save_api_key">Save</button>
                    </div>
                  </div>
                </div>
              </form>
              <?php if ( $settings['api_key'] ) { ?>
              <div class="col-12 mb-3 text" data-testid="manage_api_key">
                Manage your API keys in your <a href="https://accounts.what3words.com" class="btn-link" target="_blank">what3words account</a>.
              </div>
              <?php } ?>
            </div>
          </div>

          <div
            class="col-md bg-white d-none d-md-block w3w-bg"
            style="background: url('<?php echo plugin_dir_url( __DIR__ ) . '/img/phone-mockup.png'; ?>'); background-size: 253px auto; background-repeat: no-repeat; background-position: 10px 24px;">
          </div>
        </div>

        <!--- Block: Settings --->
        <?php require_once( plugin_dir_path( __FILE__ ) . 'w3w-autosuggest-settings.php' ); ?>

        <!--- Block: Advanced Settings --->
        <?php require_once( plugin_dir_path( __FILE__ ) . 'w3w-autosuggest-advanced.php' ); ?>
        

        <!--- Block: Troubleshooting --->
        <div class="row g-0 mb-4">
          <div class="col-12 bg-white py-3 px-3 mb-3">
            <div class="row g-0 dropstart">
              <div class="col-12 fs-3 dropdown-toggle mb-3" tabindex="28">Troubleshooting</div>
              <div class="menu d-none">
                <div class="col-12 text mb-3">
                  If you encounter any unexpected behaviour with the plugin or have issues with the field appearing on your checkout, please contact us at <a href="mailto:support@what3words.com" class="btn-link">support@what3words.com</a> and we'll be happy to help you.
                </div>

                <div class="col-12 text mb-3">
                  If you believe there is another checkout plugin conflicting with the what3words plugin, please give us as much detail as possible to assist with helping you.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
