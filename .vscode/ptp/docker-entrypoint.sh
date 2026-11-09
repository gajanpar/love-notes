#!/usr/bin/env bash
set -e

echo "==> [SPKTAD Boot] Initializing SPKTAD Pelindo Cirebon container..."

# 1. Resolve dynamic listening port (default to 7860 for Hugging Face Spaces / cloud containers)
export PORT="${PORT:-7860}"

# 2. Ensure .env exists for Laravel initialization
if [ ! -f .env ]; then
    echo "==> [SPKTAD Boot] Creating .env from .env.example..."
    cp .env.example .env
fi

# Ensure APP_KEY is populated
if [ -n "$APP_KEY" ]; then
    if grep -q "^APP_KEY=" .env; then
        sed -i "s|^APP_KEY=.*|APP_KEY=${APP_KEY}|" .env
    else
        echo "APP_KEY=${APP_KEY}" >> .env
    fi
elif ! grep -q "^APP_KEY=base64:" .env && ! grep -q "^APP_KEY=.\{16,\}" .env; then
    echo "==> [SPKTAD Boot] Generating runtime APP_KEY..."
    php artisan key:generate --force --no-interaction
fi

# Ensure log channel outputs to stderr for container log aggregation
if grep -q "^LOG_CHANNEL=" .env; then
    sed -i "s|^LOG_CHANNEL=.*|LOG_CHANNEL=stderr|" .env
else
    echo "LOG_CHANNEL=stderr" >> .env
fi

# 3. Ensure SQLite database file and parent directory have proper permissions
if [ -z "$DB_CONNECTION" ] || [ "$DB_CONNECTION" = "sqlite" ]; then
    export DB_CONNECTION=sqlite
    DB_PATH="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
    DB_DIR="$(dirname "$DB_PATH")"
    
    mkdir -p "$DB_DIR"
    if [ ! -f "$DB_PATH" ]; then
        echo "==> [SPKTAD Boot] Creating fresh SQLite database file at $DB_PATH..."
        touch "$DB_PATH"
    fi
    
    chmod 666 "$DB_PATH" 2>/dev/null || true
    chmod 777 "$DB_DIR" 2>/dev/null || true
    chown -R www-data:www-data "$DB_DIR" 2>/dev/null || true
fi

# 4. Ensure storage and framework cache directories exist with writable permissions
mkdir -p \
    storage/framework/sessions \
    storage/framework/views \
    storage/framework/cache/data \
    storage/logs \
    bootstrap/cache

chmod -R 777 storage bootstrap/cache 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# 5. Clear stale caches to reflect active container environment variables
php artisan config:clear --no-interaction || true
php artisan cache:clear --no-interaction || true

# 6. Execute database schema migrations
echo "==> [SPKTAD Boot] Running database migrations..."
php artisan migrate --force --no-interaction

# 7. Seed official master data (idempotent updateOrCreate)
echo "==> [SPKTAD Boot] Seeding official Pelindo Cirebon master data..."
php artisan db:seed --class=ProductionSeeder --force --no-interaction

# 8. Optimize framework configuration, route, and view caches for low-latency serving
echo "==> [SPKTAD Boot] Optimizing caches for production..."
php artisan config:cache --no-interaction
php artisan route:cache --no-interaction
php artisan view:cache --no-interaction

# 9. If custom command arguments are passed, execute them
if [ $# -gt 0 ]; then
    exec "$@"
fi

# 10. Start production web server bound to 0.0.0.0:$PORT
echo "==> [SPKTAD Boot] Application ready! Starting web server on 0.0.0.0:${PORT}..."
if command -v frankenphp >/dev/null 2>&1; then
    exec frankenphp php-server --listen "0.0.0.0:${PORT}" --root /var/www/html/public
else
    export PHP_CLI_SERVER_WORKERS=4
    exec php -S "0.0.0.0:${PORT}" -t /var/www/html/public /var/www/html/vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php
fi
