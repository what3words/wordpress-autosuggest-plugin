describe('Admin > API Key', () => {
  beforeEach(() => cy.login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD')))

  describe('Given a WP user with permissions', () => {

    describe('When the user activates the plugin and navigates to the settings page', () => {
      beforeEach(() => 
        cy.task('db:setup')
          .activatePlugin('w3w-autosuggest')
          .openSettingsPage('what3words')
      )

      it('Then the API key notice is visible', () => {
        cy.assertApiKeyNotice(true)
      })

      it('Then the API key is empty by default', () => {
        cy.getElementByDataTestId('api_key').should('have.value', '')
      })

      it('Then the user can add an API key and the API key notice is no longer visible', () => {
        cy.setApiKey(Cypress.env('API_KEY'))
          .assertApiKeyNotice(false)
      })
    })
  })
})
