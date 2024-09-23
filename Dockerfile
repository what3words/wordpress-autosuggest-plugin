FROM alpine:3.19.0 AS build-dependencies

WORKDIR /dependencies

ARG WOOCOMMERCE_VERSION=5.4.1

RUN apk add wget unzip
RUN wget https://downloads.wordpress.org/plugin/woocommerce.${WOOCOMMERCE_VERSION}.zip -O woocommerce.zip
RUN unzip woocommerce.zip

FROM wordpress:5.9.0-php7.4-apache

ENV WORDPRESS_DB_NAME=wordpress
ENV WORDPRESS_DB_USER=root
ENV WORDPRESS_DB_PASSWORD=wordpress
ENV WORDPRESS_DB_HOST=mysql:3306
ENV WORDPRESS_DEBUG=1

RUN sed -i "11i php_value upload_max_filesize 256M" /usr/src/wordpress/.htaccess && \
    sed -i "12i php_value post_max_size 256M" /usr/src/wordpress/.htaccess

WORKDIR /usr/src/wordpress

COPY --from=build-dependencies \
    /dependencies/woocommerce ./wp-content/plugins/woocommerce

WORKDIR /var/www/html
