import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import knex from 'knex';
import cucumber from 'cypress-cucumber-preprocessor';
import { createRequire } from 'module';

// Create a require function within an ESM context
const require = createRequire(import.meta.url);

// dotenv.config();

const config = {
  e2e: {
    baseUrl: 'http://localhost:80',
    setupNodeEvents(on, config) {
      const DB = knex({
        client: 'mysql',
        connection: {
          host: config.env.DB_HOST,
          port: config.env.DB_PORT,
          user: config.env.DB_USER,
          password: config.env.DB_PASS,
          database: config.env.DB_DATABASE,
        },
        pool: { min: 1, max: 2 },
      });

      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        'db:setup'() {
          return Promise.all([
            DB.table('wp_options')
              .where('option_name', 'w3w_autosuggest_settings')
              .update({
                option_value:
                  'a:23:{s:7:"version";s:6:"4.0.15";s:7:"api_key";s:0:"";s:8:"selector";s:0:"";s:19:"woocommerce_enabled";b:1;s:18:"return_coordinates";b:0;s:18:"save_nearest_place";b:0;s:12:"enable_label";b:0;s:5:"label";s:0:"";s:18:"enable_placeholder";b:0;s:11:"placeholder";s:0:"";s:22:"enable_clip_to_country";b:0;s:15:"clip_to_country";s:0:"";s:21:"enable_clip_to_circle";b:0;s:18:"clip_to_circle_lat";s:0:"";s:18:"clip_to_circle_lng";s:0:"";s:21:"clip_to_circle_radius";s:0:"";s:27:"enable_clip_to_bounding_box";b:0;s:27:"clip_to_bounding_box_sw_lat";s:0:"";s:27:"clip_to_bounding_box_sw_lng";s:0:"";s:27:"clip_to_bounding_box_ne_lat";s:0:"";s:27:"clip_to_bounding_box_ne_lng";s:0:"";s:22:"enable_clip_to_polygon";b:0;s:15:"clip_to_polygon";s:0:"";}',
              }),
            DB.table('wp_options')
              .where('option_name', 'active_plugins')
              .update({
                option_value: 'a:1:{i:0;s:27:"woocommerce/woocommerce.php";}',
              }),
            DB.table('wp_woocommerce_sessions').delete(),
          ]);
        },
      });
      on(
        'file:preprocessor',
        cucumber.default({
          typescript: require.resolve('typescript'),
        })
      );
      return config;
    },
    specPattern: 'cypress/integration/**/*.{spec,feature}.{js,jsx,ts,tsx}',
    screenshotsFolder: 'cypress/screenshots/e2e',
    videosFolder: 'cypress/videos/e2e',
    video: false,
    env: {
      ADMIN_USERNAME: 'what3words',
      ADMIN_PASSWORD: 'what3words',
      API_KEY: process.env.API_KEY,
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
      DB_PASS: 'wordpress',
      DB_DATABASE: 'wordpress',
    },
  },
};

export default defineConfig({
  chromeWebSecurity: false,
  projectId: 'rxtpk4',
  reporter: 'junit',
  ...config,
});
