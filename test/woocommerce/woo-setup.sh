#!/bin/bash

wp() {
  command wp --allow-root "$@"
}

echo -e "🚀 Starting Wordpress setup...\n\n"

rm -f wp-config.php
wp core config \
  --dbhost="${WORDPRESS_DB_HOST:-localhost:3306}" \
  --dbname="${WORDPRESS_DB_NAME:-wordpress}" \
  --dbuser="${WORDPRESS_DB_USER:-wordpress}" \
  --dbpass="${WORDPRESS_DB_PASSWORD:-wordpress}" \
  --locale="${WORDPRESS_LOCALE:-en-GB}" \
  --skip-check \
  --path="/var/www/html"

echo "⚙️ Configuring Wordpress parameters..."
wp core install \
  --url="${WORDPRESS_WEBSITE_URL_WITHOUT_HTTP:-localhost}" \
  --title="${WORDPRESS_WEBSITE_TITLE:-what3words}" \
  --admin_user="${WORDPRESS_ADMIN_USER:-what3words}" \
  --admin_password="${WORDPRESS_ADMIN_PASSWORD:-what3words}" \
  --admin_email="${WORDPRESS_ADMIN_EMAIL:-developer@what3words.com}" \
  --path="/var/www/html"

wp option update siteurl "${WORDPRESS_WEBSITE_URL:-http://localhost}"
wp rewrite structure "${WORDPRESS_WEBSITE_POST_URL_STRUCTURE:-/%year%/%monthnum%/%day%/%postname%/}"
echo "🎉 Wordpress configured successfully!"

if wp plugin is-active woocommerce; then
  echo "🕺 WooCommerce is already installed and activated."
else
  echo "⚠️ WooCommerce is not installed or activated. Proceeding with installation and activation."

  wp option set blog_public 0

  echo "⚙️ Activating WooCommerce plugin..."
  wp plugin activate woocommerce

  echo "💅 Installing and activating ${WORDPRESS_THEME:-twentytwentyone} theme..."
  wp theme install "${WORDPRESS_THEME:-twentytwentyone}" --activate

  echo "🚚 Importing sample products..."
  wp plugin install wordpress-importer --activate
  wp import ./wp-content/plugins/woocommerce/sample-data/sample_products.xml --authors=create

  wp wc tool run install_pages --user="${WORDPRESS_ADMIN_USER:-what3words}"

  echo "⚙️ Configuring WooCommerce options..."
  wp option update woocommerce_store_address "65 Alfred Road"
  wp option update woocommerce_store_address_2 "Great Western Studios"
  wp option update woocommerce_store_city "London"
  wp option update woocommerce_store_postcode "W2 5EU"
  wp option update woocommerce_default_country "GB"
  wp option update woocommerce_currency "GBP"

  wp option update woocommerce_enable_guest_checkout "yes"
  wp option update woocommerce_calc_taxes "no"
  wp option update woocommerce_prices_include_tax "yes"
  wp option update woocommerce_enable_shipping_calc "yes"


  wp wc payment_gateway update cod --enabled=1 --user="${WORDPRESS_ADMIN_USER:-what3words}"

  ZONE_ID=$(wp wc shipping_zone create --name="Global" --user="${WORDPRESS_ADMIN_USER:-what3words}" --porcelain)

  wp wc shipping_zone_method create $ZONE_ID --method_id="free_shipping" --user="${WORDPRESS_ADMIN_USER:-what3words}"
  wp wc shipping_zone_method create $ZONE_ID --method_id="flat_rate" --user="${WORDPRESS_ADMIN_USER:-what3words}"
  wp wc shipping_zone_method create $ZONE_ID --method_id="local_pickup" --user="${WORDPRESS_ADMIN_USER:-what3words}"

  echo "🕺 WooCommerce configuration complete!"
fi

