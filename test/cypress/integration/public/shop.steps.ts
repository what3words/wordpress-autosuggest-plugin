import { Given } from 'cypress-cucumber-preprocessor/steps';

Given('a customer has an item in their cart', () => {
  cy.visit('/shop')
    .get('a.button').click()
});
