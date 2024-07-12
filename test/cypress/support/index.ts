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

Cypress.Commands.add('attachIntercepts', () => {
  cy.intercept(/api.what3words.com\/v3\/autosuggest/i).as('autosuggest')
    .intercept('POST', /wp-login.php/i).as('login-request')
    .intercept(/wp-admin\/plugin-install.php/i).as('plugin-install-page')
    .intercept(/wp-admin\/admin-ajax.php/i).as('ajax')
    .intercept(/wp-admin\/plugins.php/i).as('plugins-page')
})

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/wp-login.php')
    .wait(300)
    .get('#user_login').focus().clear().type(username)
    .get('input#user_pass').focus().clear().type(password)
    .get('input#wp-submit').click({ force: true })
    .wait('@login-request')
})

Cypress.Commands.add('installPlugin', (plugin_name: string, plugin_slug: string) => {
  cy.visit('/wp-admin/plugin-install.php')
    .get('#search-plugins').type(plugin_name)
    .wait('@ajax')
    .get(`a[data-slug="${plugin_slug}"]`).click()
    .wait('@ajax')
});

Cypress.Commands.add('uninstallPlugin', (plugin_slug: string) => {
  cy.visit('/wp-admin/plugins.php')
    .get(`#deactivate-${plugin_slug}`)
    .then(obj => {
      if (obj) cy.wrap(obj).click({ force: true });
    })
    .get(`#delete-${plugin_slug}`)
    .then(obj => {
      if (obj) {
        cy.wrap(obj).click({ force: true })
          .get('input[value="Yes, delete these files"]')
            .then(confirm => {
              if (confirm) cy.wrap(confirm).click({ force: true })
            })
      }
    })
    .get(`#delete-${plugin_slug}`).should('not.exist')
});

Cypress.Commands.add('activatePlugin', (plugin_name: string, root_php_file?: string) => {
  cy.visit('/wp-admin/plugins.php')
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .activate > a`).click()
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .deactivate > a`)
      .should('exist')
      .should('be.visible')
      .should('contain.text', 'Deactivate')
})

Cypress.Commands.add('deactivatePlugin', (plugin_name: string, root_php_file?: string) => {
  cy.visit('/wp-admin/plugins.php')
    .get(`[data-plugin="${plugin_name}/${root_php_file || plugin_name}.php"] .deactivate > a`).click({ force: true })
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

Cypress.Commands.add('setSelector', (selector: string) => {
  cy.intercept('POST', /admin.php/i).as('submit')
    .getElementByDataTestId('enable_input_selector').click()
    .getElementByDataTestId('input_selector').type(selector)
    .getElementByDataTestId('save_settings').should('be.visible').click({ force: true }) // Forcing to ensure it is clickable
    .wait('@submit')
    .getElementByDataTestId('input_selector').should('have.value', selector)
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
  hasSeparate3waField = true,
) => {
  const fieldPrefix = isBilling ? '#billing_' : '#shipping_'
  const selectPrefix = isBilling ? '#select2-billing_' : '#select2-shipping_'
  cy.intercept(/api.what3words.com\/v3\/autosuggest/i).as('autosuggest')
    .get(`${fieldPrefix}first_name`).focus().clear().type(first)
    .get(`${fieldPrefix}last_name`).focus().clear().type(last)
    .get(`${fieldPrefix}city`).focus().clear().type(city)
    .get(`${fieldPrefix}postcode`).focus().clear().type(postcode)
    .get(`${selectPrefix}country-container`).click()
    .get('li').contains('United Kingdom').click()

  if (hasSeparate3waField) {
    cy.get(`${fieldPrefix}address_1`).focus().clear().type(address)
    const selector = isBilling ? '#w3w-billing' : '#w3w-shipping';
    cy.get(selector).scrollIntoView();
    cy.get(selector).focus();
    cy.get(selector).clear();
    cy.get(selector).type(hint)
      .wait('@autosuggest')
      .get(selector)
      .closest('what3words-autosuggest')
      .find('[data-testid=suggestion-0]').scrollIntoView().click({ force: true })
  } else {
    if (address) {
      cy.get(`${fieldPrefix}address_1`).scrollIntoView().focus().clear().type(address)
    } else {
      cy.get(`${fieldPrefix}address_1`).scrollIntoView().click().clear().type(hint)
        .wait('@autosuggest')
        .get(`${fieldPrefix}address_1`)
        .closest('what3words-autosuggest')
        .find('[data-testid=suggestion-0]').scrollIntoView().click({ force: true })
    }
  }

  if (isBilling) cy.get(`${fieldPrefix}phone`).focus().clear().type(phone)
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