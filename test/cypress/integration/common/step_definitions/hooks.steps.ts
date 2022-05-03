import { After, Before } from 'cypress-cucumber-preprocessor/steps';

Before(() =>
  cy.task('db:setup')
    .attachIntercepts()
);

Before({ tags: '@w3w_enabled or @woocommerce_enabled or @woocommerce_disabled or @fluid_enabled'}, () => {
  cy.login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))
});

Before({ name: 'Enable w3w plugin', tags: '@w3w_enabled' }, () =>
  cy.activatePlugin('w3w-autosuggest')
    .openSettingsPage('what3words')
    .setApiKey(Cypress.env('API_KEY'))
    .getElementByDataTestId('enable_w3w_managed').should('be.checked')
);

Before({ name: 'Disable woocommerce plugin', tags: '@woocommerce_disabled' }, () =>
  cy.deactivatePlugin('woocommerce')
);

After(() => {
  cy.login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD'))
});

After({ name: 'Disable w3w plugin', tags: '@w3w_enabled' }, () =>
  cy.deactivatePlugin('w3w-autosuggest')
);
