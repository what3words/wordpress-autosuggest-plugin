describe('Input selector', () => {
  describe('Given an input selector is provided', () => {
    beforeEach(() => 
      cy.task('db:setup')
        .attachIntercepts()
        .login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))
        .activatePlugin('w3w-autosuggest')
        .openSettingsPage('what3words')
        .setApiKey(Cypress.env('API_KEY'))
        .getElementByDataTestId('enable_input_selector').click({ force: true })
        .getElementByDataTestId('selector').type('#search-form-1')
        .saveSettings()
    )
  })
})