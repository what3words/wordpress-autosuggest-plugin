let components = [];

(function ($) {
  'use strict';

  const {
    /**
     * The API key provided for the plugin
     * @var {string} api_key
     */
    api_key,
    /**
     * Boolean flag indicating if the form should override the label
     * @var {boolean} enable_label
     */
    enable_label,
    /**
     * The label text to override for the component
     * @var {string} label
     */
    label,
    /**
     * Boolean flag indicating if the target input placeholder should overridden
     * @var {boolean} enable_placeholder
     */
    enable_placeholder,
    /**
     * The placeholder text to override for the target input
     * @var {string} placeholder
     */
    placeholder,
    /**
     * Boolean flag indicating if the autosuggest results should be clipped by country
     * @var {boolean} enable_clip_to_country
     */
    enable_clip_to_country,
    /**
     * The countries to clip to suggestion results to
     * @var {string} clip_to_country
     */
    clip_to_country,
    /**
     * Boolean flag indicating if the autosuggest results should be clipped within a polygon
     * @var {boolean} enable_clip_to_polygon
     */
    enable_clip_to_polygon,
    /**
     * The polygon to clip suggestion results to
     * @var {string} clip_to_polygon
     */
    clip_to_polygon,
    /**
     * Boolean flag indicating if the autosuggest results should be clipped to a bounding box
     * @var {boolean} enable_clip_to_bounding_box
     */
    enable_clip_to_bounding_box,
    /**
     * The North-East latitude of the bounding box to clip suggestion results to
     * @var {string} clip_to_bounding_box_ne_lat
     */
    clip_to_bounding_box_ne_lat,
    /**
     * The North-East longitude of the bounding box to clip suggestion results to
     * @var {string} clip_to_bounding_box_ne_lng
     */
    clip_to_bounding_box_ne_lng,
    /**
     * The South-West latitude of the bounding box to clip suggestion results to
     * @var {string} clip_to_bounding_box_sw_lat
     */
    clip_to_bounding_box_sw_lat,
    /**
     * The South-West longitude of the bounding box to clip suggestion results to
     * @var {string} clip_to_bounding_box_sw_lng
     */
    clip_to_bounding_box_sw_lng,
    /**
     * Boolean flag indicating if the autosuggest results should be clipped to a circle
     * @var {boolean} enable_clip_to_circle
     */
    enable_clip_to_circle,
    /**
     * The latitude of the circle center to clip suggestion results to
     * @var {string} clip_to_circle_lat
     */
    clip_to_circle_lat,
    /**
     * The longitude of the circle center to clip suggestion results to
     * @var {string} clip_to_circle_lng
     */
    clip_to_circle_lng,
    /**
     * The radius of the circle to clip suggestion results to
     * @var {string} clip_to_circle_radius
     */
    clip_to_circle_radius,
    /**
     * Boolean flag indicating if the form coordinates should also be collected
     * @var {boolean} return_coordinates
     */
    return_coordinates,
    /**
     * Boolean flag indicating if the form should save the selected 3wa nearest place
     * @var {boolean} save_nearest_place
     */
    save_nearest_place,
    /**
     * The CSS selector to target to extend with autosuggest functionality
     * @var {string} selector
     */
    selector,
    /**
     * Boolean flag indicating if WooCommerce plugin is installed
     * @var {boolean} woocommerce_activated
     */
    woocommerce_activated,
    /**
     * Boolean flag indicating if WooCommerce managed field is selected
     * @var {boolean} woocommerce_enabled
     */
    woocommerce_enabled,
    /**
     * Boolean flag indicating if the current page is the WooCommerce checkout page
     */
    woocommerce_checkout,
    /**
     * The current version of the w3w WordPress plugin
     * @var {string} version
     */
    version,
    /**
     * The current version of PHP
     * @var {string} php_version
     */
    php_version,
    /**
     * The current version of WordPress
     * @var {string} wp_version
     */
    wp_version,
    /**
     * The current version of woocommerce (if installed and enabled)
     * @var {string} [wc_version]
     */
    wc_version,
  } = W3W_AUTOSUGGEST_SETTINGS;

  const fields = {
    billing: {
      selector: '#w3w-billing',
      nearest_place_selector: '#billing_nearest_place',
      lat_selector: '#billing_w3w_lat',
      lng_selector: '#billing_w3w_lng',
    },
    shipping: {
      selector: '#w3w-shipping',
      nearest_place_selector: '#shipping_nearest_place',
      lat_selector: '#shipping_w3w_lat',
      lng_selector: '#shipping_w3w_lng',
    },
  };

  const default_fields = {
    default: {
      selector,
      nearest_place_selector: '#what3words_3wa_nearest_place',
      lat_selector: '#what3words_3wa_lat',
      lng_selector: '#what3words_3wa_lng',
    },
  };

  if (!api_key) {
    console.error(new Error('No what3words API key set!'));
    return;
  }
  if (woocommerce_enabled && !woocommerce_activated) {
    console.error(new Error('WooCommerce is not installed!'));
    return;
  }

  if (woocommerce_checkout) {
    $(document.body).on('init_checkout', async () => {
      if (woocommerce_enabled) {
        components = await woocommerceEnabled()
          .then((_components) => {
            const country = $( '#billing_country option:selected' ).first().val()
            const same_shipping = document.querySelector('#ship-to-different-address-checkbox')
              ? !document.querySelector('#ship-to-different-address-checkbox').checked
              : true
            _components[0].setAttribute('clip_to_country', country);
            if (same_shipping) _components[1].setAttribute('clip_to_country', country);

            $( '#billing_country' ).on( 'change' , () => {
              const country = $( '#billing_country option:selected' ).first().val()
              const same_shipping = document.querySelector('#ship-to-different-address-checkbox')
                ? !document.querySelector('#ship-to-different-address-checkbox').checked
                : true
              _components[0].setAttribute('clip_to_country', country);
              if (same_shipping) _components[1].setAttribute('clip_to_country', country);
            });
        
            $( '#shipping_country' ).on( 'change' , () => {
              const country = $( '#shipping_country option:selected' ).first().val()
              _components[1].setAttribute('clip_to_country', country);
            });

            $( '#ship-to-different-address-checkbox' ).on( 'change', () => {
              const same_shipping = document.querySelector('#ship-to-different-address-checkbox')
                ? !document.querySelector('#ship-to-different-address-checkbox').checked
                : true
              if (same_shipping) {
                _components[1].setAttribute('clip_to_country', _components[0].getAttribute('clip_to_country'));
              } else {
                const country = $( '#shipping_country option:selected' ).first().val()
                _components[1].setAttribute('clip_to_country', country);
              }
            });

            return _components
          });
      } else {
        components = customSelector();
      }
    });

    $(document.body).on('updated_checkout', () => {
      if (woocommerce_enabled) {
        woocommerceEnabled();
      } else {
        customSelector(components);
      }
    });
  } else {
    $(document).on('ready', async () => {
      if (woocommerce_enabled) {
        components = await woocommerceEnabled();
      } else {
        components = customSelector();
      }
    });
  }

  function customSelector(components = []) {
    if (components.length > 0) {
      attachLabelToComponents(components);
      components.forEach((component) => {
        attachEventListeners(
          component,
          woocommerce_checkout ? fields : default_fields
        );
      });
      return components;
    }

    const targets = document.querySelectorAll(selector);
    const _components = attachComponentToTargets(targets);
    const [component] = _components
    attachLabelToComponents(_components)
    
    targets.forEach((target, index) => {
      if (!woocommerce_checkout && save_nearest_place) {
        const name = 'what3words_3wa_nearest_place';
        const nearest_place = generateHiddenInput(name);
        target.parentElement.append(nearest_place)
      }

      attachEventListeners(_components[index], woocommerce_checkout ? fields : default_fields);
    })

    return _components;
  }

  function woocommerceEnabled() {
    if (woocommerce_enabled && !woocommerce_checkout) {
      return;
    }
    return Promise.all(
      Object.entries(fields).map(([, { selector }]) => {
        return new Promise((res) => {
          setTimeout(() => {
            const [target] = document.querySelectorAll(selector);
            if (!target) return;
            const ignore =
              target.parentNode.getAttribute('class') ===
              'what3words-autosuggest-input-wrapper';
            if (ignore) return;
              
            const [component] = attachComponentToTargets([target]);
            attachEventListeners(component, fields);
            res(component);
          }, 500);
        });
      })
    );
  }

  function attachEventListeners(component, fields) {
    const selected_suggestion_handler = function (e) {
      const nearest_place_val = e.detail.suggestion.nearestPlace;
      const words = e.detail.suggestion.words;
      const same_shipping = document.querySelector(
        '#ship-to-different-address-checkbox'
      )
        ? !document.querySelector('#ship-to-different-address-checkbox').checked
        : true;

      if (!save_nearest_place) return;
      if (woocommerce_enabled && !woocommerce_checkout) return;

      // If not woocommerce managed fields then should set value in all related fields
      if (!woocommerce_enabled || (woocommerce_enabled && same_shipping)) {
        Object.entries(fields).forEach(([, { nearest_place_selector }]) => {
          const nearest_place = document.querySelector(nearest_place_selector);
          if (nearest_place) {
            nearest_place.value = nearest_place_val;
          }
        });

        if (woocommerce_enabled) {
          const target = component.querySelector('input');
          const counterpart_selector = `#${
            target.id === 'w3w-billing'
              ? target.id.replace('billing', 'shipping')
              : target.id.replace('shipping', 'billing')
          }`;
          const duplicate_to = document.querySelector(counterpart_selector);
          if (duplicate_to) duplicate_to.value = `///${words}`;
        }

        return;
      }

      if (woocommerce_enabled) {
        const target = component.querySelector('input');
        const id = target.id || null;

        if (id) {
          const [, { nearest_place_selector }] = Object.entries(fields).find(
            ([, field]) => field.selector === `#${id}`
          );
          const nearest_place = document.querySelector(nearest_place_selector);
          if (nearest_place) nearest_place.value = nearest_place;
        }

        return;
      }
    };
    const coordinates_changed_handler = function (e) {
      const coordinates = e.detail.coordinates;
      const same_shipping = document.querySelector(
        '#ship-to-different-address-checkbox'
      )
        ? !document.querySelector('#ship-to-different-address-checkbox').checked
        : true;

      if (!return_coordinates) return;
      if (woocommerce_enabled && !woocommerce_checkout) return;

      // If not woocommerce managed fields then should set value in all related fields
      if (!woocommerce_enabled || (woocommerce_enabled && same_shipping)) {
        Object.entries(fields).forEach(([, { lat_selector, lng_selector }]) => {
          const lat = document.querySelector(lat_selector);
          const lng = document.querySelector(lng_selector);

          if (lat && lng) {
            lat.value = coordinates.lat;
            lng.value = coordinates.lng;
          }
        });
        return;
      }

      if (woocommerce_enabled) {
        const target = component.querySelector('input');
        const id = target.id || null;

        if (id) {
          const [, { lat_selector, lng_selector }] = Object.entries(
            fields
          ).find(([, field]) => field.selector === `#${id}`);
          const lat = document.querySelector(lat_selector);
          const lng = document.querySelector(lng_selector);

          if (lat && lng) {
            lat.value = coordinates.lat;
            lng.value = coordinates.lng;
          }
        }
        return;
      }
    };

    if (component) {
      component.removeEventListener(
        'selected_suggestion',
        selected_suggestion_handler
      );
      component.removeEventListener(
        'coordinates_changed',
        coordinates_changed_handler
      );
      component.addEventListener(
        'selected_suggestion',
        selected_suggestion_handler
      );
      component.addEventListener(
        'coordinates_changed',
        coordinates_changed_handler
      );
    }
  }

  function attachLabelToComponents(components = []) {
    if (!enable_label) return;
    if (woocommerce_enabled) return;

    components.forEach((component) => {
      const target = component.closest('input');
      if (target) {
        const target_label =
          document.querySelector(`label[for="${target.id}"]`) ||
          document.createElement('label');
        target_label.setAttribute('for', target.id);
        target_label.innerHTML = label;
        if (!target_label.parentElement)
          document.insertBefore(target, target_label);
      }
    });
  }

  function attachComponentToTargets(targets) {
    const components = [];
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i];
      const component = generateAutosuggestComponent();

      if (enable_placeholder) {
        target.setAttribute('placeholder', placeholder);
      }

      $(target).wrap(component);
      components.push(document.getElementById(target.id).closest('what3words-autosuggest'));
    }

    return components;
  }

  function generateHiddenInput(name) {
    const input =
      document.getElementById(name) || document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.id = name;
    input.setAttribute('data-testid', name);
    return input;
  }

  function generateAutosuggestComponent() {
    const w3wComponent = document.createElement('what3words-autosuggest');

    w3wComponent.setAttribute('variant', 'inherit');
    w3wComponent.setAttribute(
      'headers',
      JSON.stringify({
        'X-W3W-Plugin':
          `what3words-Wordpress/${version} (` +
          [
            `PHP/${php_version}`,
            `WordPress/${wp_version}`,
            `WooCommerce/${wc_version}`,
          ].join(' ') +
          ')',
      })
    );
    w3wComponent.setAttribute('api_key', api_key);
    w3wComponent.setAttribute('return_coordinates', true);

    if (enable_clip_to_country) {
      w3wComponent.setAttribute('clip_to_country', clip_to_country);
    }
    if (enable_clip_to_polygon) {
      const polygon = clip_to_polygon
        .trim()
        .split('],')
        .map((coords) => {
          const [lng, lat] = coords
            .trim()
            .replace('[', '')
            .replace(']', '')
            .replace(/\s/g, '')
            .split(',');
          return `${lat.trim()},${lng.trim()}`;
        })
        .join(',');
      w3wComponent.setAttribute('clip_to_polygon', polygon);
    }
    if (enable_clip_to_bounding_box) {
      const bounding_box = [
        clip_to_bounding_box_ne_lat,
        clip_to_bounding_box_ne_lng,
        clip_to_bounding_box_sw_lat,
        clip_to_bounding_box_sw_lng,
      ].join(',');
      w3wComponent.setAttribute('clip_to_bounding_box', bounding_box);
    }
    if (enable_clip_to_circle) {
      const circle = [
        clip_to_circle_lat,
        clip_to_circle_lng,
        clip_to_circle_radius,
      ].join(',');
      w3wComponent.setAttribute('clip_to_circle', circle);
    }

    return w3wComponent;
  }
})(jQuery);
