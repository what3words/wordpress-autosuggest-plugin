
if (typeof What3wordsSearchbox != "undefined") {

    //  console.log('settings:\n',What3wordsSearchbox);
    const w3wComponent = document.createElement('what3words-autosuggest',
      { is: 'what3words-autosuggest' }
    )

    if (What3wordsSearchbox.lang) {
      w3wComponent.setAttribute('language', What3wordsSearchbox.lang)
    }
    if (What3wordsSearchbox.input_placeholder) {
      w3wComponent.setAttribute('placeholder', What3wordsSearchbox.input_placeholder)
    }

    const targetInputs = document.querySelectorAll(`${What3wordsSearchbox.input_selectors}`)

    targetInputs.forEach((targetInput) => {
      const originalName = targetInput.name || '',
            originalId   = targetInput.id || ''
            targetParent = targetInput.parentNode

      const w3wComponentInstance = w3wComponent
      w3wComponentInstance.setAttribute('data-input-orig-id', originalId)
      w3wComponentInstance.setAttribute('data-input-orig-name', originalName)


      targetParent.replaceChild(w3wComponent, targetInput)

      setTimeout(() => {
        //  FIX: this won't work if multiple sibling 
        //  `What3wordsSearchbox.input_selectors`
        // const componentInstance = targetParent.getElementsByTagName('what3words-autosuggest')[0]
        // const customInput =  componentInstance.querySelector('input')
        // if (originalName) { customInput.name = originalName }
        // if (originalId)   { customInput.id   = originalId   }

      //  console.log('componentInstance', componentInstance, componentInstance.language, componentInstance.placeholder)
      },1)
    })

}