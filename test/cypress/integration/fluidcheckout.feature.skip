Feature: Public JS

  Public JS attaches autosuggest functionality to a page's element(s)

  @w3w_enabled @woocommerce_enabled @fluid_enabled
  Scenario: Fluid Checkout checkout page
    Given a customer has an item in their cart
    When they go to checkout
    Then they see autosuggest when they open shipping
    And they see autosuggest when they open billing