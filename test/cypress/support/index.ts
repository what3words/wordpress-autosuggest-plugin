// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.intercept('POST', /wp-login.php/i).as('login-request')
    .visit('/wp-login.php')
    .focused().type(username)
    .get('input#user_pass').type(password)
    .get('input#wp-submit').click()
    .wait('@login-request')
})

Cypress.Commands.add('activatePlugin', (plugin_name: string, root_php_file?: string) => {
  cy.intercept(/wp-admin\/plugins.php/i).as('plugins-page')
  cy.get('#menu-plugins').click()
    .wait('@plugins-page')
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .activate > a`).click()
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .deactivate > a`)
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Deactivate')
})

Cypress.Commands.add('deactivatePlugin', (plugin_name: string, root_php_file?: string) => {
  cy.intercept(/wp-admin\/plugins.php/i).as('plugins-page')
  cy.get('#menu-plugins').click()
    .wait('@plugins-page')
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .deactivate > a`).click()
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .activate > a`)
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Activate')
})

Cypress.Commands.add('openSettingsPage', (plugin_name: string) => {
  cy.get(`#toplevel_page_${plugin_name} > a`).click()
})

Cypress.Commands.add('getElementByDataTestId', (test_id: string) => {
  cy.get(`[data-testid="${test_id}"]`)
})

Cypress.Commands.add('setApiKey', (api_key: string) => {
  cy.intercept('POST', /admin.php/i).as('submit')
    .getElementByDataTestId('api_key').focus().type(api_key)
    .getElementByDataTestId('save_api_key').should('be.visible').click({ force: true }) // Forcing to ensure it is clickable
    .wait('@submit')
    .getElementByDataTestId('api_key').should('have.value', api_key)
})

Cypress.Commands.add('assertApiKeyNotice', (exists: boolean) => {
  if (exists) {
    cy.getElementByDataTestId('api_key_notice').should('exist').should('be.visible')
      .getElementByDataTestId('get_api_key').should('exist').should('be.visible')
      .getElementByDataTestId('manage_api_key').should('not.exist')
  } else {
    cy.getElementByDataTestId('api_key_notice').should('not.exist')
      .getElementByDataTestId('get_api_key').should('not.exist')
      .getElementByDataTestId('manage_api_key').should('exist').should('be.visible')
  }
})

Cypress.Commands.add('assertTargetValidity', (test_id: string, validity: boolean) => {
  cy.getElementByDataTestId(test_id)
    .then(elem => elem[0].checkValidity())
    .should(validity ? 'be.true' : 'be.false')
})

Cypress.Commands.add('completeCheckoutForm', (
  { first, last, address, city, postcode, phone, hint },
  isBilling = true,
) => {
  const fieldPrefix = isBilling ? '#billing_' : '#shipping_'
  const selectPrefix = isBilling ? '#select2-billing_' : '#select2-shipping_'
  cy.intercept(/api.what3words.com\/v3\/autosuggest/i).as('autosuggest')
    .get(`${fieldPrefix}first_name`).focus().clear().type(first)
    .get(`${fieldPrefix}last_name`).focus().clear().type(last)
    .get(`${fieldPrefix}address_1`).focus().clear().type(address)
    .get(`${fieldPrefix}city`).focus().clear().type(city)
    .get(`${fieldPrefix}postcode`).focus().clear().type(postcode)
    .get(`${selectPrefix}country-container`).click()
    .get('li').contains('United Kingdom').click()
  
  if (isBilling) cy.get(`${fieldPrefix}phone`).focus().clear().type(phone)
  
  cy.get(isBilling ? '#w3w-billing' : '#w3w-shipping').click().clear().type(hint)
    .wait('@autosuggest')
    .get(isBilling ? '#w3w-billing' : '#w3w-shipping')
      .closest('what3words-autosuggest')
      .find('[data-testid=suggestion-0]').click()
})

Cypress.Commands.add('saveSettings', () => {
  cy.getElementByDataTestId('save_settings').should('be.visible').click({ force: true })
})

Cypress.Commands.add('saveAdvanced', () => {
  cy.getElementByDataTestId('save_advanced').should('be.visible').click({ force: true })
})

Cypress.Commands.add('placeOrder', () => {
  cy.get('#place_order').click()
})

Cypress.Commands.add('selectManagedInput', () => {
  cy.getElementByDataTestId('enable_w3w_managed').should('be.visible').click({ force: true })
})

Cypress.Commands.add('selectInputSelector', () => {
  cy.getElementByDataTestId('enable_input_selector').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleReturnCoordinates', () => {
  cy.getElementByDataTestId('return_coordinates').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleNearestPlace', () => {
  cy.getElementByDataTestId('save_nearest_place').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleLabel', () => {
  cy.getElementByDataTestId('enable_label').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleAdvancedSettings', () => {
  cy.getElementByDataTestId('advanced_dropdown').should('be.visible').click({ force: true })
})

Cypress.Commands.add('togglePlaceholder', () => {
  cy.getElementByDataTestId('enable_placeholder').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleClipToCountry', () => {
  cy.getElementByDataTestId('enable_clip_to_country').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleClipToCircle', () => {
  cy.getElementByDataTestId('enable_clip_to_circle').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleClipToBoundingBox', () => {
  cy.getElementByDataTestId('enable_clip_to_bounding_box').should('be.visible').click({ force: true })
})

Cypress.Commands.add('toggleClipToPolygon', () => {
  cy.getElementByDataTestId('enable_clip_to_polygon').should('be.visible').click({ force: true })
})

Cypress.Commands.add('saveAdvanced', () => {
  cy.getElementByDataTestId('save_advanced').should('be.visible').click({ force: true })
})