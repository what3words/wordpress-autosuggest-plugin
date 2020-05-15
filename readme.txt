=== what3words Autosuggest Plugin ===
Contributors: what3words
Tags: what3words, 3 word address, three word address, searchbox, search, address, validation
Requires at least: 4.7
Tested up to: 5.0.3
Stable tag: 2.0.4
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

WordPress plugin to allow you to easily search for, capture and validate what3words' 3 word addresses

== Description ==

This plugin allows you to add searching for, capturing and validating a 3 word address from a form on your WordPress powered site.

== Installation ==

1. You can install what3words AutoSuggest plugin automatically from the WordPress admin panel. From the Dashboard, navigate to *Plugins / Add New* and search for *"what3words AutoSuggest plugin"* and click on the *"Install Now"* button.
1. Or you can install what3words AutoSuggest plugin manually. Download the plugin Zip archive and uncompress it. Copy or upload the `what3words-searchbox` folder to the `wp-content/plugins` folder on your web server.
1. Activate the plugin. From the Dashboard, navigate to Plugins and click on the *"Activate"* link under the entry for What3words Searchbox.
1. Customise and configure the plugin; from the Dashboard, navigate to the *Settings / what3words AutoSuggest plugin* page or click on the *"Settings"* link from the Plugins page on the Dashboard.
1. Click on the *"Save what3words AutoSuggest plugin Settings"* button to preserve your chosen settings and options.

== Configuration ==

= Enabling the plugin in a post or page =

To enable the plugin on a post or page, simply add a text input field, contained inside a form, and add the field's *id* to the plugin's *Input Selector(s)* configuration option as described below.

= what3words API settings =

A what3words API key is required to use this plugin as it authenticates and interacts with the what3words [RESTful API](https://docs.what3words.com/api/v2/)

If you don’t have a what3words API key yet, you can quickly and easily sign-up and [register](https://what3words.com/register?dev=true) for one.

= General Settings =

* Input Selector(s) - the `input` fields that the plugin is configured to search for 3 word addresses. These should be specified as a comma
separated list of jQuery object selectors.

* Input Placeholder Text - an optional placeholder to be displayed in the `input` fields that are configured in the *Input Selector(s)* option.

* Suggestion Count - by default, the plugin will return 3 suggestions; you can choose to display between 8 and 8 suggestions.

= Localisation Settings =

* Input Language - specifies the default language that should be used for searching for 3 word addresses. If *Multilingual Search*
is disabled; then only 3 word addresses in the *Input Language* will be used.

* Multilingual Search - by default, the plugin searches for 3 word addresses in *all* languages; you can restrict searches to a single language by
disabling this option.

* Enable Country Filtering / Country - by default, 3 word address suggestions will be returned for all countries. You can configure the plugin
to restrict suggestions to a single country by checking the *Enable Country Filtering* checkbox and selecting the desired country in the
*Country* dropdown.

* Text Direction - specifies the text scanning direction of the 3 word address search box. Options are *Left to right* or *Right to left* (e.g. for Arabic).

= WooCommerce Support =

The plugin also allows you to automatically add a 3 word address validation field to a WooCommerce checkout form and save the 3 word address against the customer’s order details.

By enabling WooCommerce checkout integration, the `#shipping_w3w` and `#billing_w3w` selectors will be automagically added to the list of *Input Selector(s)*.

== Frequently Asked Questions ==

= what3words? =

*what3words provides a precise and incredibly simple way to talk about location. We have divided the world into a grid of 3m x 3m squares and assigned each one a unique 3 word address*. For more information check out the [what3words](https://what3words.com/about) web site.

= How do I get help or support for this plugin? =

You can ask a question on the [WordPress support forum](http://wordpress.org/support/plugin/what3words-searchbox) so that other users can follow the conversation. You can ask a question on Twitter; we're [@what3words](http://twitter.com/what3words). Or you can drop us an [email](support@what3words.com) instead.

= Is there a web site for this plugin? =

Absolutely. Go to the [what3words AutoSuggest plugin home page](https://github.com/what3words/what3words-searchbox) for the latest information. There's also the official [WordPress plugin repository page](http://wordpress.org/plugins/what3words-searchbox/) and the [source for the plugin is on GitHub](https://github.com/what3words/what3words-searchbox/) as well.

= what3words AutoSuggest plugin isn't available in my language; can I submit a translation? =

WordPress and this plugin use the Gnu `gettext` tools to support internationalisation. The source file containing each string that needs to be translated ships with the plugin in `what3words-searchbox/lang/src/what3words-searchbox.po`. See the [I18n for WordPress Developers](http://codex.wordpress.org/I18n_for_WordPress_Developers) page for more information or get in touch for help and hand-holding.

= I have a question that's not answered here; what do I do? =

Have a read of the [what3words Knowledge Base](https://support.what3words.com), which contains many more frequently asked questions and their answers.

== Screenshots ==

1. Plugin settings
1. The plugin at work, showing a searchbox

== Changelog ==

The current version is 2.0.4 (2019.01.16)

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

== Filter Support And Usage ==

what3words AutoSuggest plugin supports a single filter to change the default set of installation settings and options at plugin activation time.

= what3wordssearchbox_default_settings =

Applied to the default set of plugin settings and options. Note that this filter is called once, upon plugin activation, when there are no what3words AutoSuggest plugin settings/options existing in the database.

*Example:* Add the date and time that the plugin was first activated

`add_filter ('what3wordssearchbox_default_settings', 'add_activation_timestamp');

function add_activation_timestamp ($options) {
	// options = array (option name => option value)
	$options['plugin_activation_timestamp'] = date (DATE_ATOM);

	return $options;
}`