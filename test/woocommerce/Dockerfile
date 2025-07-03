ARG PHP_VERSION=7.4

FROM php:${PHP_VERSION}-cli-alpine AS setup-woocommerce

RUN apk add --no-cache less wget \
  && wget https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar -O /usr/local/bin/wp \
  && chmod +x /usr/local/bin/wp

RUN docker-php-ext-install mysqli

COPY test/woocommerce/woo-setup.sh /usr/src/woo-setup.sh
RUN chmod +x /usr/src/woo-setup.sh

WORKDIR /var/www/html

CMD ["sh", "-C", "/usr/src/woo-setup.sh"]
