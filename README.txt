=== 3 word address validation field ===
Contributors: what3words
Tags: what3words, w3w, what 3 words, autosuggest, address, 3 word address, postcode, coordinates, location, delivery, e-commerce, ecommerce, checkout, form, woocommerce
Requires at least: 4.0.1
Tested up to: 4.7.2
Stable tag: 4.7.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Easily capture 3 word addresses on your website by using the 3 word address validation field plugin by what3words.

== Description ==

what3words gives every 3mx3m square in the world a unique 3 word address. It is a great tool to use when a street address is not accurate enough or doesn’t exist.

The 3 word address validation field plugin created by what3words allows you to easily integrate 3 word addresses into a form on your site.

Returning suggestions based on full or partial 3 word addresses, it helps users with the following types of input error:

* typing errors
* spelling errors
* misremembered words (e.g. singular vs. plural) words in the wrong order

We recommend using the plugin when you want to capture a precise location from a user. This could be the exact delivery point for your customer’s order e.g. their front door.

= Build more with what3words =

what3words is available in most of the official UN languages, as well as several others. 3 word addresses are pre-assigned and are much easier to remember than lat/long coordinates.

Visit our [developer site](http://developer.what3words.com/) for more information on how to integrate your products with what3words.


== Installation ==

You can install the 3 word address validation field plugin directly via the plugin directory, or by uploading the files manually to your server.

Once the plugin has been installed, you must configure it via the plugin settings. See ‘Configuration’ below for more details.

= Configuration =

= what3words API Settings =

A what3words API key is required to use the plugin as it authenticates and interacts with the what3words RESTful API [autosuggest method](https://docs.what3words.com/api/v2/#autosuggest).

If you don’t have a what3words API key yet, you'll need to [register](https://map.what3words.com/register?dev=true) for one.

= AutoSuggest Settings =

The 3 word address validation field uses the what3words autosuggest method to help users with input errors. It can be configured with the following settings:

* Input field(s). You must specify the jQuery object selector(s) where you would like the 3 word address validation field to appear as an input field (.class or #id). Multiple instances can be separated using commas e.g. “#shipping_w3w, #billing_w3w”.

* Number of results. Defines the number of 3 word address suggestions shown in the autosuggest results. The maximum number of results that can be shown is 20.

* Language. The list of languages currently supported by what3words, defined as a 2 letter [ISO 639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) code (default is "en").

* Language detection. When enabled, the autosuggest language automatically updates if a valid 3 word address is detected in a different language.

* UI Direction. Direction of the 3 word address validation field. Options are "Left to Right" or "Right to Left" (used for e.g. Arabic).

* Input placeholder. Placeholder text for the 3 word address validation field, for example "e.g. lock.spout.radar". We recommend using a placeholder of a 3 word address in the same language as the autosuggest language.


= WooCommerce Checkout =

The plugin also allows you to automatically add a 3 word address validation field to a WooCommerce checkout form and save the 3 word address to the order.

By enabling WooCommerce checkout integration, #shipping_w3w and #billing_w3w will be added by default to the AutoSuggest Input Field settings.

== Frequently Asked Questions ==

For all frequently asked questions, and their answers, please visit our [support site](https://support.what3words.com/hc/en-us).

== Screenshots ==

1. A 3 word address field with custom placeholder text.

2. An example of autosuggest results optionally filtered by country.

3. A validated 3 word address.

4. Dashboard to configure 3 word address plugin settings.


== Changelog ==

= 1.0.1 =
* General fixes

= 1.0.0 =
* Initial release
