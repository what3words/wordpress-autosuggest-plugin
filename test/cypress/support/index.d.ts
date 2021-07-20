declare namespace Cypress {
  interface Chainable {
    login(username: string, password: string): Chainable
    activatePlugin(plugin_name: string, plugin_php_file?: string): Chainable
    deactivatePlugin(plugin_name: string, plugin_php_file?: string): Chainable
    openSettingsPage(plugin_name: string): Chainable
    getElementByDataTestId(test_id: string): Chainable<Element>
    setApiKey(api_key: string): Chainable
    assertApiKeyNotice(exists: boolean): Chainable
    assertTargetValidity(selector: string, validity: boolean): Chainable
    completeCheckoutForm(
      formData: {
        first: string, last: string, address: string, city: string, postcode: string, phone: string, hint: string,
      },
      isBilling?: boolean
    ): Chainable
    saveSettings(): Chainable
    placeOrder(): Chainable
    selectManagedInput(): Chainable
    selectInputSelector(): Chainable
    toggleReturnCoordinates(): Chainable
    toggleNearestPlace(): Chainable
    toggleLabel(): Chainable
    toggleAdvancedSettings(): Chainable
    togglePlaceholder(): Chainable
    toggleClipToCountry(): Chainable
    toggleClipToCircle(): Chainable
    toggleClipToBoundingBox(): Chainable
    toggleClipToPolygon(): Chainable

    saveAdvanced(): Chainable
  }
}