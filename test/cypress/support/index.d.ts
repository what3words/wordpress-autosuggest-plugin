declare namespace Cypress {
  interface Chainable {
    attachIntercepts(): Chainable
    login(username: string, password: string): Chainable
    activatePlugin(plugin_name: string, plugin_php_file?: string): Chainable
    installPlugin(plugin_name: string, plugin_slug: string): Chainable
    uninstallPlugin(plugin_slug: string): Chainable
    deactivatePlugin(plugin_name: string, plugin_php_file?: string): Chainable
    openSettingsPage(plugin_name: string): Chainable
    getElementByDataTestId(test_id: string): Chainable<Element>
    setApiKey(api_key: string): Chainable
    setSelector(selector: string): Chainable
    assertApiKeyNotice(exists: boolean): Chainable
    assertTargetValidity(selector: string, validity: boolean): Chainable
    completeCheckoutForm(
      formData: {
        first: string, last: string, address?: string, city: string, postcode: string, phone: string, hint?: string,
      },
      isBilling?: boolean,
      hasSeparate3waField?: boolean,
      isFluidCheckout?: boolean,
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