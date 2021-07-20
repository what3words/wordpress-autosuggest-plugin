# Configurating the Plugin

### API Key

You will need a what3words API key to use this plugin, as it authenticates and interacts with the [what3words API](https://developer.what3words.com/public-api). If you don't have a what3words API key yet, you can quickly and easily [sign up and register](https://accounts.what3words.com/create-api-key) for one.

Once you have a what3words API key:

1. Click the _what3words_ menu item on your wp-admin page.
2. Enter your API Key into the API key field.
3. Click _Save_

### General Settings

#### WooCommerce

The general settings allow you to customise how the what3words Address Field is configured on your site.

For WooCommerce users the plugin can automatically add an address field for both billing and shipping information, allowing your customer to specify a three word address for both billing and/or shipping address to help you locate your customers with ease. By default this option is selected and if you have configured your WooCommerce plugin it will automatically add these fields for you on your checkout page. Or you can select the _Add what3words Address Field to my checkout page for me_ option.

#### Custom Fields

Alternatively you can customise which field(s) to convert to a what3words Address Field by selecting _Convert an existing field to a what3words Address Field_ option and providing selectors for the inputs to convert. You can use any DOM compliant query selector(s) here to specify a single or multiple fields that you wish to convert.

__N.B. When using input selectors you should ensure each input field has a unique name attribute to ensure clashes do not occur if multiple what3words Address Fields appear on a single page.__

If you want to add a new custom field to extend as a what3words Address Field you should first create an input field on the page you wish to add this functionality to and provide with a `name`, `id` and/or  that can then use in the input selector to specify it. (Be careful when using classes as it can apply this behaviour to multiple fields.)

If you want to capture the selected what3words address you should wrap this field in a form with a submit button and this will then be submitted as specified by your form.

#### Save coordinates

If you need to capture the coordinates for a three word address to help with delivery information, for example, you should check the _Save coordinates_ checkbox with will also retrieve the coordinates for the captured three word address.

If you have added the what3words Address Field to your WooCommerce checkout and you select _Save coordinates_ the coordinates for the billing and shipping address fields will added to your order and visible in your Orders page on WooCommerce.

If you are using custom field(s) for the address then you the component will automatically attach hidden fields for both the latitude and longitude of the coordinates for the adddress prefixed with the name you supplied to the input field.

#### Accessibility

For improved accessibility it is recommended that you add a label to your what3words Address Field. By checking this option and supplying some text for the label you can easily associate a label to each of your address field(s).

For WooCommerce customers this option allows you to override the default label associated to the address field(s), while for custom field users this option tells the plugin to create a label field for you.

### Advanced Features

#### Custom placeholder

You can override the default placeholder for the address field(s) by selecting this option and specifying the placeholder text. We recommed you use the default placeholder value as it provides your customers with an example of how to use the what3words Address Field.

#### Clippings

We provide a number of options for clipping the autosuggest results. You can clip suggestions to a number of countries by providing comma separated 2 digit ISO codes for each country you wish to clip to. This will ensure suggestions provided are clipped within the countries specified. You can also clip within a circle, a bounding box or a polygon.

__N.B. - When providing multiple clippings the intersection of each is what forms the suggestions provided when using the what3words Address Field.__

For WooCommerce checkouts we recommend skipping these options as the clip to country is automatically set when a user selects a country for their billing and/or shipping information as they select a country from the dropdown menu options in the checkout form.