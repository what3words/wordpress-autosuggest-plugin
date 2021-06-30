![what3words Address Field](assets/wordpress-header.jpg, "what3wordsAddress Field")
# what3words Autosuggest Plugin

The what3words Autosuggest helps you capture what3words addresses at checkout, using an address validation field. By giving a what3words address, your customers can accurately pinpoint their desired delivery destination.

### What is what3words?

what3words is a global addressing system that provides the simplest way to communicate location. It has divided the World into 3 metre squares and assigned each one a unique address made of just 3 words. It is more accurate than traditional street addressing and even allows location information to be captured for places without addresses, such as parks or beaches.

### How does this help your business?

It's quick and easy to implement the what3words Autosuggest Plugin. what3words addresses can be converted to GPS coordinates, which can then be passed onto delivery drivers With a what3words address, deliveries can then arrive precisely in the right place and on time, giving a more reliable delivery experience for your customers.

### And for your customers?

Your customers will have the option of providing the what3words address for their delivery location at the checkout. This gives them a way of providing delivery location without the need to add complicated delivery instructions, and helps give them peace of mind that their delivery will be made to the right place, helping them trust your business.

### How does it work?

This plugin allows you to easily add capturing and validating a what3words address to a form on your WordPress powered site. Powered by our [Autosuggest Component](https://developer.what3words.com/components), the what3words address field returns suggestions based on full or partial what3words addresses, helping users with the following types of input error:

* typing errors
* spelling errors
* misremembered words (e.g. singular vs plural) or words in the wrong order.

We recommend using the plugin when you want to capture a precise location from a user, such as a customer's front door or specific entrance of a larger building.


## Contents

* [Installation](docs/install.md)
* [Configuration](docs/configuration.md)
* [FAQ](docs/faq.md)

### More about what3words

what3words is available in 45+ languages, with pre-assigned, standardised 3 word addresses that are much easier to remember than lat/lng coordinates.

Find our full [developer documentation](https://developer.what3words.com).

Learn more about our [Privacy Policy](https://what3words.com/privacy) or [Terms & Conditions](https://what3words.com/terms).


### Credit

This project was extended from the [WordPress Plugin Boilerplate](docs/boilerplate.md) and its source can be found [here](https://github.com/DevinVinson/WordPress-Plugin-Boilerplate).


## Contributing to the project

### Publishing changes

In order to contribute to this project you should follow the guide to modifying code and submitting your code.

1. Make the relevant modifications to the code

2. Before committing to remote you should ensure you pre-emptively bump the version in both `w3w-autosuggest/README.txt` and most importantly the doc comment headers `w3w-autosuggest/w3w-autosuggest.php`.

3. Commit your changes to a suitably named branch and open a PR with the relevant details of your changes included. If you are working from a JIRA ticket you should try to include the name of the JIRA ticket in your commit in square braces, e.g. _"[TT-1234] My PR which resolves issues X"_

__TODO__

4. Once your PR has been reviewed and merged the CI pipeline should automatically deploy your changes to the WordPress plugin version control repository (SVN).


### Testing changes

You can run the Cypress tests with the following.

```
docker pull 449290502274.dkr.ecr.eu-west-2.amazonaws.com/wordpress-testing-site:<VERSION>
docker compose up -d
cd test
npm i
npx cypress open|run
```
