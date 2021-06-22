<div class="row g-0 mb-4">
  <div class="col-12 bg-white py-3 px-3 mb-3">
    <div class="row g-0">
      <div class="col-12 fs-3 mb-3">Settings</div>
      <form class="needs-validation" id="settings" method="POST" action="<?php echo $this->settings_url; ?>">
        <input type="hidden" name="settings_form">
        <!--- Field --->
        <div class="col-12 ps-1 mb-3 form-check d-flex align-items-center">
          <input
            class="me-3"
            type="radio"
            name="woocommerce_enabled"
            id="enable_w3w_managed_input"
            value="on"
            <?php if ( $settings['woocommerce_enabled'] ) echo "checked"; ?>
            tabindex="3"
            data-testid="enable_w3w_managed">
          <label class="form-check-label fw-normal" for="enable_w3w_managed_input">
            Add what3words Address Field to my checkout page for me (this is recommended for Woocommerce users)
            <div class="fw-light fst-italic small">
              This will add a #w3w-billing field to your checkout page.
            </div>
          </label>
        </div>

        <!--- Field --->
        <div class="col-12 ps-1 mb-3 form-check d-flex align-items-center">
          <input
            class="me-3"
            type="radio"
            name="woocommerce_enabled"
            id="enable_input_selector"
            value="off"
            <?php if ( !$settings['woocommerce_enabled'] ) echo "checked"; ?>
            tabindex="4"
            data-testid="enable_input_selector">
          <label class="form-check-label fw-normal" for="enable_input_selector">
            Convert an existing field to a what3words Address Field
            <div class="fw-light fst-italic small">
              This allows you to specify an existing #id or .class to transform into a what3words Address Field.
            </div>
          </label>
        </div>

        <!--- Field --->
        <div class="col-12 mb-3 pb-3 border-bottom">
          <div class="row g-1 ms-2 ps-4">
            <div class="col-12">
              <label for="input_selector" class="form-label fw-bold">Input selector</label>
            </div>
            <div class="col-md-6">
              <input
                type="text"
                class="form-control"
                id="input_selector"
                name="selector"
                placeholder="e.g. #w3w-address-field"
                value="<?php echo $settings['selector']; ?>"
                disabled
                tabindex="5"
                data-testid="input_selector">
            </div>
          </div>
        </div>

        <!--- Field --->
        <div class="col-12 mb-3 ps-1">
          <label class="fw-normal d-flex flex-row" for="return_coordinates">
            <div class="d-inline me-3">
              <input
                class="w3w-checkbox"
                type="checkbox"
                id="return_coordinates"
                name="return_coordinates"
                <?php if ( $settings['return_coordinates'] ) echo "checked"; ?>
                tabindex="6"
                data-testid="return_coordinates">
            </div>
            <div class="d-inline">
              Save coordinates
              <div class="fw-light fst-italic small">
                This will save the GPS coordinates of the what3words address and display them in the Order Details page.<br />
                NOTE: This will make additional calls to the what3words API using the <span class="fw-bold">convert-to-coordinates</span> function.
              </div>
            </div>
          </label>
        </div>

        <!--- Field --->
        <div class="col-12 mb-3 ps-1 pb-3 border-bottom">
          <label class="fw-normal d-flex flex-row" for="save_nearest_place">
            <div class="d-inline me-3">
              <input
                class="w3w-checkbox"
                type="checkbox"
                id="save_nearest_place"
                name="save_nearest_place"
                <?php if ( $settings['save_nearest_place'] ) echo "checked"; ?>
                tabindex="7"
                data-testid="save_nearest_place">
            </div>
            <div class="d-inline">
              Save nearest place
              <div class="fw-light fst-italic small">
                This will save the nearest place location of the what3words address and display it in the Order Details page.
              </div>
            </div>
          </label>
        </div>

        <!--- Field --->
        <div class="col-12 mb-4 ps-1">
          <label class="fw-normal d-flex flex-row mb-3" for="enable_label">
            <div class="d-inline me-3">
              <input
                class="w3w-checkbox"
                type="checkbox"
                id="enable_label"
                name="enable_label"
                <?php if ( $settings['enable_label'] ) echo "checked"; ?>
                tabindex="8"
                data-testid="enable_label">
            </div>
            <div class="d-inline">
              Add field label
              <div class="fw-light fst-italic small">
                This adds a label element to the created field. We recommend using the default label but you can customise this if needed.
              </div>
            </div>
          </label>
          <div class="row g-1 ms-2 ps-4">
            <div class="col-12"><label for="label" class="form-label fw-bold">Form field label</label></div>
            <div class="col-md-6">
              <input
                type="text"
                class="form-control"
                id="label"
                name="label"
                placeholder="what3words address (optional)"
                value="<?php echo $settings['label']; ?>"
                disabled
                tabindex="9"
                data-testid="label">
            </div>
          </div>
        </div>

        <!--- Button --->
        <div class="col-12 mb-3">
          <button
            class="btn btn-w3w text-white"
            type="submit"
            style="width: 134px;"
            tabindex="10"
            data-testid="save_settings">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</div>