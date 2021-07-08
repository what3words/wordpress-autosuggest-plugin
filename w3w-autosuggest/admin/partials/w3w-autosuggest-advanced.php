<div class="row g-0 mb-4">
  <div class="col-12 bg-white py-3 px-3 mb-3">
    <div class="row g-0 dropstart">
      <div
        class="col-12 fs-3 dropdown-toggle mb-3"
        tabindex="11"
        data-testid="advanced_dropdown">Advanced Features</div>
      <div class="row">
        <div class="menu d-none">
          <div class="col-12 text mb-3 p-3" style="background: #f2f4f5;">
            For more information on how Autosuggest clipping works take a look at our <a href="https://developer.what3words.com">API docs</a>.
          </div>
          
          <form
            class="needs-validation"
            id="advanced"
            method="POST"
            action="<?php echo $this->settings_url; ?>"
            data-testid="advanced_form">
            <input type="hidden" name="advanced_form">
            <!--- Field --->
            <div class="col-12 mb-3 pb-3 ps-1 border-bottom">
              <label class="fw-normal d-flex flex-row mb-3" for="enable_placeholder">
                <div class="d-inline me-3">
                  <input
                    class="w3w-checkbox"
                    type="checkbox"
                    id="enable_placeholder"
                    name="enable_placeholder"
                    <?php if ( $settings['enable_placeholder'] ) echo "checked"; ?>
                    tabindex="12"
                    data-testid="enable_placeholder">
                </div>
                <div class="d-inline fw-bold">
                  Custom placeholder
                  <div class="fw-light fst-italic small">
                    This is the default placeholder displayed in the what3words address box. To override it enter your placeholder below.
                  </div>
                </div>
              </label>
              <div class="row g-1 mb-3">
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    id="placeholder"
                    name="placeholder"
                    placeholder="e.g. ///limit.broom.flip"
                    value="<?php echo $settings['placeholder']; ?>"
                    disabled
                    tabindex="13"
                    data-testid="placeholder">
                </div>
              </div>
            </div>

            <div class="col-12 text mb-3 p-3" style="background: #f2f4f5;">
              By default the what3words address field will inherit the shipping country set on the checkout and will limit the results displayed to only that country. To override this, please use the settings below.
            </div>

            <!--- Field --->
            <div class="col-12 mb-3 pb-3 ps-1 border-bottom">
              <label class="fw-normal d-flex flex-row mb-3" for="enable_clip_to_country">
                <div class="d-inline me-3">
                  <input
                    class="w3w-checkbox"
                    type="checkbox"
                    name="enable_clip_to_country"
                    id="enable_clip_to_country"
                    <?php if ( $settings['enable_clip_to_country'] ) echo "checked"; ?>
                    tabindex="14"
                    data-testid="enable_clip_to_country">
                </div>
                <div class="d-inline fw-bold">
                  Clip results to country
                  <div class="fw-light fst-italic small">
                    This displays results only for this country regardless of the country field. It is also possible to specify multiple countries comma separated, e.g. GB,IE
                  </div>
                </div>
              </label>
              <div class="row g-1 mb-3">
                <div class="col-12">
                  <label for="clip_to_country" class="form-label fw-bold">2 digit country ISO code</label>
                </div>
                <div class="col-md-3">
                  <input
                    type="text"
                    class="form-control"
                    id="clip_to_country"
                    name="clip_to_country"
                    placeholder="e.g. GB"
                    value="<?php echo $settings['clip_to_country']; ?>"
                    disabled
                    tabindex="15"
                    data-testid="clip_to_country">
                </div>
              </div>
            </div>

            <!--- Field --->
            <div class="col-12 mb-3 pb-3 ps-1 border-bottom">
              <label class="fw-normal d-flex flex-row mb-3" for="enable_clip_to_circle">
                <div class="d-inline me-3">
                  <input
                    class="w3w-checkbox"
                    type="checkbox"
                    id="enable_clip_to_circle"
                    name="enable_clip_to_circle"
                    <?php if ( $settings['enable_clip_to_circle'] ) echo "checked"; ?>
                    tabindex="16"
                    data-testid="enable_clip_to_circle">
                </div>
                <div class="d-inline fw-bold">
                  Clip results to a circle
                  <div class="fw-light fst-italic small">
                    This displays results only for the circle regardless of the country field, based on the centre of the circle and the radius.
                  </div>
                </div>
              </label>
              <div class="row g-1 mb-2">
                <div class="col">
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="clip_to_circle_lat" class="form-label fw-bold">Latitude coordinates</label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_circle_lat"
                        name="clip_to_circle_lat"
                        placeholder="e.g. 51.508354"
                        value="<?php echo $settings['clip_to_circle_lat']; ?>"
                        disabled
                        tabindex="17"
                        data-testid="clip_to_circle_lat">
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col-12">
                      <label for="clip_to_circle_lng" class="form-label fw-bold">Longitude coordinates</label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_circle_lng"
                        name="clip_to_circle_lng"
                        placeholder="e.g. -0.12549861"
                        value="<?php echo $settings['clip_to_circle_lng']; ?>"
                        disabled
                        tabindex="18"
                        data-testid="clip_to_circle_lng">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-1">
                <div class="col-6">
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="clip_to_circle_radius" class="form-label fw-bold">Radius (km)</label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="1"
                        class="form-control"
                        id="clip_to_circle_radius"
                        name="clip_to_circle_radius"
                        placeholder="e.g. 10"
                        value="<?php echo $settings['clip_to_circle_radius']; ?>"
                        disabled
                        tabindex="19"
                        data-testid="clip_to_circle_radius">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!--- Field --->
            <div class="col-12 mb-3 pb-3 ps-1 border-bottom">
              <label class="fw-normal d-flex flex-row mb-3" for="enable_clip_to_bounding_box">
                <div class="d-inline me-3">
                  <input
                    class="w3w-checkbox"
                    type="checkbox"
                    id="enable_clip_to_bounding_box"
                    name="enable_clip_to_bounding_box"
                    <?php if ( $settings['enable_clip_to_bounding_box'] ) echo "checked"; ?>
                    tabindex="20"
                    data-testid="enable_clip_to_bounding_box">
                </div>
                <div class="d-inline fw-bold">
                  Clip results to a bounding box
                  <div class="fw-light fst-italic small">
                    This displays results only for the bounding box regardless of the country field.
                  </div>
                </div>
              </label>
              <div class="row g-1 mb-2">
                <div class="col">
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="clip_to_bounding_box_sw_lat" class="form-label fw-bold">
                        Southwest latitude coordinates
                      </label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_bounding_box_sw_lat"
                        name="clip_to_bounding_box_sw_lat"
                        placeholder="e.g. 51.508354"
                        value="<?php echo $settings['clip_to_bounding_box_sw_lat']; ?>"
                        disabled
                        tabindex="21"
                        data-testid="clip_to_bounding_box_sw_lat">
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col-12">
                      <label for="clip_to_bounding_box_sw_lng" class="form-label fw-bold">
                        Southwest longitude coordinates
                      </label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_bounding_box_sw_lng"
                        name="clip_to_bounding_box_sw_lng"
                        placeholder="e.g. -0.12549861"
                        value="<?php echo $settings['clip_to_bounding_box_sw_lng']; ?>"
                        disabled
                        tabindex="22"
                        data-testid="clip_to_bounding_box_sw_lng">
                    </div>
                  </div>
                </div>
              </div>
              <div class="row g-1">
                <div class="col">
                  <div class="row mb-3">
                    <div class="col-12">
                      <label for="clip_to_bounding_box_ne_lat" class="form-label fw-bold">
                        Northeast latitude coordinates
                      </label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_bounding_box_ne_lat"
                        name="clip_to_bounding_box_ne_lat"
                        placeholder="e.g. 51.508354"
                        value="<?php echo $settings['clip_to_bounding_box_ne_lat']; ?>"
                        disabled
                        tabindex="23"
                        data-testid="clip_to_bounding_box_ne_lat">
                    </div>
                  </div>
                </div>
                <div class="col">
                  <div class="row">
                    <div class="col-12">
                      <label for="clip_to_bounding_box_ne_lng" class="form-label fw-bold">
                        Northeast longitude coordinates
                      </label>
                    </div>
                    <div class="col-9">
                      <input
                        type="number"
                        step="any"
                        class="form-control"
                        id="clip_to_bounding_box_ne_lng"
                        name="clip_to_bounding_box_ne_lng"
                        placeholder="e.g. -0.12549861"
                        value="<?php echo $settings['clip_to_bounding_box_ne_lng']; ?>"
                        disabled
                        tabindex="24"
                        data-testid="clip_to_bounding_box_ne_lng">
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!--- Field --->
            <div class="col-12 mb-3 pb-3 ps-1">
              <label class="fw-normal d-flex flex-row mb-3" for="enable_clip_to_polygon">
                <div class="d-inline me-3">
                  <input
                    class="w3w-checkbox"
                    type="checkbox"
                    id="enable_clip_to_polygon"
                    name="enable_clip_to_polygon"
                    <?php if ( $settings['enable_clip_to_polygon'] ) echo "checked"; ?>
                    tabindex="25"
                    data-testid="enable_clip_to_polygon">
                </div>
                <div class="d-inline fw-bold">
                  Clip results to a polygon
                  <div class="fw-light fst-italic small">
                    This displays results only for the polygon regardless of the country field. The polygon should be closed, i.e. the first coordinates should also be repeated as the last coordinates.
                  </div>
                </div>
              </label>
              <div class="row g-1 mb-2">
                <div class="col-12">
                  <label for="clip_to_polygon" class="form-label fw-bold">
                    Longitude & latitude coordinates
                    <div class="fw-light fst-italic small">
                      Accepts polygon coordinates in geojson coordinates format (longitude, latitude). A polygon can be created using <a href="https://geojson.io" target="_blank">https://geojson.io</a> and the coordinates block copied into here:
                    </div>
                  </label>
                </div>
                <div class="col-9">
                  <textarea
                    class="form-control"
                    id="clip_to_polygon"
                    name="clip_to_polygon"
                    placeholder="e.g.
                      [
                        -1.8237304687499998,
                        53.05442186546102
                      ],
                      [
                        -3.14208984375,
                        52.29504228453735
                      ],
                      [
                        -1.77978515625,
                        51.23440735163459
                      ],
                      [
                        -1.8237304687499998,
                        53.05442186546102
                      ]"
                    disabled
                    tabindex="26"
                    rows="20"
                    style="width: 100%"
                    data-testid="clip_to_polygon"><?php echo $settings['clip_to_polygon']; ?></textarea>
                </div>
              </div>
            </div>

            <!--- Button --->
            <div class="col-12 mb-3">
              <button
                class="button button-primary"
                type="submit"
                style="width: 134px;"
                tabindex="27"
                data-testid="save_advanced">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>