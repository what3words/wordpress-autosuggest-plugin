
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

  function createAutosuggestComponent(target, targetParent, targetSibling) {
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
    
    if (!W3W_AUTOSUGGEST_SETTINGS.woocommerce_enabled) {
      if (W3W_AUTOSUGGEST_SETTINGS.enable_placeholder){
        target.setAttribute('placeholder', W3W_AUTOSUGGEST_SETTINGS.placeholder)
      }
      if (W3W_AUTOSUGGEST_SETTINGS.enable_label) {
        const label = document.createElement('label')
        label.setAttribute('for', target.id || 'w3w_autosuggest_field')
        label.innerHTML = W3W_AUTOSUGGEST_SETTINGS.label
        targetParent.insertBefore(label, targetSibling)
      }
      if (W3W_AUTOSUGGEST_SETTINGS.save_nearest_place) {
        const nearestPlaceInput = document.createElement('input')
        nearestPlaceInput.setAttribute('type', 'hidden')
        nearestPlaceInput.setAttribute('name', `${target.name || 'what3words_3wa'}_nearest_place`)
        targetParent.insertBefore(nearestPlaceInput, targetSibling)
        w3wComponent.addEventListener('selected_suggestion', function (e) {
          const nearestPlace = e.detail.suggestion.nearestPlace
          nearestPlaceInput.value = nearestPlace
        })
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

  if (W3W_AUTOSUGGEST_SETTINGS.woocommerce_enabled) {
    const billingCountry = $('#billing_country')
    const shippingCountry = $('#shipping_country')
    const billingTarget = document.querySelector('#w3w-billing')
    const shippingTarget = document.querySelector('#w3w-shipping')

    if (billingCountry && billingTarget) {
      const billingTargetSibling = billingTarget.nextSibling
      const billingTargetParent = billingTarget.parentElement
      const billingW3wComponent = createAutosuggestComponent(billingTarget, billingTargetParent, billingTargetSibling)
      billingW3wComponent.setAttribute('name', 'billing_w3w')
      
      if (W3W_AUTOSUGGEST_SETTINGS.save_nearest_place) {
        billingW3wComponent.addEventListener('selected_suggestion', function(e) {
          const nearestPlace = e.detail.suggestion.nearestPlace
          $('#billing_nearest_place').attr('value', nearestPlace)
        })
      }

      if (W3W_AUTOSUGGEST_SETTINGS.return_coordinates) {
        billingW3wComponent.addEventListener('coordinates_changed', function(e) {
          const coordinates = e.detail.coordinates
          $('#billing_w3w_lat').attr('value', coordinates.lat)
          $('#billing_w3w_lng').attr('value', coordinates.lng)
        })
      }
      
      billingW3wComponent.appendChild(billingTarget)
      billingTargetParent.insertBefore(billingW3wComponent, billingTargetSibling)

      if (
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_country &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_circle &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_bounding_box &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_polygon
      ) {
        billingCountry.on('change', function(e) {
          $('#w3w-billing').closest('what3words-autosuggest').attr('clip_to_country', e.target.value)
        })
        billingCountry.trigger('change')
      }
    }

    if (shippingCountry && shippingTarget) {
      const shippingTargetSibling = shippingTarget.nextSibling
      const shippingTargetParent = shippingTarget.parentElement
      const shippingW3wComponent = createAutosuggestComponent(
        shippingTarget,
        shippingTargetParent,
        shippingTargetSibling,
      )
      shippingW3wComponent.setAttribute('name', 'shipping_w3w')
  
      if (W3W_AUTOSUGGEST_SETTINGS.save_nearest_place) {
        shippingW3wComponent.addEventListener('selected_suggestion', function(e) {
          const nearestPlace = e.detail.suggestion.nearestPlace
          $('#shipping_nearest_place').attr('value', nearestPlace)
        })
      }

      if (W3W_AUTOSUGGEST_SETTINGS.return_coordinates) {
        shippingW3wComponent.addEventListener('coordinates_changed', function(e) {
          const coordinates = e.detail.coordinates
          $('#shipping_w3w_lat').attr('value', coordinates.lat)
          $('#shipping_w3w_lng').attr('value', coordinates.lng)
        })
      }
      
      shippingW3wComponent.appendChild(shippingTarget)
      shippingTargetParent.insertBefore(shippingW3wComponent, shippingTargetSibling)

      if (
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_country &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_circle &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_bounding_box &&
        !W3W_AUTOSUGGEST_SETTINGS.enable_clip_to_polygon
      ) {
        shippingCountry.on('change', function(e) {
          $('#w3w-shipping').closest('what3words-autosuggest').attr('clip_to_country', e.target.value)
        })
        shippingCountry.trigger('change')
      }
    }
  } else {
    const targets = document.querySelectorAll(W3W_AUTOSUGGEST_SETTINGS.selector)
   
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      const targetSibling = target.nextSibling
      const targetParent = target.parentElement
      const w3wComponent = createAutosuggestComponent(target, targetParent, targetSibling)
  
      w3wComponent.appendChild(target)
      targetParent.insertBefore(w3wComponent, targetSibling)
    }
  }

})( jQuery );

