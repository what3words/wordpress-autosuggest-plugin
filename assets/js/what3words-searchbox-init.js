
if (typeof What3wordsSearchbox != "undefined") {

  console.log('settings:\n',What3wordsSearchbox)

  const targetInputs = document.querySelectorAll(What3wordsSearchbox.input_selectors)

  if (targetInputs) {
    document.head.insertAdjacentHTML("beforeend", '<style>.woocommerce-checkout .what3words-autosuggest .what3words-input{border-width:0;}</style>')
  }

  targetInputs.forEach(function(targetInput) {

    const w3wComponent = document.createElement('what3words-autosuggest')
    const targetParent = targetInput.parentNode

    if (What3wordsSearchbox.lang) {
      w3wComponent.setAttribute('language', What3wordsSearchbox.lang)
    }
    if (What3wordsSearchbox.input_placeholder) {
      w3wComponent.setAttribute('placeholder', What3wordsSearchbox.input_placeholder)
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
  })  //  forEach
}