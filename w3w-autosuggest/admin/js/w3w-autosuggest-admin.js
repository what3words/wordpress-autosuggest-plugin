const COORD_REGEX = /(-?\d+(\.\d+)?)/

function handleToggleTarget(target, checked) {
  target.required = checked
  target.disabled = !checked
}

function validateTarget(target, validCallback) {
  target.classList.remove(['is-valid', 'is-invalid'])
  if (!validCallback(target.value)) {
    target.classList.add('is-invalid')
    target.scrollTo()
    return false
  }

  target.classList.add('is-valid')
  return true
}

window.addEventListener('load', () => {

  /**
   * DROPDOWN MENU HANDLER
   */
  const dropdowns = document.querySelectorAll('.dropstart')
  for (let i = 0; i < dropdowns.length; i++) {
    const dropdown = dropdowns[i]
    const dropdownToggle = dropdown.querySelector('.dropdown-toggle')
    const dropdownMenu = dropdown.querySelector('.menu')
    dropdownToggle.addEventListener('click', (e) => {
      const target = e.target
      if (target.classList.contains('expanded')) {
        target.classList.remove('expanded')
        dropdownMenu.classList.remove('d-block')
        dropdownMenu.classList.add('d-none')
      } else {
        target.classList.add('expanded')
        dropdownMenu.classList.remove('d-none')
        dropdownMenu.classList.add('d-block')
      }
    })
  }


  /**
   * API KEY HANDLER
   */
  const apiKeyInput = document.querySelector('input#w3w_api_key')
  const apiKeyBtn = document.querySelector('button#api_key_btn')
  function handleApiKeySetting(value) {
    apiKeyBtn.disabled = value.length !== 8
  }

  if (apiKeyInput && apiKeyBtn) {
    handleApiKeySetting(apiKeyInput.value)
    apiKeyInput.addEventListener('input', function(e) {
      handleApiKeySetting(e.target.value)
    })
  }

  /**
   * INPUT SETTINGS HANDLER
   */
  const wooCommerceRadio = document.querySelector('input#enable_w3w_managed_input')
  const convertExistingRadio = document.querySelector('input#enable_input_selector')
  const inputSelectorInput = document.querySelector('input#input_selector')
  if (wooCommerceRadio && convertExistingRadio) {
    handleToggleTarget(inputSelectorInput, convertExistingRadio.checked)
    wooCommerceRadio.addEventListener('change', function() {
      handleToggleTarget(inputSelectorInput, false)
    })
    convertExistingRadio.addEventListener('change', function() {
      handleToggleTarget(inputSelectorInput, true)
    })
  }

  /**
   * LABEL SETTINGS HANDLER
   */
  const showLabelCheckbox = document.querySelector('input#enable_label')
  const labelInput = document.querySelector('input#label')
  if (showLabelCheckbox && labelInput) {
    handleToggleTarget(labelInput, showLabelCheckbox.checked)
    showLabelCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(labelInput, e.target.checked)
    })
  }

  /**
   * CUSTOM PLACEHOLDER ADVANCED HANDLER
   */
  const placeholderCheckbox = document.querySelector('input#enable_placeholder')
  const placeholderInput = document.querySelector('input#placeholder')
  if (placeholderCheckbox && placeholderInput) {
    handleToggleTarget(placeholderInput, placeholderCheckbox.checked)
    placeholderCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(placeholderInput, e.target.checked)
    })
  }

  /**
   * CLIP RESULTS TO COUNTRY ADVANCED HANDLER
   */
  const clipToCountryCheckbox = document.querySelector('input#enable_clip_to_country')
  const clipToCountryInput = document.querySelector('input#clip_to_country')
  if (clipToCountryCheckbox && clipToCountryInput) {
    handleToggleTarget(clipToCountryInput, clipToCountryCheckbox.checked)
    clipToCountryCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(clipToCountryInput, e.target.checked)
    })
  }

  /**
   * CLIP TO CIRCLE ADVANCED HANDLER
   */
  const clipToCircleCheckbox = document.querySelector('input#enable_clip_to_circle')
  const clipToCircleLatInput = document.querySelector('input#clip_to_circle_lat')
  const clipToCircleLngInput = document.querySelector('input#clip_to_circle_lng')
  const clipToCircleRadiusInput = document.querySelector('input#clip_to_circle_radius')
  if (clipToCircleCheckbox && clipToCircleLatInput && clipToCircleLngInput && clipToCircleRadiusInput) {
    handleToggleTarget(clipToCircleLatInput, clipToCircleCheckbox.checked)
    handleToggleTarget(clipToCircleLngInput, clipToCircleCheckbox.checked)
    handleToggleTarget(clipToCircleRadiusInput, clipToCircleCheckbox.checked)
    clipToCircleCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(clipToCircleLatInput, e.target.checked)
      handleToggleTarget(clipToCircleLngInput, e.target.checked)
      handleToggleTarget(clipToCircleRadiusInput, e.target.checked)
    })
  }

  /**
   * CLIP TO BOUNDING BOX ADVANCED HANDLER
   */
  const clipToBBCheckbox = document.querySelector('input#enable_clip_to_bounding_box')
  const clipToBBSWLatInput = document.querySelector('input#clip_to_bounding_box_sw_lat')
  const clipToBBSWLngInput = document.querySelector('input#clip_to_bounding_box_sw_lng')
  const clipToBBNELatInput = document.querySelector('input#clip_to_bounding_box_ne_lat')
  const clipToBBNELngInput = document.querySelector('input#clip_to_bounding_box_ne_lng')
  if (clipToBBCheckbox && clipToBBSWLatInput && clipToBBSWLngInput && clipToBBNELatInput && clipToBBNELngInput) {
    handleToggleTarget(clipToBBSWLatInput, clipToBBCheckbox.checked)
    handleToggleTarget(clipToBBSWLngInput, clipToBBCheckbox.checked)
    handleToggleTarget(clipToBBNELatInput, clipToBBCheckbox.checked)
    handleToggleTarget(clipToBBNELngInput, clipToBBCheckbox.checked)
    clipToBBCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(clipToBBSWLatInput, e.target.checked)
      handleToggleTarget(clipToBBSWLngInput, e.target.checked)
      handleToggleTarget(clipToBBNELatInput, e.target.checked)
      handleToggleTarget(clipToBBNELngInput, e.target.checked)
    })
  }

  /**
   * CLIP TO POLYGON ADVANCED HANDLER
   */
  const clipToPolygonCheckbox = document.querySelector('input#enable_clip_to_polygon')
  const clipToPolygonTextarea = document.querySelector('textarea#clip_to_polygon')
  if (clipToPolygonCheckbox && clipToPolygonTextarea) {
    handleToggleTarget(clipToPolygonTextarea, clipToPolygonCheckbox.checked)
    clipToPolygonCheckbox.addEventListener('change', function(e) {
      handleToggleTarget(clipToPolygonTextarea, e.target.checked)
    })
  }

  /**
   * SETTINGS FORM HANDLER
   */
  const settingsForm = document.querySelector('form#settings')
  if (settingsForm) {
    settingsForm.addEventListener('submit', function(e) {
      e.target.classList.remove('was-validated')

      if (convertExistingRadio.checked && !validateTarget(inputSelectorInput, function(value) {
        return value.length > 0 && (value.indexOf('#') > -1 || value.indexOf('.') > -1)
      })) return e.preventDefault()

      if (showLabelCheckbox.checked && !validateTarget(labelInput, function(value) {
        return value.length > 0
      })) return e.preventDefault()

      e.target.classList.add('was-validated')
    })
  }

  /**
   * ADVANCED SETTINGS FORM HANDLER
   */
  const advancedForm = document.querySelector('form#advanced')
  if (advancedForm) {
    advancedForm.addEventListener('submit', function(e) {
      e.target.classList.remove('was-validated')

      if (placeholderCheckbox.checked && !validateTarget(placeholderInput, function(value) {
        return value.trim().length > 0
      })) {
        placeholderInput.scrollTo()
        return e.preventDefault()
      }

      if (clipToCountryCheckbox.checked && !validateTarget(clipToCountryInput, function(value) {
        return value.split(',').filter(val => val.trim().length !== 2 || !(/^[A-Z]{2}$/.test(val.trim()))).length === 0
      })) {
        clipToCountryInput.scrollTo()
        return e.preventDefault()
      }

      if (clipToCircleCheckbox.checked) {
        if (!validateTarget(clipToCircleLatInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToCircleLatInput.scrollTo()
          return e.preventDefault()
        }
        if (!validateTarget(clipToCircleLngInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToCircleLngInput.scrollTo()
          return e.preventDefault()
        }
        if (!validateTarget(clipToCircleRadiusInput, function(value) {
          return /\d+/.test(value.trim())
        })) {
          clipToCircleRadiusInput.scrollTo()
          return e.preventDefault()
        }
      }

      if (clipToBBCheckbox.checked) {
        if (!validateTarget(clipToBBSWLatInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToBBSWLatInput.scrollTo()
          return e.preventDefault()
        }
        if (!validateTarget(clipToBBSWLngInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToBBSWLngInput.scrollTo()
          return e.preventDefault()
        }
        if (!validateTarget(clipToBBNELatInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToBBNELatInput.scrollTo()
          return e.preventDefault()
        }
        if (!validateTarget(clipToBBNELngInput, function(value) {
          return COORD_REGEX.test(value.trim())
        })) {
          clipToBBNELngInput.scrollTo()
          return e.preventDefault()
        }
      }

      if (clipToPolygonCheckbox.checked && !validateTarget(clipToPolygonTextarea, function(value) {
        const pairs = value.trim().split(';').map(pair => pair.trim().split(',').map(coord => coord.trim()))
        const containsInvalidPair = pairs.find(pair => !Array.isArray(pair) || pair.length !== 2)
        const containsInvalidCoord = pairs.find(pair => pair.find(coord => !COORD_REGEX.test(coord)))
        if (pairs.length < 3 || containsInvalidPair || containsInvalidCoord) return false
        return true
      })) {
        clipToPolygonTextarea.scrollTo()
        return e.preventDefault()
      }

      e.target.classList.add('was-validated')
    })
  }
  
})
