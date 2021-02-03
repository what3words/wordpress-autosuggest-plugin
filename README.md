# what3words Autosuggest Plugin #

## Description ##

The *what3words Autosuggest plugin* helps you capture what3words addresses at checkout, using an address validation field.  By giving a what3words address, your customers can accurately pinpoint their desired delivery destination.

what3words is a global addressing system that provides the simplest way to communicate location. It has divided the world into 3 metre squares and assigned each one a unique address made of just 3 words. It is more accurate than traditional street addressing, and even allows location information to be captured for places without addresses, such as parks or beaches.

### How does this help your business? ###

It’s quick and easy to implement the what3words AutoSuggest Plugin. what3words addresses can be converted to GPS coordinates, which can then be passed onto delivery drivers. With a what3words address, deliveries can then arrive precisely in the right place and on time, giving a more reliable delivery experience for your customers.

### And for your customers? ###

Your customers will have the option of providing the what3words address for their delivery location at the checkout. This gives them a way of providing a delivery location without the need to add complicated delivery instructions, and helps give them peace of mind that their delivery will be made to the right place, helping them to trust your business.

### How does it work? ###

This plugin allows you to easily add capturing and validating a what3words address to a form on your WordPress powered site.
Powered by our AutoSuggest feature, the what3words address field returns suggestions based on full or partial what3words addresses,  helping users with the following types of input error:

- typing errors
- spelling errors
- misremembered words (e.g. singular vs. plural) or words in the wrong order
We recommend using the plugin when you want to capture a precise location from a user, such as a customer’s front door or specific entrance of a larger building.

## Installation ##

- You can install what3words AutoSuggest plugin automatically from the WordPress admin panel. From the Dashboard, navigate to *Plugins / Add New* and search for *"what3words"* and click on the *"Install Now"* button.
- Or you can install what3words AutoSuggest plugin manually. Download the plugin Zip archive and uncompress it. Copy or upload the `3-word-address-validation-field` folder to the `wp-content/plugins` folder on your web server.
- Activate the plugin. From the Dashboard, navigate to Plugins and click on the *"Activate"* link under the entry for What3words Searchbox.
- Customise and configure the plugin; from the Dashboard, navigate to the *Settings / what3words AutoSuggest plugin* page or click on the *"Settings"* link from the Plugins page on the Dashboard.
- Click on the *"Save what3words AutoSuggest plugin Settings"* button to preserve your chosen settings and options.

## Configuration ##

### Enabling the plugin in a post or page ###

To enable the plugin on a post or page, simply add a text input field contained inside a form, and add the field’s id to the plugin’s Input Selector(s) configuration option as described below.

### what3words API settings ###

You’ll need a  what3words API key to use this plugin, as it authenticates and interacts with the [what3words API](https://developer.what3words.com/public-api).
If you don’t have a what3words API key yet, you can quickly and easily sign-up and register for one. It will just take a few minutes to do!

### General Settings ###

- Input Selectors (WordPress only) – the input fields that the plugin is configured to search for 3 word addresses, specified as a list of css selectors. Multiple fields can be specified using commas, e.g. “.class, #id”.
- Input Placeholder Text – an optional placeholder to be displayed in the input fields that are configured in the Input Selector(s) option. We recommend providing an example what3words address here with “e.g.” to illustrate how a what3words address should be entered, for example, “e.g. index.home.raft”

### WooCommerce Support ###

The plugin also allows you to automatically add a 3 word address validation field to a WooCommerce checkout form and save the 3 word address against the customer’s order details. By enabling WooCommerce checkout integration, the `#shipping_w3w` and `#billing_w3w` selectors will be automatically added to the list of Input Selector(s).

## Frequently Asked Questions ##

### Is there a web site for this plugin? ###

Absolutely. Go to the [what3words AutoSuggest plugin home page](https://developer.what3words.com/tools/e-commerce/wordpress) for the latest information. There’s also the official WordPress [plugin repository page](https://wordpress.org/plugins/what3words-searchbox/) and the source for the plugin is on [GitHub](https://github.com/what3words/wordpress-autosuggest-plugin/) as well.

### what3words AutoSuggest plugin isn't available in my language; can I submit a translation? ###

WordPress and this plugin use the Gnu gettext tools to support internationalisation. The source file containing each string that needs to be translated ships with the plugin in what3words-searchbox/lang/src/what3words-searchbox.po. See the [I18n for WordPress Developers](https://codex.wordpress.org/I18n_for_WordPress_Developers) page for more information or get in touch for help.

### I have a question that's not answered here; what do I do? ###

Have a read of the [what3words Knowledge Base](https://support.what3words.com), which contains many more frequently asked questions and their answers.

## Filter Support And Usage ##

what3words AutoSuggest plugin supports a single filter to change the default set of installation settings and options at plugin activation time.

## More about what3words ##
what3words is available in 45+ languages, with pre-assigned, standardised 3 word addresses that are much easier to remember than lat/long coordinates.

Find our full developer documentation here:
[what3words.com](https://developer.what3words.com/)

You can learn more about our privacy policy here: [what3words Privacy Policy](https://corpassets.what3words.com/wp-content/uploads/2020/07/Privacy-and-Cookie-Policy-31-July.pdf)
