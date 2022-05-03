import { Chance } from 'chance';
import { After, And, Before, Then } from 'cypress-cucumber-preprocessor/steps';
import '../common/step_definitions/hooks.steps';

const CH = new Chance();

Before({ name: 'Enable fluid checkout plugin', tags: '@fluid_enabled' }, () =>
  cy.installPlugin('fluid checkout', 'fluid-checkout')
    .activatePlugin('fluid-checkout')
);

After({ name: 'Disable fluid checkout plugin', tags: '@fluid_enabled' }, () =>
  cy.uninstallPlugin('fluid-checkout')
);

Then('they see autosuggest when they open shipping', () => {
  const hint = 'filled.count.s'
  
  cy.wait(200)
    .get('a[aria-label="Change: Shipping to"]').focus().click()
    .get(`#w3w-shipping`).scrollIntoView().focus().clear().type(hint)
    .get('[data-testid="suggestion-0"]').click()
    .get('#w3w-shipping').invoke('val').should('match', /^\/\/\/(\w+.){2}\w+$/i)
})

And('they see autosuggest when they open billing', () => {
  const hint = 'filled.count.s'
  
  cy.wait(200)
    .get('a[aria-label="Change: Billing to"]').focus().click()
    .get(`#w3w-billing`).scrollIntoView().focus().clear().type(hint)
    .get('[data-testid="suggestion-0"]').click()
    .get('#w3w-billing').invoke('val').should('match', /^\/\/\/(\w+.){2}\w+$/i)
})
