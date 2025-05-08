ARG WORDPRESS_VERSION=5.9.0
ARG PHP_VERSION=7.4

FROM alpine:3.19.0 AS build-dependencies

WORKDIR /dependencies

ARG WOOCOMMERCE_VERSION=5.4.1

RUN apk add --no-cache wget unzip \
    && wget https://downloads.wordpress.org/plugin/woocommerce.${WOOCOMMERCE_VERSION}.zip -O woocommerce.zip \
    && unzip woocommerce.zip

FROM wordpress:${WORDPRESS_VERSION}-php${PHP_VERSION}-apache AS development

ENV WORDPRESS_DB_NAME=wordpress
ENV WORDPRESS_DB_USER=root
ENV WORDPRESS_DB_PASSWORD=wordpress
ENV WORDPRESS_DB_HOST=mysql:3306
ENV WORDPRESS_DEBUG=1

RUN apt update && apt install -y less

RUN groupadd -g 1000 wp_user && \
    useradd -m -u 1000 -g wp_user wp_user

# Set proper permissions for WordPress directories
RUN chown -R wp_user:wp_user /var/www/html && \
    chown -R wp_user:wp_user /usr/src/wordpress

RUN sed -i "11i php_value upload_max_filesize 256M" /usr/src/wordpress/.htaccess && \
    sed -i "12i php_value post_max_size 256M" /usr/src/wordpress/.htaccess

WORKDIR /usr/src/wordpress

COPY --from=build-dependencies \
    /dependencies/woocommerce ./wp-content/plugins/woocommerce

USER wp_user

WORKDIR /var/www/html
