FROM php:8.5-fpm-alpine
RUN apk add --no-cache nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-docker.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY . /var/www/html
RUN chown -R www-data:www-data /var/www/html
EXPOSE 8080
CMD ["/entrypoint.sh"]
