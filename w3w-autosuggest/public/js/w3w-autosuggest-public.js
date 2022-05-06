
(function( $ ) {
  'use strict';

	/**
	 * All of the code for your public-facing JavaScript source
	 * should reside in this file.
	 *
	 * Note: It has been assumed you will write jQuery code here, so the
	 * $ function reference has been prepared for usage within the scope
	 * of this function.
	 *
	 * This enables you to define handlers, for when the DOM is ready:
	 *
	 * $(function() {
	 *
	 * });
	 *
	 * When the window is loaded:
	 *
	 * $( window ).load(function() {
	 *
	 * });
	 *
	 * ...and/or other possibilities.
	 *
	 * Ideally, it is not considered best practise to attach more than a
	 * single DOM-ready or window-load handler for a particular page.
	 * Although scripts in the WordPress core, Plugins and Themes may be
	 * practising this, we should strive to set a better example in our own work.
	 */

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
  }

  const default_fields = {
    default: {
      selector: W3W_AUTOSUGGEST_SETTINGS.selector,
      nearest_place_selector: '#what3words_3wa_nearest_place',
      lat_selector: '#what3words_3wa_lat',
      lng_selector: '#what3words_3wa_lng',
    }
  }
  
  const {
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
     * The CSS selector to target to extend with autosuggest functionality
     * @var {string} selector
     */
    selector,
    /**
     * Boolean flag indicating if the form coordinates should also be collected
     * @var {boolean} return_coordinates
     */
    return_coordinates,
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
  } = W3W_AUTOSUGGEST_SETTINGS;

  if (woocommerce_enabled && !woocommerce_activated) {
    console.error(new Error('WooCommerce is not installed!'))
    return
  }

  let components = []

  $( document ).on('ready', () => {
    if (woocommerce_enabled) {
      components = woocommerceEnabled()
    } else {
      components = customSelector()
    }
  });

  $( document.body ).on( 'init_checkout', () => {
    if (woocommerce_enabled) {
      woocommerceEnabled(components)
    } else {
      customSelector(components)
    }
  } );
  
  $( document.body ).on( 'updated_checkout', () => {
    if (woocommerce_enabled) {
      woocommerceEnabled(components)
    } else {
      customSelector(components)
    }
  } );

  function customSelector(components = []) {
    if (components.length > 0) {
      attachLabelToComponents(components)
      components.forEach(component => {
        attachEventListeners(W3W_AUTOSUGGEST_SETTINGS, component, woocommerce_checkout ? fields : default_fields)
      })
      return components
    }

    const targets = document.querySelectorAll(selector)
    const _components = attachComponentToTargets(targets);
    const [component] = _components
    attachLabelToComponents(_components)
    
    targets.forEach(target => {
      if (!woocommerce_checkout) {
        const name = 'what3words_3wa_nearest_place';
        const nearest_place = W3W_AUTOSUGGEST_SETTINGS.save_nearest_place
          ? generateHiddenInput(name)
          : null
        target.parentElement.appendChild(nearest_place)
      }

      attachEventListeners(W3W_AUTOSUGGEST_SETTINGS, component, woocommerce_checkout ? fields : default_fields);
    })

    return _components
  }

  function woocommerceEnabled(components = []) {
    return Object.entries(fields)
      .map(([, { selector }], index) => {
        const targets = document.querySelectorAll(selector)
        const [component] = components[index] ? [components[index]] : attachComponentToTargets(targets)
        attachLabelToComponents([component])
        attachEventListeners(W3W_AUTOSUGGEST_SETTINGS, component, fields)
        return component;
      })
  }

  function attachEventListeners(settings, component, fields) {
    const selected_suggestion_handler = function (e) {
      const nearest_place_val = e.detail.suggestion.nearestPlace
      const words = e.detail.suggestion.words
      const same_shipping = document.querySelector('#ship-to-different-address-checkbox')
        ? !document.querySelector('#ship-to-different-address-checkbox').checked
        : true

      if (!settings.save_nearest_place) return;
      if (woocommerce_enabled && !woocommerce_checkout) return;

      // If not woocommerce managed fields then should set value in all related fields
      if (!woocommerce_enabled || (woocommerce_enabled && same_shipping)) {
        Object.entries(fields).forEach(([, { nearest_place_selector }]) => {
          const nearest_place = document.querySelector(nearest_place_selector)
          console.log('np', fields, nearest_place_selector, nearest_place)
          if (nearest_place) {
            nearest_place.value = nearest_place_val;
          }
        });
        if (woocommerce_enabled) {
          const target = component.querySelector('input')
          const counterpart_selector = `#${target.id === 'w3w-billing'
            ? target.id.replace('billing', 'shipping')
            : target.id.replace('shipping', 'billing')
          }`
          const duplicate_to = document.querySelector(counterpart_selector)
          if (duplicate_to) duplicate_to.value = `///${words}`
        }
        return;
      }

      if (woocommerce_enabled) {
        const target = component.querySelector('input')
        const id = target.id || null
        if (id) {
          const [, { nearest_place_selector }] = Object.entries(fields).find(([, field]) => field.selector === `#${id}`)
          const nearest_place = document.querySelector(nearest_place_selector)
          if (nearest_place) nearest_place.value = nearest_place
        }
        return;
      }
    };
    const coordinates_changed_handler = function(e) {
      const coordinates = e.detail.coordinates
      const same_shipping = document.querySelector('#ship-to-different-address-checkbox')
        ? !document.querySelector('#ship-to-different-address-checkbox').checked
        : true

      if (!return_coordinates) return;
      if (woocommerce_enabled && !woocommerce_checkout) return;

      // If not woocommerce managed fields then should set value in all related fields
      if (!woocommerce_enabled || (woocommerce_enabled && same_shipping)) {
        Object.entries(fields).forEach(([, { lat_selector, lng_selector }]) => {
          const lat = document.querySelector(lat_selector)
          const lng = document.querySelector(lng_selector)

          if (lat && lng) {
            lat.value = coordinates.lat;
            lng.value = coordinates.lng;
          }
        });
        return;
      }

      if (woocommerce_enabled) {
        const target = component.querySelector('input')
        const id = target.id || null

        if (id) {
          const [, { lat_selector, lng_selector }] =
            Object.entries(fields).find(([, field]) => field.selector === `#${id}`)
          const lat = document.querySelector(lat_selector)
          const lng = document.querySelector(lng_selector)

          if (lat && lng) {
            lat.value = coordinates.lat
            lng.value = coordinates.lng
          }
        }
        return;
      }
    };
    component.removeEventListener('selected_suggestion', selected_suggestion_handler)
    component.removeEventListener('coordinates_changed', coordinates_changed_handler)
    component.addEventListener('selected_suggestion', selected_suggestion_handler)
    component.addEventListener('coordinates_changed', coordinates_changed_handler)
  }

  function attachLabelToComponents(components = []) {
    if (!enable_label) return
    if (woocommerce_enabled) return
    // if (!woocommerce_enabled && woocommerce_checkout) return

    components.forEach((component) => {
      const target = component.querySelector('input')
      if (target) {
        const target_label = document.querySelector(`label[for="${target.id}"]`) || document.createElement('label')
        target_label.setAttribute('for', target.id)
        target_label.textContent = label;
        if (!target_label.parentElement) document.insertBefore(target, target_label)
      }
    })
  }

  function attachComponentToTargets(targets) {
    const components = [];
  
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const component = generateAutosuggestComponent(W3W_AUTOSUGGEST_SETTINGS)
      const parent = target.parentElement
      const sibling = target.nextSibling

      component.appendChild(target);
      parent.insertBefore(component, sibling);
      components.push(component)
    }

    return components;
  }

  function generateHiddenInput(name) {
    const input = document.querySelector(`#${name}`) || document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.id = name
    input.setAttribute('data-testid', name)
    return input;
  }

  function generateAutosuggestComponent(settings) {
    const w3wComponent = document.createElement('what3words-autosuggest')

    w3wComponent.setAttribute('variant', 'inherit')
    w3wComponent.setAttribute('headers', JSON.stringify({
      'X-W3W-Plugin':
        `what3words-Wordpress/${settings.version} (` + [
          `PHP/${settings.php_version}`,
          `WordPress/${settings.wp_version}`,
          `WooCommerce/${settings.wc_version}`
        ].join(' ') + ')'
    }))
    w3wComponent.setAttribute('api_key', settings.api_key)
    w3wComponent.setAttribute('return_coordinates', true)

    if (settings.enable_placeholder) {
      target.setAttribute('placeholder', settings.placeholder)
    }
    if (settings.enable_clip_to_country) {
      w3wComponent.setAttribute('clip_to_country', settings.clip_to_country)
    }
    if (settings.enable_clip_to_polygon) {
      const polygon = settings.clip_to_polygon.trim()
        .split('],')
        .map(coords => {
          const [lng, lat] = coords.trim()
            .replace('[', '')
            .replace(']', '')
            .replace(/\s/g, '')
            .split(',')
          return `${lat.trim()},${lng.trim()}`
        })
        .join(',')
      w3wComponent.setAttribute('clip_to_polygon', polygon)
    }
    if (settings.enable_clip_to_bounding_box) {
      const bounding_box = [
        settings.clip_to_bounding_box_ne_lat,
        settings.clip_to_bounding_box_ne_lng,
        settings.clip_to_bounding_box_sw_lat,
        settings.clip_to_bounding_box_sw_lng,
      ].join(',')
      w3wComponent.setAttribute('clip_to_bounding_box', bounding_box)
    }
    if (settings.enable_clip_to_circle) {
      const circle = [
        settings.clip_to_circle_lat,
        settings.clip_to_circle_lng,
        settings.clip_to_circle_radius,
      ].join(',')
      w3wComponent.setAttribute('clip_to_circle', circle)
    }

    return w3wComponent
  }
})( jQuery );
