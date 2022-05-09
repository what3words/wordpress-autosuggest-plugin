import { Given, When } from 'cypress-cucumber-preprocessor/steps';

Given('a customer has an item in their cart', () => {
  cy.visit('/shop')
    .get('a.button')
    .click()
    .get('.added_to_cart')
    .should('be.visible');
});

When('they go to checkout', () => {
  cy.visit('/cart')
    .get('a.checkout-button')
    .click()
});
