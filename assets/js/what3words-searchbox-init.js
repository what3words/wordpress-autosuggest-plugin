
if (typeof What3wordsSearchbox != "undefined") {

    console.log('settings:\n',What3wordsSearchbox)

    const targetInputs = document.querySelectorAll(`${What3wordsSearchbox.input_selectors}`)

    targetInputs.forEach(function(targetInput) {

      const w3wComponent = document.createElement('what3words-autosuggest')

      if (What3wordsSearchbox.lang) {
        w3wComponent.setAttribute('language', What3wordsSearchbox.lang)
      }
      if (What3wordsSearchbox.input_placeholder) {
        w3wComponent.setAttribute('placeholder', What3wordsSearchbox.input_placeholder)
      }

      const targetParent = targetInput.parentNode

      targetParent.insertBefore(w3wComponent, targetInput)
      targetInput.style.display = 'none'
      w3wComponent.addEventListener('valid', function(event) {
        // if valid
        if (event.detail) {
          targetInput.value = event.target.value
        } else {
          targetInput.value = ''
        }
      })

    })


}