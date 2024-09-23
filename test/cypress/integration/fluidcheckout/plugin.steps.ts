import { Chance } from 'chance';
import { After, And, Before, Then } from 'cypress-cucumber-preprocessor/steps';
import '../common/step_definitions/hooks.steps';

const CH = new Chance();

Before({ name: 'Enable fluid checkout plugin', tags: '@fluid_enabled' }, () =>
  cy
    .installPlugin('fluid checkout', 'fluid-checkout')
    .activatePlugin('fluid-checkout')
);

After({ name: 'Disable fluid checkout plugin', tags: '@fluid_enabled' }, () =>
  cy.uninstallPlugin('fluid-checkout')
);

Then('they see autosuggest when they open shipping', () => {
  const fname = CH.first();
  const lname = CH.last();
  const add1 = CH.street();
  const city = CH.city();
  const postcode = CH.postcode();
  const hint = 'filled.count.s';

  cy.intercept('http://localhost:8080/?wc-ajax=update_order_review').as(
    'update'
  );

  cy.wait(500);
  cy.get('#shipping_first_name').click().type(fname);
  cy.get('#shipping_last_name').click().type(lname);
  cy.get('#shipping_address_1').click().type(add1);
  cy.get('#shipping_city').click().type(city);
  cy.get('#shipping_postcode').click().type(postcode);

  // Start cruft - due to setTimeouts and other Fluid Checkout weirdness, this bit of cruft is necessary here
  cy.wait(500);
  cy.get(
    '#fc-expansible-form-section__toggle--shipping_w3w > .collapsible-content__inner > .expansible-section__toggle-plus'
  )
    .focus()
    .click();
  cy.wait('@update');
  cy.get(
    '#fc-expansible-form-section__toggle--shipping_w3w > .collapsible-content__inner > .expansible-section__toggle-plus'
  )
    .focus()
    .click();
  cy.wait(500);
  // end cruft

  cy.get('#w3w-shipping').scrollIntoView().type(hint);
  cy.get('[data-testid="suggestion-0"]').click();
  cy.get('#w3w-shipping')
    .invoke('val')
    .should('match', /^\/\/\/(\w+.){2}\w+$/i);
  cy.get(
    '[data-step-id="shipping"] > .fc-step__actions > .fc-step__next-step'
  ).click();
});

And('they see autosuggest when they open billing', () => {
  const hint = 'm.a.s';

  cy.wait(200);
  cy.get('#billing_same_as_shipping').click();
  cy.get(
    '#fc-expansible-form-section__toggle--billing_w3w > .collapsible-content__inner > .expansible-section__toggle-plus'
  )
    .scrollIntoView()
    .click();
  cy.get(`#w3w-billing`).focus().wait(300);
  cy.get('#w3w-billing').click().type(hint, { delay: 300 });
  cy.get('[data-testid="suggestion-0"]').click();
  cy.get('#w3w-billing')
    .invoke('val')
    .should('match', /^\/\/\/(\w+.){2}\w+$/i);
});
