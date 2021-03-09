(function () {
  var targetInputs = document.querySelectorAll(What3wordsSearchbox.input_selectors)
  if (targetInputs.length === 0) { return }

  var inputStyles = getComputedStyle(targetInputs[0]),
      placeholderColor = getComputedStyle(targetInputs[0], ':placeholder').color

  /* temporary hack to fake style inheritance */
  document.head.insertAdjacentHTML("beforeend", '<style>\
  what3words-autosuggest{\
    background-color:' + inputStyles.backgroundColor + ';\
    box-sizing:border-box; \
    font-family:' + inputStyles.fontFamily + '; \
    width:100%;} \
  .what3words-autosuggest_input{\
    box-sizing:border-box; \
    background-color:' + inputStyles.backgroundColor + '; \
    border-width:' + inputStyles.borderTopWidth + ' ' + inputStyles.borderRightWidth + ' ' + inputStyles.borderBottomWidth + ' ' + inputStyles.borderLeftWidth + '; \
    border-style:' + inputStyles.borderTopStyle + ' ' + inputStyles.borderRightStyle + ' ' + inputStyles.borderBottomStyle + ' ' + inputStyles.borderLeftStyle + '; \
    border-color:' + inputStyles.borderTopColor + ' ' + inputStyles.borderRightColor + ' ' + inputStyles.borderBottomColor + ' ' + inputStyles.borderLeftColor + '; \
    color:' + inputStyles.color + '; \
    font-style:' + inputStyles.fontStyle + '; \
    font-family:' + inputStyles.fontFamily + '; \
    line-height:' + inputStyles.lineHeight + '; \
    padding-bottom:' + inputStyles.paddingBottom + '; \
    padding-top:' + inputStyles.paddingTop + ';} \
  .what3words-input{ \
    background-color:' + inputStyles.backgroundColor + '; \
    font-size:' + inputStyles.fontSize + '; \
    line-height:1; \
    padding:0;} \
  .what3words-input:-ms-input-placeholder{color:' + placeholderColor + ';} \
  .woocommerce-checkout .what3words-autosuggest .what3words-input{\
    border-width:0;} \
  .what3words-autosuggest-state { height:16px; } \
  what3words-autosuggest .options-wrap { width:100%; }\
  .what3words-error {\
    position:absolute; \
    top:100%;}\
  what3words-autosuggest .options{\
    top:100%;}\
  </style>');

  for (var i=0; i<targetInputs.length; i++) {
    // closure to stop targetInput etc getting hoisted
    (function(){
      var targetInput = targetInputs[i]
      var w3wComponent = document.createElement('what3words-autosuggest')
      var targetParent = targetInput.parentNode

      w3wComponent.setAttribute('api-key', What3wordsSearchbox.api_key)

      w3wComponent.headers = JSON.stringify({
        "X-W3W-Plugin":
          `what3words-Wordpress/${What3wordsSearchbox.w3_version} (` + [
            `PHP/${What3wordsSearchbox.php_version}`,
            `WordPress/${What3wordsSearchbox.wp_version}`,
            `WooCommerce/${What3wordsSearchbox.wc_version}`
          ].join(' ') + ')'
      })

      if (What3wordsSearchbox.input_placeholder) {
        w3wComponent.setAttribute('placeholder', What3wordsSearchbox.input_placeholder)
      }
      if (What3wordsSearchbox.color) {
        w3wComponent.setAttribute('icon-color', What3wordsSearchbox.color)
      }

      //  fake label association with new input
      if (targetInput.id) {
        var targetLabel = document.querySelector('[for="' + targetInput.id + '"]')
        targetLabel.addEventListener('click', function(event) {
          event.preventDefault()
          w3wComponent.querySelector('input').focus()
        })
      }

      //  forward clicks on bordered div to the actual input
      w3wComponent.addEventListener('click', function(event) {
        if (event.target.classList.contains('what3words-autosuggest_input')) {
          w3wComponent.querySelector('input').focus()
        }
      })

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
    })()
  } //  end for loop
})();

//  set clip-to-country property when address country is set on 
//  WooCommerce checkouts
(function() {
  var $ = jQuery.noConflict(),
      $billingCountry = $('[name="billing_country"]'),
      $shippingCountry = $('[name="shipping_country"]');

  if (!($billingCountry.length || $shippingCountry.length)) return;
  $billingCountry.on('change', function(event) {
    $('#billing_w3w').prev('what3words-autosuggest')
      .attr('clip-to-country', event.target.value)
  })
  $billingCountry.trigger('change')
  $shippingCountry.on('change',function(event) {
    $('#shipping_w3w').prev('what3words-autosuggest')
      .attr('clip-to-country', event.target.value)
  })
  $shippingCountry.trigger('change')
})();
