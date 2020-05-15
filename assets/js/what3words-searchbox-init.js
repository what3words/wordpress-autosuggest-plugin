
if (typeof What3wordsSearchbox != "undefined") {

    console.log('settings:\n',What3wordsSearchbox);

    const w3wComponent = document.createElement('what3words-autosuggest',
      { is: 'what3words-autosuggest' }
    )

    if (What3wordsSearchbox.language) {
      w3wComponent.language = What3wordsSearchbox.lang
      w3wComponent.setAttribute('language', What3wordsSearchbox.lang)
    }
    if (What3wordsSearchbox.placeholder) {
      w3wComponent.placeholder = What3wordsSearchbox.input_placeholder
    }
    console.log('w3wComponent', w3wComponent)

    const targetInputs = document.querySelectorAll(`${What3wordsSearchbox.input_selectors}`)

    targetInputs.forEach((targetInput) => {

      const originalName = targetInput.name || '',
            originalId   = targetInput.id || ''

      const targetParent = targetInput.parentNode

      targetParent.replaceChild(w3wComponent, targetInput)


      setTimeout(() => {
        const componentInstance = targetParent.querySelector('[is="what3words-autosuggest"]')
        const customInput =  componentInstance.querySelector('input')
        if (originalName) { customInput.name = originalName }
        if (originalId)   { customInput.id   = originalId   }

        console.log('componentInstance', componentInstance, componentInstance.language, componentInstance.placeholder)

        if (What3wordsSearchbox.language) {
          componentInstance.setAttribute('language', What3wordsSearchbox.lang)
          componentInstance.language = What3wordsSearchbox.lang
        }
        if (What3wordsSearchbox.placeholder) {
          componentInstance.placeholder = What3wordsSearchbox.input_placeholder
        }

        console.log('componentInstance', componentInstance, componentInstance.language, componentInstance.placeholder)
      },1)
    })

}