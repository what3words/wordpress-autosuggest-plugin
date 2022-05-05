
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

  const isFullWooCommerce = W3W_AUTOSUGGEST_SETTINGS.woocommerce_enabled
  const isPartialWooCommerce = !isFullWooCommerce && W3W_AUTOSUGGEST_SETTINGS.woocommerce_activated

  function createAutosuggestComponent(targetSelector) {
    const target = document.querySelector(targetSelector);
    console.log(targetSelector, target)
    if (!target) return;
    const targetParent = target.parentElement
    const targetSibling = target.nextSibling
    const w3wComponent = document.createElement('what3words-autosuggest')

    w3wComponent.setAttribute('variant', 'inherit')
    w3wComponent.setAttribute('headers', JSON.stringify({
      'X-W3W-Plugin':
        `what3words-Wordpress/${W3W_AUTOSUGGEST_SETTINGS.version} (` + [
          `PHP/${W3W_AUTOSUGGEST_SETTINGS.php_version}`,
          `WordPress/${W3W_AUTOSUGGEST_SETTINGS.wp_version}`,
          `WooCommerce/${W3W_AUTOSUGGEST_SETTINGS.wc_version}`
        ].join(' ') + ')'
    }))
    w3wComponent.setAttribute('api_key', W3W_AUTOSUGGEST_SETTINGS.api_key)
    w3wComponent.setAttribute('return_coordinates', true)

    if (!isFullWooCommerce) {
      if (W3W_AUTOSUGGEST_SETTINGS.enable_placeholder) {
        target.attr('placeholder', W3W_AUTOSUGGEST_SETTINGS.placeholder)
      }
      if (W3W_AUTOSUGGEST_SETTINGS.enable_label) {
        const label = document.createElement('label')
        label.setAttribute('for', target.id || 'w3w_autosuggest_field')
        label.innerHTML = W3W_AUTOSUGGEST_SETTINGS.label
        targetParent.insertBefore(label, targetSibling)
      }
      if (W3W_AUTOSUGGEST_SETTINGS.save_nearest_place && !isPartialWooCommerce) {
        const nearestPlaceInput = document.createElement('input')
        nearestPlaceInput.setAttribute('type', 'hidden')
        nearestPlaceInput.setAttribute('name', `${target.name || 'what3words_3wa'}_nearest_place`)
        targetParent.insertBefore(nearestPlaceInput, targetSibling)
      }
    }
    if (W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_country) {
      w3wComponent.setAttribute('clip_to_country', W3W_AUTOSUGGEST_SETTINGS.clip_to_country)
    }
    if (W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_polygon) {
      const polygon = W3W_AUTOSUGGEST_SETTINGS.clip_to_polygon.trim()
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
    if (W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_bounding_box) {
      const bounding_box = [
        W3W_AUTOSUGGEST_SETTINGS.clip_to_bounding_box_ne_lat,
        W3W_AUTOSUGGEST_SETTINGS.clip_to_bounding_box_ne_lng,
        W3W_AUTOSUGGEST_SETTINGS.clip_to_bounding_box_sw_lat,
        W3W_AUTOSUGGEST_SETTINGS.clip_to_bounding_box_sw_lng,
      ].join(',')
      w3wComponent.setAttribute('clip_to_bounding_box', bounding_box)
    }
    if (W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_circle) {
      const circle = [
        W3W_AUTOSUGGEST_SETTINGS.clip_to_circle_lat,
        W3W_AUTOSUGGEST_SETTINGS.clip_to_circle_lng,
        W3W_AUTOSUGGEST_SETTINGS.clip_to_circle_radius,
      ].join(',')
      w3wComponent.setAttribute('clip_to_circle', circle)
    }

    return w3wComponent
  }

  function attachEventListeners(w3wComponent, targetSelector) {
    const target = document.querySelector(targetSelector)
    const billingFields = document.querySelector( '.woocommerce-billing-fields' )
    const isBilling = billingFields ? billingFields.contains(target) : false
    const country = $( isBilling ? '#billing_country' : '#shipping_country' )

    if (country) {
      country.on('change', function(e) {
        if (
          !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_country &&
          !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_circle &&
          !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_bounding_box &&
          !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_polygon
        ) {
          w3wComponent.setAttribute('clip_to_country', e.target.value)
        }
      })
      country.trigger('change')
    }
      
    w3wComponent.addEventListener('selected_suggestion', function (e) {
      const nearestPlace = e.detail.suggestion.nearestPlace
      const isBilling = document.querySelector( '.woocommerce-billing-fields' ).contains(target)
      const sameAddress = !document.querySelector('#ship-to-different-address-checkbox').checked || true
      
      const npElem = document.querySelector(`input[name="${target.name || 'what3words_3wa'}_nearest_place"]`)
      const npElem2 = document.querySelector(isBilling ? '#billing_nearest_place' : '#shipping_nearest_place')
      if (npElem) npElem.value = nearestPlace;
      if (npElem2) npElem2.value = nearestPlace;
      
      if (sameAddress) {
        const smElem = document.querySelector(!isBilling ? '#billing_nearest_place' : '#shipping_nearest_place');
        const smElem2 = document.querySelector(
          `input[name="${isBilling ? 'shipping_w3w_' : 'billing_w3w'}_nearest_place"]`
        )
        if (smElem) smElem.value = nearestPlace
        if (smElem2) smElem2.value = nearestPlace
      }
    });

    w3wComponent.addEventListener('coordinates_changed', function(e) {
      const coordinates = e.detail.coordinates
      const isBilling = document.querySelector( '.woocommerce-billing-fields' ).contains(target)
      const sameAddress = !(document.querySelector('#ship-to-different-address-checkbox').checked ?? false);
      const latElem = document.querySelector(isBilling ? '#billing_w3w_lat' : '#shipping_w3w_lat')
      const lngElem = document.querySelector(isBilling ? '#billing_w3w_lng' : '#shipping_w3w_lng')
      if (latElem) latElem.value = coordinates.lat
      if (lngElem) lngElem.value = coordinates.lng
      if (sameAddress) {
        const smLatElem = document.querySelector(!isBilling ? '#billing_w3w_lat' : '#shipping_w3w_lat')
        const smLngElem = document.querySelector(!isBilling ? '#billing_w3w_lng' : '#shipping_w3w_lng')
        if (smLatElem) smLatElem.value = coordinates.lat
        if (smLngElem) smLngElem.value = coordinates.lng
      }
    });
  }

  function addShippingComponent() {
    const component = document.querySelector('what3words-autosuggest[name="shipping_w3w"]')
    const shippingTarget = document.querySelector('#w3w-shipping')
    const shippingTargetSibling = shippingTarget.nextSibling
    const shippingTargetParent = shippingTarget.parentElement

    const shippingW3wComponent = component || createAutosuggestComponent(
      '#w3w-shipping',
    )
    if (!component && shippingW3wComponent) {
      shippingW3wComponent.setAttribute('name', 'shipping_w3w')
      attachEventListeners(shippingW3wComponent, '#w3w-shipping')
      shippingW3wComponent.appendChild(shippingTarget)
      shippingTargetParent.insertBefore(shippingW3wComponent, shippingTargetSibling)
    }
  }

  function addBillingComponent() {
    const component = document.querySelector('what3words-autosuggest[name="billing_w3w"]')
    const billingTarget = document.querySelector('#w3w-billing')
    const billingTargetSibling = billingTarget.nextSibling
    const billingTargetParent = billingTarget.parentElement

    const billingW3wComponent = component || createAutosuggestComponent(
      '#w3w-billing',
    )
    if (!component && billingW3wComponent) {
      billingW3wComponent.setAttribute('name', 'billing_w3w')
      attachEventListeners(billingW3wComponent, '#w3w-billing')
      billingW3wComponent.appendChild(billingTarget)
      billingTargetParent.insertBefore(billingW3wComponent, billingTargetSibling)
    }
  }

  function addByCustomSelector() {
    const exists = !!$( `what3words-autosuggest > ${W3W_AUTOSUGGEST_SETTINGS.selector}` ).length
    const targets = document.querySelectorAll(W3W_AUTOSUGGEST_SETTINGS.selector)

    if (exists) return;

    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const targetSelector = `${W3W_AUTOSUGGEST_SETTINGS.selector}:nth-of-type(${i + 1})`
      const targetSibling = target.nextSibling
      const targetParent = target.parentElement
      const w3wComponent = createAutosuggestComponent(targetSelector)
      console.log(target, w3wComponent)

      attachEventListeners(w3wComponent, targetSelector)

      w3wComponent.appendChild( target)
      targetParent.insertBefore(w3wComponent, targetSibling)
    }
  }

  function wooCommerce() {
    console.log('full-wc', isFullWooCommerce)
    console.log('partial-wc', isPartialWooCommerce)

    if (isFullWooCommerce || isPartialWooCommerce) {
      addBillingComponent();
      addShippingComponent();
    }
  }

  function raw() {
    if (isFullWooCommerce || isPartialWooCommerce) {
      addBillingComponent();
      addShippingComponent();
    } else {
      addByCustomSelector();
    }
  }

  raw();
  $( document.body ).on( 'init_checkout', wooCommerce);
  $( document.body ).on( 'updated_checkout', wooCommerce);
})( jQuery );
