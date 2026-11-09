# syntax=docker/dockerfile:1
FROM dunglas/frankenphp:1-php8.4-alpine

LABEL maintainer="PT Pelindo Multi Terminal Branch Cirebon" \
      description="SPKTAD Tenaga Alih Daya Evaluation System"

# 1. Install required system packages and PHP extensions
RUN apk add --no-cache \
    sqlite-dev \
    libzip-dev \
    icu-dev \
    bash \
    curl \
    && docker-php-ext-install -j$(nproc) \
    pdo_sqlite \
    bcmath \
    intl \
    opcache \
    zip

# 2. Configure production PHP ini optimizations
RUN cp "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    sed -i 's/memory_limit = .*/memory_limit = 256M/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/upload_max_filesize = .*/upload_max_filesize = 32M/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/post_max_size = .*/post_max_size = 32M/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/;opcache.enable=.*/opcache.enable=1/' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/;opcache.memory_consumption=.*/opcache.memory_consumption=64/' "$PHP_INI_DIR/php.ini"

WORKDIR /var/www/html

# 3. Install Composer binary from official Composer image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 4. Install PHP vendor dependencies in an isolated cached layer
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# 5. Copy application source codebase
COPY . /var/www/html

# 6. Generate optimized production classmap autoloader
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative

# 7. Setup runtime writable directories with proper permissions
RUN mkdir -p \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache/data \
    storage/logs \
    bootstrap/cache \
    database \
    && chown -R www-data:www-data storage bootstrap/cache database \
    && chmod -R 775 storage bootstrap/cache database

# 8. Copy and configure entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# 9. Set default container environment variables
ENV APP_ENV="production" \
    APP_DEBUG="false" \
    LOG_CHANNEL="stderr" \
    PORT="10000"

EXPOSE 10000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
