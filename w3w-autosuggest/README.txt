=== what3words Address Field ===
Contributors: what3words
Tags: what3words, 3 word address, three word address, searchbox, search, address, validation, autosuggest, w3w
Requires at least: 4.7
Tested up to: 6.1
Stable tag: 4.0.10
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Official plugin to allow customers to enter and validate a what3words address on your checkout for accurate deliveries.

== Description ==

https://www.youtube.com/watch?v=vBEfrS2eLYc

__Add a what3words address field to collect more accurate delivery locations from customers__

Reduce lost parcels, spend less time on delivery admin, and improve customer satisfaction. This address field enables you to collect and validate what3words addresses entered by your customers. They can then be passed to your delivery provider, so orders arrive in exactly the right place.

what3words enables your customers to give precise delivery locations. Every 3 metre square in the world has an address made of 3 random words.

* Enable a what3words address field at checkout
* Validate what3words addresses as they are entered
* AutoSuggest feature helps customers enter the correct address
* Option to limit entry of what3words addresses to a specific country or area
* Save location coordinates so they're easy to pass on to couriers and delivery partners

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

1. Collect precise delivery locations from customers at checkout with what3words
2. Customers receive parcels exactly where they want them to be
3. what3words app settings page on Wordpress with tools and features
4. Pass on what3words addresses to our delivery partners DHL, DPD, Evri and Yodel

== Changelog ==

= 4.0.10 =
* Release 2024.01.15
* Updated autosuggest component from version 4.0.6 to 4.2.1

= 4.0.9 =
* Released 2023.12.13
* Updated plugin description
* Updated screenshots
* Added video on description

= 4.0.8 =
* Released 2023.10.04
* Fixed a bug that did not populate clip to country correctly with certain themes

= 4.0.7 =
* Released 2023.10.02
* Patched a security vulnerability that captured all $_POST values and stored them in the DB
* Fixed a bug that did not allow clip to country to be deselected

= 4.0.6 =
* Released 2023.05.15
* Fixed a bug that displays null when input selector used and save nearest place is not selected
* Display what3words address on order emails

= 4.0.5 =
* Released 2023.01.04
* Autosuggest not being rendered correctly on certain checkout pages
* Fixed a bug where the autosuggest web-component was not being mounted correctly
* JS script now uses native javascript selectors instead of JQuery

= 4.0.4 =
* Released 2022.05.31
* Fixed critical error which surfaced when WooCommerce plugin is not installed

= 4.0.3 =
* Released 2022.05.03
* Update to improve integration on checkout page with Fluid Checkout and other plugins.
* Bump autosuggest component library version to v4.0.6

= 4.0.2 =
* Released 2022.04.21
* Fix bug where metadata wasn't sent to WooCommerce if applying autosuggest to an existing field.

= 4.0.1 =
* Released 2022.03.25
* Security vulnerability fixed for `get_option` exposing sensitive information.
* Loading the w3w autosuggest script asynchronously

= 4.0.0 =
* Released 2021.07.20
* Upgraded to use V4 of the what3words AutoSuggest Component with improved styling and functionality.
* Updated admin section interface.
* Addition of advanced clipping options to restrict suggestions displayed to a user.
* Addition of options to store latitude and longitude coordinates and nearest place against a record.
* Added ability to change the field label.

= 3.0.11 =
* Released 2021.06.30
* Fixes non-fatal debugging log output for PHP "Variable assignment" error

= 3.0.10 =
* Released 2021.03.09
* Fixes passing API key to autosuggest for requests.

= 3.0.9 =
* Released 2021.02.03
* Updated screenshots
* Send key version numbers to what3words API via `X-W3W-Plugin` request header.

= 3.0.8 =
* Released 2020.12.11
* Improved interoperability, errors in 3rd party scripts will be less likely to prevent the plugin operating.
* Bumped to latest WordPress release, 5.6

= 3.0.7 =
* Released 2020.06.17
* Addresses an error that prevented the plugin loading on Internet Explorer.
* Minor styling improvements.

= 3.0.6 =
* Released 2020.06.02
* Further improvements to match theme styling
* Clarified the purpose of the `Input Selector(s)` field
* Updated readme

= 3.0.5 =
* Released 2020.06.01
* Apply missing `font-size` property.

= 3.0.4 =
* Released 2020.06.01
* Hotfix missing `font-size` property.

= 3.0.3 =
* Released 2020.06.01
* Plugin tweaked to take up less vertical height on themes with slimmer text inputs.

= 3.0.2 =
* Released 2020.06.01
* The plugin now inherits styles from the current wordpress theme for more seamless integration.
* The following css properties are automatically applied to the upgraded input: `background-color`, `border`, `border-radius`, `color`, `font`, `height`.

= 3.0.1 =
* Released 2020.05.27
* Fixes an issue where country clipping would not work when shipping and billing addresses were in different countries.
* Updated screenshots

= 3.0.0 =
* Released 2020.05.26
* Updated the plugin to use new web component and V3 of the what3words API. Note that this release simplifies the plugin setup and removes some settings.
* Updated links to what3words documentation and developer site
* Settings available are now:
* API key
* CSS selector to specify which inputs should be upgraded to the auto suggest component
* Placeholder text shown on inputs
* Turn on/off the WooCommerce integration, to automatically add what3words address fields to your checkout forms

= 2.0.4 =
* Released 2019.01.16
* Added new function to allow a country field to be specified for country clipping

= 2.0.3 =
* Released 2018.04.05
* bug fixes

= 2.0.2 =
* Released 2018.03.16
* bug fixes

= 2.0.1 =
* Released 2018.01.09
* bug fixes

= 2.0.0 =
* Released 2018.01.08
* Reworked and redesigned plugin code base

= 1.1.0 =
* uses what3words autosuggest jQuery plugin 1.2.0

= 1.0.1 =
* General fixes

= 1.0.0 =
* Initial release

== Upgrade Notice ==

= 4.0.6 =
Fixed non-critical bug which caused null to be rendered to the DOM in some instances

= 4.0.4 =
Fixed critical error which surfaced when WooCommerce plugin is not installed

= 4.0.3 =
Improved integration with Fluid Checkout plugin for WooCommerce.

= 4.0.2 =
Fix bug where metadata wasn't sent to WooCommerce if applying autosuggest to an existing field.

= 4.0.1 =
Performance improvements and security vulnerability patch

= 4.0 =
Upgrade the what3words address field plugin to use the latest version of the what3words AutoSuggest Component and new plugin features.

= 3.0 =
This is the 9th version of the plugin

= 2.0 =
This is the 4th version of the plugin

= 1.0 =
This is the first version of the plugin
