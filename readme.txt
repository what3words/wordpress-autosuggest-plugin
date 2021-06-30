=== what3words Autosuggest Plugin ===
Contributors: what3words
Tags: what3words, 3 word address, three word address, searchbox, search, address, validation
Requires at least: 4.7
Tested up to: 5.6
Requires PHP: 5.4.2 or later
Stable tag: 3.0.11
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

The what3words Autosuggest plugin helps you capture what3words addresses at checkout, using an address validation field.  By giving a what3words address, your customers can accurately pinpoint their desired delivery destination.

== Description ==
= what3words Autosuggest Plugin =

The _what3words Autosuggest plugin_ helps you capture what3words addresses at checkout, using an address validation field.  By giving a what3words address, your customers can accurately pinpoint their desired delivery destination.

what3words is a global addressing system that provides the simplest way to communicate location. It has divided the world into 3 metre squares and assigned each one a unique address made of just 3 words. It is more accurate than traditional street addressing, and even allows location information to be captured for places without addresses, such as parks or beaches.

=== How does this help your business? ===

It’s quick and easy to implement the what3words AutoSuggest Plugin. what3words addresses can be converted to GPS coordinates, which can then be passed onto delivery drivers. With a what3words address, deliveries can then arrive precisely in the right place and on time, giving a more reliable delivery experience for your customers.

=== And for your customers? ===

Your customers will have the option of providing the what3words address for their delivery location at the checkout. This gives them a way of providing a delivery location without the need to add complicated delivery instructions, and helps give them peace of mind that their delivery will be made to the right place, helping them to trust your business.

=== How does it work? ===

This plugin allows you to easily add capturing and validating a what3words address to a form on your WordPress powered site.
Powered by our AutoSuggest feature, the what3words address field returns suggestions based on full or partial what3words addresses,  helping users with the following types of input error:

- typing errors
- spelling errors
- misremembered words (e.g. singular vs. plural) or words in the wrong order

We recommend using the plugin when you want to capture a precise location from a user, such as a customer’s front door or specific entrance of a larger building.

== Installation ==

- You can install what3words AutoSuggest plugin automatically from the WordPress admin panel. From the Dashboard, navigate to *Plugins / Add New* and search for *"what3words"* and click on the *"Install Now"* button.
- Or you can install what3words AutoSuggest plugin manually. Download the plugin Zip archive and uncompress it. Copy or upload the `3-word-address-validation-field` folder to the `wp-content/plugins` folder on your web server.
- Activate the plugin. From the Dashboard, navigate to Plugins and click on the *"Activate"* link under the entry for What3words Searchbox.
- Customise and configure the plugin; from the Dashboard, navigate to the *Settings / what3words AutoSuggest plugin* page or click on the *"Settings"* link from the Plugins page on the Dashboard.
- Click on the *"Save what3words AutoSuggest plugin Settings"* button to preserve your chosen settings and options.

== Configuration ==

=== Enabling the plugin in a post or page ===

To enable the plugin on a post or page, simply add a text input field contained inside a form, and add the field’s id to the plugin’s Input Selector(s) configuration option as described below.

=== what3words API settings ===

You’ll need a  what3words API key to use this plugin, as it authenticates and interacts with the [what3words API](https://developer.what3words.com/public-api).
If you don’t have a what3words API key yet, you can quickly and easily sign-up and register for one. It will just take a few minutes to do!

=== WooCommerce Support ===

The plugin also allows you to automatically add a 3 word address validation field to a WooCommerce checkout form and save the 3 word address against the customer’s order details. By enabling WooCommerce checkout integration, the `#shipping_w3w` and `#billing_w3w` selectors will be automatically added to the list of Input Selector(s).

== Screenshots ==

1. Simple and fast to integrate
2. Powered by what3words AutoSuggest
3. Use 3 word addresses for precise and reliable deliveries
4. Accept 3 word addresses at checkout

== Frequently Asked Questions ==

=== Is there a web site for this plugin? ===

Absolutely. Go to the [what3words AutoSuggest plugin home page](https://developer.what3words.com/tools/e-commerce/wordpress) for the latest information. There’s also the official WordPress [plugin repository page](https://wordpress.org/plugins/what3words-searchbox/) and the source for the plugin is on [GitHub](https://github.com/what3words/wordpress-autosuggest-plugin/) as well.

=== what3words AutoSuggest plugin isn't available in my language; can I submit a translation? ===

WordPress and this plugin use the Gnu gettext tools to support internationalisation. The source file containing each string that needs to be translated ships with the plugin in what3words-searchbox/lang/src/what3words-searchbox.po. See the [I18n for WordPress Developers](https://codex.wordpress.org/I18n_for_WordPress_Developers) page for more information or get in touch for help.

=== I have a question that's not answered here; what do I do? ===

Have a read of the [what3words Knowledge Base](https://support.what3words.com), which contains many more frequently asked questions and their answers.

== Filter Support And Usage ==

what3words AutoSuggest plugin supports a single filter to change the default set of installation settings and options at plugin activation time.

== More about what3words ==
what3words is available in 45+ languages, with pre-assigned, standardised 3 word addresses that are much easier to remember than lat/long coordinates.

Find our full developer documentation here: [what3words.com](https://developer.what3words.com/)

You can learn more about our privacy policy here: [what3words Privacy Policy](https://corpassets.what3words.com/wp-content/uploads/2020/07/Privacy-and-Cookie-Policy-31-July.pdf)

== Changelog ==

The current version is 3.0.11 (2021.06.30)

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
- API key
- CSS selector to specify which inputs should be upgraded to the auto suggest component
- Placeholder text shown on inputs
- Turn on/off the WooCommerce integration, to automatically add what3words address fields to your checkout forms

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

= 2.0.4 =
This is the 8th version of the plugin

= 2.0.3 =
This is the 7th version of the plugin

= 2.0.2 =
This is the 6th version of the plugin

= 2.0.1 =
This is the 5th version of the plugin

= 2.0.0 =
This is the 4th version of the plugin

= 1.0.0 =
This is the first version of the plugin
