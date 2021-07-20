=== what3words Address Field ===
Contributors: what3words
Tags: what3words, 3 word address, three word address, searchbox, search, address, validation, autosuggest, w3w
Requires at least: 4.7
Tested up to: 5.7
Stable tag: 4.0.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Official plugin to allow customers to enter and validate a what3words address on your checkout for accurate deliveries.

== Description ==

The what3words Address Field plugin helps you capture what3words addresses at checkout, using an address validation field.  By giving a what3words address, your customers can accurately pinpoint their desired delivery destination.

what3words is a global addressing system that provides the simplest way to communicate location. It has divided the world into 3 metre squares and assigned each one a unique address made of just 3 words. It is more accurate than traditional street addressing, and even allows location information to be captured for places without addresses, such as parks or beaches.

= How does this help your business? =

It’s quick and easy to implement the what3words Address Field plugin. what3words addresses can be converted to GPS coordinates, which can then be passed onto delivery drivers. With a what3words address, deliveries can then arrive precisely in the right place and on time, giving a more reliable delivery experience for your customers.

= And for your customers? =

Your customers will have the option of providing the what3words address for their delivery location at the checkout. This gives them a way of providing a delivery location without the need to add complicated delivery instructions, and helps give them peace of mind that their delivery will be made to the right place, helping them to trust your business.

= How does it work? =

This plugin allows your customers to easily enter and validate a what3words address in a form on your WordPress powered site, most likely your checkout page if using WooCommerce.

Powered by our AutoSuggest feature, the what3words address field returns suggestions based on full or partial what3words addresses,  helping users with the following types of input error:

* typing errors
* spelling errors
* misremembered words (e.g. singular vs. plural) or words in the wrong order

We recommend using the plugin when you want to capture a precise location from a user, such as a customer’s front door or specific entrance of a larger building.


== Installation ==

= WordPress Installation (recommended) =

You can install the what3words Address Field plugin through the WordPress plugins page in your WordPress admin panel. 

1. Navigate to the _Plugins > Add New_ page
2. Search for "what3words" 
3. Click the _Install Now_ button.
4. Once installed, you can activate the plugin on the _Plugins_ page.

= Manual Installation =

You can download the what3words Address Field plugin from the [WordPress Plugins site](https://wordpress.org/plugins/3-word-address-validation-field/#installation).

1. Download the what3words Address Field plugin from the WordPress Plugins site
2. Once you have downloaded the zipped plugin, you can upload it to your WordPress installation by navigating to _Plugins > Add New_, click the _Upload Plugin_ button
3. Select the zipped plugin file and click _Install Now_
4. Once installed, you can activate the plugin on the _Plugins_ page.

= Configuration =

== API Key ==

You will need a what3words API key to use this plugin, as it authenticates and interacts with the [what3words API](https://developer.what3words.com/public-api). If you don't have a what3words API key yet, you can quickly and easily [sign up and register](https://accounts.what3words.com/create-api-key) for one.

Once you have a what3words API key:

1. Click the _what3words_ menu item on your wp-admin page.
2. Enter your API Key into the API key field.
3. Click _Save_

== General Settings ==

=== WooCommerce ===

The general settings allow you to customise how the what3words Address Field is configured on your site.

For WooCommerce users the plugin can automatically add an address field for both billing and shipping information, allowing your customer to specify a three word address for both billing and/or shipping address to help you locate your customers with ease. By default this option is selected and if you have configured your WooCommerce plugin it will automatically add these fields for you on your checkout page. Or you can select the _Add what3words Address Field to my checkout page for me_ option.

=== Custom Fields ===

Alternatively you can customise which field(s) to convert to a what3words Address Field by selecting _Convert an existing field to a what3words Address Field_ option and providing selectors for the inputs to convert. You can use any DOM compliant query selector(s) here to specify a single or multiple fields that you wish to convert.

__N.B. When using input selectors you should ensure each input field has a unique name attribute to ensure clashes do not occur if multiple what3words Address Fields appear on a single page.__

If you want to add a new custom field to extend as a what3words Address Field you should first create an input field on the page you wish to add this functionality to and provide with a `name`, `id` and/or  that can then use in the input selector to specify it. (Be careful when using classes as it can apply this behaviour to multiple fields.)

If you want to capture the selected what3words address you should wrap this field in a form with a submit button and this will then be submitted as specified by your form.

=== Save coordinates ===

If you need to capture the coordinates for a three word address to help with delivery information, for example, you should check the _Save coordinates_ checkbox with will also retrieve the coordinates for the captured three word address.

If you have added the what3words Address Field to your WooCommerce checkout and you select _Save coordinates_ the coordinates for the billing and shipping address fields will added to your order and visible in your Orders page on WooCommerce.

If you are using custom field(s) for the address then you the component will automatically attach hidden fields for both the latitude and longitude of the coordinates for the adddress prefixed with the name you supplied to the input field.

=== Accessibility ===

For improved accessibility it is recommended that you add a label to your what3words Address Field. By checking this option and supplying some text for the label you can easily associate a label to each of your address field(s).

For WooCommerce customers this option allows you to override the default label associated to the address field(s), while for custom field users this option tells the plugin to create a label field for you.

== Advanced Features ==

=== Custom placeholder ===

You can override the default placeholder for the address field(s) by selecting this option and specifying the placeholder text. We recommed you use the default placeholder value as it provides your customers with an example of how to use the what3words Address Field.

=== Clippings ===

We provide a number of options for clipping the autosuggest results. You can clip suggestions to a number of countries by providing comma separated 2 digit ISO codes for each country you wish to clip to. This will ensure suggestions provided are clipped within the countries specified. You can also clip within a circle, a bounding box or a polygon.

__N.B. - When providing multiple clippings the intersection of each is what forms the suggestions provided when using the what3words Address Field.__

For WooCommerce checkouts we recommend skipping these options as the clip to country is automatically set when a user selects a country for their billing and/or shipping information as they select a country from the dropdown menu options in the checkout form.


== Frequently Asked Questions ==

= I have a question that's not answered here; what do I do? =

Have a read of the [what3words Knowledge Base](https://support.what3words.com), which contains many more frequently asked questions and their answers.

= More about what3words =

what3words is available in 45+ languages, with pre-assigned, standardised 3 word addresses that are much easier to remember than lat/lng coordinates.

Find our full developer documentation here:
[https://developer.what3words.com](https://developer.what3words.com/)

You can learn more about our privacy policy here:
[https://what3words.com/privacy](https://what3words.com/privacy)

= Get in touch with us =

Have any questions? Want to learn more about how the what3words Address Field plugin works? Get in touch with us at [support@what3words.com](mailto:support@what3words.com).


== Screenshots ==

1. Accept what3words addresses on your checkout page, or in a custom field.
2. Display autosuggest results with geolocations to reduce user error
3. Customize the autosuggest results with advanced features


== Changelog ==

= 4.0.0 =
* Released 2021.07.20
* Updated to the [what3words AutoSuggest Component v4](https://developer.what3words.com/tutorial/javascript-autosuggest-component-v4) with improvements to functionality, integration and style overriding.
* Updates to the what3words admin settings and options interface.
* Updates to the advanced clipping options to restrict suggestions displayed to a user for localisation.
* Retrieve more metadata such as coordinates and nearest place information for a selected what3words address.
* Improved customisation of the Autosuggest Component and optional <label> element displayed to your customers.
* Improved integration with WooCommerce Cart, Checkout and Orders.


== Upgrade Notice ==

= 4.0 =
Upgrade the what3words address field plugin to use the latest version of the what3words AutoSuggest Component and new plugin features.

= 3.0 =
This is the 9th version of the plugin

= 2.0 =
This is the 4th version of the plugin

= 1.0 =
This is the first version of the plugin
