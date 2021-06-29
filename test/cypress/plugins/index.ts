/// <reference type="cypress"
const knex = require('knex')
const Cypress = require('cypress')

// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const DB = knex({
    client: 'mysql',
    connection: {
      host: config.env.DB_HOST,
      user: config.env.DB_USER,
      password: config.env.DB_PASS,
      database: config.env.DB_DATABASE,
    },
    pool: { min: 1, max: 2 },
  })

  on('task', {
    'db:setup'() {
      return Promise.all([
        DB.table('wp_options')
          .where('option_name', 'w3w_autosuggest_settings')
          .update({
            option_value: 'a:23:{s:7:"version";s:5:"4.0.0";s:7:"api_key";s:0:"";s:8:"selector";s:0:"";s:19:"woocommerce_enabled";b:1;s:18:"return_coordinates";b:0;s:18:"save_nearest_place";b:0;s:12:"enable_label";b:0;s:5:"label";s:0:"";s:18:"enable_placeholder";b:0;s:11:"placeholder";s:0:"";s:22:"enable_clip_to_country";b:0;s:15:"clip_to_country";s:0:"";s:21:"enable_clip_to_circle";b:0;s:18:"clip_to_circle_lat";s:0:"";s:18:"clip_to_circle_lng";s:0:"";s:21:"clip_to_circle_radius";s:0:"";s:27:"enable_clip_to_bounding_box";b:0;s:27:"clip_to_bounding_box_sw_lat";s:0:"";s:27:"clip_to_bounding_box_sw_lng";s:0:"";s:27:"clip_to_bounding_box_ne_lat";s:0:"";s:27:"clip_to_bounding_box_ne_lng";s:0:"";s:22:"enable_clip_to_polygon";b:0;s:15:"clip_to_polygon";s:0:"";}'
          }),
        DB.table('wp_options')
          .where('option_name', 'active_plugins')
          .update({ option_value: 'a:1:{i:0;s:27:"woocommerce/woocommerce.php";}' }),
      ])
    }
  })
}
