import { Chance } from 'chance'

const CH = new Chance()

describe('Managed fields', () => {
  
  beforeEach(() =>
    cy.task('db:setup')
      .login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))
      .activatePlugin('w3w-autosuggest')
      .openSettingsPage('what3words')
      .setApiKey(Cypress.env('API_KEY'))
      .getElementByDataTestId('enable_w3w_managed').should('be.checked')
  )

  describe.skip('Given WooCommerce is not enabled', () => {
    beforeEach(() => cy.deactivatePlugin('woocommerce'))

    it('Then no autosuggest is shown', () => {
      cy.visit('/')
        .get('what3words-autosuggest').should('not.exist')
    })
  })

  describe('Given WooCommerce is enabled', () => {
    describe('When a customer gets to checkout', () => {
      beforeEach(() =>
        cy.visit('/shop')
          .get('a.button').click()
          .visit('/cart')
          .get('a.checkout-button').click()
      )

      it('Then the autosuggest search field is displayed', () => {
        cy.get('#w3w-billing').parent('what3words-autosuggest').should('exist')
        cy.get('#w3w-shipping').parent('what3words-autosuggest').should('exist')
      })

      describe('And the customer completes billing information only', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const address = CH.address()
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()
          const hint = 'filled.count.s'

          cy.completeCheckoutForm({ first, last, address, city, postcode, phone, hint }, true)
            .placeOrder()
        })

        it('Then the autosuggest value is displayed on the order review customer page', () => {
          cy.getElementByDataTestId('billing_words').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
            .getElementByDataTestId('shipping_words').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
        })
      })

      describe('And the customer completes billing and shipping information', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const address = CH.address()
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()
          const hint = 'filled.count.s'
          const [first2, last2] = CH.name().split(' ')
          const address2 = CH.address()
          const city2 = CH.city()
          const phone2 = CH.phone()
          const hint2 = 'lock.spout.r'
          cy.completeCheckoutForm({ first, last, address, city, postcode, phone, hint }, true)
            .get('span').contains('Ship to a different address?').click()
            .completeCheckoutForm({
              first: first2,
              last: last2,
              address: address2,
              city: city2,
              postcode,
              phone: phone2,
              hint: hint2,
            }, false)
            .placeOrder()
        })

        it('Then the autosuggest value is displayed on the order review customer page', () => {
          cy.get('[data-testid=billing_words]').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
            .get('[data-testid=shipping_words]').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
        })
      })
    })
  })

})