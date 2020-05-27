
const targetInputs = document.querySelectorAll(What3wordsSearchbox.input_selectors)

if (targetInputs) {
  document.head.insertAdjacentHTML("beforeend", '<style>\
  .woocommerce-checkout .what3words-autosuggest .what3words-input{\
    border-width:0;}\
  what3words-autosuggest .what3words-logo{\
    line-height:1; vertical-align:middle;}\
  </style>')
}

targetInputs.forEach(function(targetInput) {

  const w3wComponent = document.createElement('what3words-autosuggest')
  const targetParent = targetInput.parentNode

  if (What3wordsSearchbox.input_placeholder) {
    w3wComponent.setAttribute('placeholder', What3wordsSearchbox.input_placeholder)
  }
  if (What3wordsSearchbox.color) {
    w3wComponent.setAttribute('icon-color', What3wordsSearchbox.color)
  }

  targetParent.insertBefore(w3wComponent, targetInput)
  targetInput.style.display = 'none'
  targetInput.setAttribute('readonly', true)

  w3wComponent.addEventListener('valid', function(event) {
    // if valid
    if (event.detail) {
      targetInput.value = '///' + event.target.value
    } else {
      targetInput.value = ''
    }
  })
}) //  end forEach

if (document.querySelectorAll('#billing_country,#shipping_country').length && jQuery) {

  const $billingCountry = jQuery('[name="billing_country"]')
  if ($billingCountry) {
    $billingCountry.on('change',function(event) {
      jQuery('#billing_w3w').prev('what3words-autosuggest')
        .attr('clip-to-country', event.target.value)
    })
    $billingCountry.trigger('change')
  }
  const $shippingCountry = jQuery('[name="shipping_country"]')
  if ($shippingCountry) {
    $shippingCountry.on('change',function(event) {
      jQuery('#shipping_w3w').prev('what3words-autosuggest')
        .attr('clip-to-country', event.target.value)
    })
    $shippingCountry.trigger('change')
  }
} //  end if(document.querySelectorAll && jQuery)
