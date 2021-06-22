describe('Admin > Settings', () => {
  beforeEach(() => cy.login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD')))

  describe('Given a WP user with permissions', () => {

    describe('When the user activates the plugin and navigates to the settings page', () => {
      beforeEach(() => 
        cy.task('db:setup')
          .activatePlugin('w3w-autosuggest')
          .openSettingsPage('what3words')
      )

      it('Then the address field should default to a w3w managed field', () => {
        cy.getElementByDataTestId('enable_w3w_managed').should('be.checked')
          .getElementByDataTestId('enable_input_selector').should('not.be.checked')
          .getElementByDataTestId('input_selector').should('be.disabled')
      })

      describe('And the input selector checkbox is selected', () => {
        beforeEach(() => cy.selectInputSelector())

        it('Then the input selector input is enabled', () => {
          cy.getElementByDataTestId('input_selector')
            .should('be.enabled')
        })

        it('Then the form requires input selector to have a value', () => {
          cy.assertTargetValidity('input_selector', false)
        })

        it('Then the form can be submitted when the input selector has a value', () => {
          const value = '#my-input'
          cy.getElementByDataTestId('input_selector').focus().type(value)
            .assertTargetValidity('input_selector', true)
            .saveSettings()
            .getElementByDataTestId('enable_input_selector').should('be.checked')
            .getElementByDataTestId('input_selector').should('have.value', value)
        })
      })

      it('Then the save coordinates checkbox is not checked by default', () => {
        cy.getElementByDataTestId('return_coordinates')
          .should('not.be.checked')
      })

      it('Then the save coordinates checkbox is checked and saved', () => {
        cy.toggleReturnCoordinates()
          .saveSettings()
          .getElementByDataTestId('return_coordinates').should('be.checked')
      })

      it('Then the nearest place checkbox is not checked by default', () => {
        cy.getElementByDataTestId('nearest_place')
          .should('not.be.checked')
      })

      it('Then the nearest place checkbox is checked and saved', () => {
        cy.toggleNearestPlace()
          .saveSettings()
          .getElementByDataTestId('save_nearest_place').should('be.checked')
      })

      it('Then the field label checkbox is not checked by default', () => {
        cy.getElementByDataTestId('enable_label').should('not.be.checked')
      })

      describe('And the field label checkbox is selected', () => {
        beforeEach(() => cy.toggleLabel())

        it('Then the field label input is enabled', () => {
          cy.getElementByDataTestId('label')
            .should('be.enabled')
        })

        it('Then the form requires field label to have a value', () => {
          cy.assertTargetValidity('label', false)
        })

        it('Then the form can be submitted when the field label has a value', () => {
          const value = 'my custom label'
          cy.getElementByDataTestId('label').focus().type(value)
            .assertTargetValidity('label', true)
            .saveSettings()
            .getElementByDataTestId('enable_label').should('be.checked')
            .getElementByDataTestId('label').should('have.value', value)
        })
      })

    })
  })
})