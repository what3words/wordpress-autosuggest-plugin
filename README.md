# what3words Autosuggest Plugin #
Contributors: what3words
Tags: what3words, 3 word address, three word address, searchbox, search, address, validation
Requires at least: 4.7
Tested up to: 5.4.1
Requires PHP: 5.4.2 or later
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

## Description ##

This plugin allows you to easily add searching for, capturing, and validating a what3words address to a form on your WordPress powered site.

Returning suggestions based on full or partial 3 word addresses, the AutoSuggest feature helps users with the following types of input error:
- typing errors
- spelling errors
- misremembered words (e.g. singular vs. plural) or words in the wrong order

We recommend using the plugin when you want to capture a precise location from a user. This could be the exact location of your customer’s front door, for example, for delivering their purchase.



## Installation ##

1. You can install what3words AutoSuggest plugin automatically from the WordPress admin panel. From the Dashboard, navigate to *Plugins / Add New* and search for *"what3words"* and click on the *"Install Now"* button.
1. Or you can install what3words AutoSuggest plugin manually. Download the plugin Zip archive and uncompress it. Copy or upload the `3-word-address-validation-field` folder to the `wp-content/plugins` folder on your web server.
1. Activate the plugin. From the Dashboard, navigate to Plugins and click on the *"Activate"* link under the entry for What3words Searchbox.
1. Customise and configure the plugin; from the Dashboard, navigate to the *Settings / what3words AutoSuggest plugin* page or click on the *"Settings"* link from the Plugins page on the Dashboard.
1. Click on the *"Save what3words AutoSuggest plugin Settings"* button to preserve your chosen settings and options.

## Configuration ##

### Enabling the plugin in a post or page ###

To enable the plugin on a post or page, simply add a text input field, contained inside a form, and add the field’s id to the plugin’s Input Selector(s) configuration option as described below.

### what3words API settings ###

A what3words API key is required to use this plugin as it authenticates and interacts with the [what3words API](https://developer.what3words.com/public-api).
If you don’t have a what3words API key yet, you can quickly and easily sign-up and [register](https://accounts.what3words.com/create-api-key) for one.


### General Settings ###

* Input Selectors (WordPress only) – the input fields that the plugin is configured to search for 3 word addresses, specified as a list of css selectors. Multiple fields can be supplies using commas, e.g. “.class, #id”.

* Input Placeholder Text – an optional placeholder to be displayed in the input fields that are configured in the Input Selector(s) option. We recommend providing an example what3words address here with “e.g.” to illustrate how a what3words address should be entered, for example, “e.g. index.home.raft”.

### WooCommerce Support ###

The plugin also allows you to automatically add a 3 word address validation field to a WooCommerce checkout form and save the 3 word address against the customer’s order details. By enabling WooCommerce checkout integration, the `#shipping_w3w` and `#billing_w3w` selectors will be automatically  added to the list of `Input Selector(s)`.

## Frequently Asked Questions ##

### Is there a web site for this plugin? ###

Absolutely. Go to the [what3words AutoSuggest plugin home page](https://developer.what3words.com/tools/e-commerce/wordpress) for the latest information. There’s also the official WordPress [plugin repository page](https://wordpress.org/plugins/what3words-searchbox/) and the source for the plugin is on [GitHub](https://github.com/what3words/wordpress-autosuggest-plugin/) as well.

### what3words AutoSuggest plugin isn't available in my language; can I submit a translation? ###

WordPress and this plugin use the Gnu gettext tools to support internationalisation. The source file containing each string that needs to be translated ships with the plugin in what3words-searchbox/lang/src/what3words-searchbox.po. See the [I18n for WordPress Developers](https://codex.wordpress.org/I18n_for_WordPress_Developers) page for more information or get in touch for help.

### I have a question that's not answered here; what do I do? ###

Have a read of the [what3words Knowledge Base](https://support.what3words.com), which contains many more frequently asked questions and their answers.


## Filter Support And Usage ##

what3words AutoSuggest plugin supports a single filter to change the default set of installation settings and options at plugin activation time.

### what3wordssearchbox_default_settings ###

Applied to the default set of plugin settings and options. Note that this filter is called once, upon plugin activation, when there are no what3words AutoSuggest plugin settings/options existing in the database.

*Example:* Add the date and time that the plugin was first activated

<pre><code>add_filter ('what3wordssearchbox_default_settings', 'add_activation_timestamp');

function add_activation_timestamp ($options) {
	// options = array (option name => option value)
	$options['plugin_activation_timestamp'] = date (DATE_ATOM);

	return $options;
}
</code></pre>