import { Chance } from 'chance'

const CH = new Chance()

describe('Admin > Emails', () => {
  beforeEach(() => {
    const [first, last] = CH.name().split(' ');
    const address = CH.address();
    const city = CH.city();
    const postcode = 'W2 5EU';
    const phone = CH.phone();
    const hint = 'filled.count.s';

    cy.intercept({ url: '/wp-admin/admin.php', query: { page: 'wpml_plugin_log' } }).as('mail-log-page')

    cy.task('db:setup')
      .attachIntercepts()
      .login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))
      .installPlugin('WP Mail Logging', 'wp-mail-logging')
      .activatePlugin('wp-mail-logging')
      .activatePlugin('w3w-autosuggest')
      .openSettingsPage('what3words')
      .setApiKey(Cypress.env('API_KEY'))
      // create an order
      .visit('/shop')
      .get('a.button').click()
      .visit('/cart')
      .get('a.checkout-button').click()
      .completeCheckoutForm({ first, last, address, city, postcode, phone, hint }, true)
      .placeOrder()
  });

  afterEach(() => {
    cy.uninstallPlugin('wp-mail-logging');
  });

  describe('Given I navigate to my order', () => {
    beforeEach(() => {
      cy.visit('/wp-admin')
        .visit('/wp-admin/edit.php?post_type=shop_order');
    });

    describe('When I send an email to a customer', () => {
      it('Then the customer w3w details are added to the email', () => {
        cy.get('.order-view').first().click()
          .wait('@post-edit-page')
          .get(`a[data-testid="order_w3w_address"]`).should('exist').should('have.attr', 'href')
          .get('#actions > select').select('send_order_details')
          .get('#actions > .button').click()
          .get('.wp-menu-name').contains('WP Mail Logging').click()
          .wait('@mail-log-page')
      });
    });
  });
});
