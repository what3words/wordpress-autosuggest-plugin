import { Chance } from 'chance'

const CH = new Chance()

describe('Managed fields', () => {
  beforeEach(() =>
    cy.task('db:setup')
      .attachIntercepts()
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
          cy.getElementByDataTestId('shipping_words').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
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
          cy.getElementByDataTestId('shipping_words').contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
        })
      })
    })
  })

  describe('Given WooCommerce is enabled and autosuggest is added to existing billing field', () => {
    beforeEach(() => {
      cy.toggleReturnCoordinates()
        .toggleNearestPlace()
        .setSelector('#billing_address_1')
    })

    describe('When a customer gets to checkout', () => {
      beforeEach(() =>
        cy.visit('/shop')
          .get('a.button').click()
          .visit('/cart')
          .get('a.checkout-button').click()
      )

      it('Then the autosuggest functionality is added to the existing field', () => {
        cy.get('#billing_address_1_field what3words-autosuggest').should('exist')
      })

      describe('And the customer uses the same address for billing and shipping, and completes billing information only', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()
          const hint = 'filled.count.soa'

          cy.completeCheckoutForm({ first, last, city, postcode, phone, hint }, true, false)
        })

        it('Then the nearest place and lat/lng info are stored in hidden fields', () => {
          cy.get('#billing_nearest_place').should('have.value', 'Bayswater, London')
          cy.get('#billing_w3w_lat').should('have.value', '51.520847')
          cy.get('#billing_w3w_lng').should('have.value', '-0.195521')
          cy.get('#shipping_nearest_place').should('have.value', 'Bayswater, London')
          cy.get('#shipping_w3w_lat').should('have.value', '51.520847')
          cy.get('#shipping_w3w_lng').should('have.value', '-0.195521')
        })

        describe('When the customer submits their order', () => {
          beforeEach(() => {
            cy.placeOrder()
          })

          it('Then the autosuggest value is displayed on the order review customer page', () => {
            cy.get('address').first().contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
            cy.get('address').last().contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
          })
        })
      })

      describe('And the customer completes billing and shipping information separately', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()
          const hint = 'filled.count.s'
          const [first2, last2] = CH.name().split(' ')
          const address2 = CH.address()
          const city2 = CH.city()
          const phone2 = CH.phone()
          const hint2 = 'lock.spout.r'
          cy.completeCheckoutForm({ first, last, city, postcode, phone, hint }, true, false)
            .get('span').contains('Ship to a different address?').click()
            .completeCheckoutForm({
              first: first2,
              last: last2,
              address: address2,
              city: city2,
              postcode,
              phone: phone2,
              hint: hint2,
            }, false, false)
            .placeOrder()
        })

        it('Then the autosuggest value is displayed on the order review customer page', () => {
          cy.get('address').first().contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
          cy.get('address').last().should('not.contain', /\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
        })
      })
    })
  })

  describe('Given WooCommerce is enabled and autosuggest is added to existing shipping field', () => {
    beforeEach(() => {
      cy.toggleReturnCoordinates()
        .toggleNearestPlace()
        .setSelector('#shipping_address_1')
    })

    describe('When a customer gets to checkout', () => {
      beforeEach(() =>
        cy.visit('/shop')
          .get('a.button').click()
          .visit('/cart')
          .get('a.checkout-button').click()
      )

      it('Then the autosuggest functionality is added to the existing field', () => {
        cy.get('#shipping_address_1_field what3words-autosuggest').should('exist')
      })

      describe('And the customer uses the same address for billing and shipping, and completes billing information only', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const address = CH.address()
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()

          cy.completeCheckoutForm({ first, last, address, city, postcode, phone }, true, false)
            .placeOrder()
        })

        it('Then the autosuggest value is NOT displayed on the order review customer page as the shipping form was never used', () => {
          cy.get('address').first().should('not.contain', /\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
          cy.get('address').last().should('not.contain', /\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
        })
      })

      describe('And the customer completes billing and shipping information separately', () => {
        beforeEach(() => {
          const [first, last] = CH.name().split(' ')
          const address = CH.address()
          const city = CH.city()
          const postcode = 'W2 5EU'
          const phone = CH.phone()
          const [first2, last2] = CH.name().split(' ')
          const city2 = CH.city()
          const phone2 = CH.phone()
          const hint2 = 'filled.count.soap'

          cy.get('span').contains('Ship to a different address?').click()
            .completeCheckoutForm({ first, last, address, city, postcode, phone }, true, false)
            .completeCheckoutForm({
              first: first2,
              last: last2,
              city: city2,
              postcode,
              phone: phone2,
              hint: hint2,
            }, false, false)
        })

        it('Then the nearest place and lat/lng info are stored in hidden fields', () => {
          cy.get('#shipping_nearest_place').should('have.value', 'Bayswater, London')
          cy.get('#shipping_w3w_lat').should('have.value', '51.520847')
          cy.get('#shipping_w3w_lng').should('have.value', '-0.195521')
        })

        describe('When the customer submits their order', () => {
          beforeEach(() => {
            cy.placeOrder()
          })

          it('Then the autosuggest value is displayed on the order review customer page', () => {
            cy.get('address').first().should('not.contain', /\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
            cy.get('address').last().contains(/\/\/\/(?:[A-Z]+\.){2}[A-Z]+/i)
          })
        })
      })
    })
  })
})