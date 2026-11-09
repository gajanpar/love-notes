<?php

declare(strict_types=1);

// 1. Vercel Serverless Writable Environment Initialization
$tmpDirs = [
    '/tmp/views',
    '/tmp/sessions',
    '/tmp/cache',
    '/tmp/logs',
];

foreach ($tmpDirs as $dir) {
    if (!is_dir($dir)) {
        @mkdir($dir, 0777, true);
    }
}

// 2. Prepare writable SQLite database
$sourceDb = __DIR__ . '/../database/database.sqlite';
$targetDb = '/tmp/database.sqlite';
$needsSeed = false;

if (!file_exists($targetDb) || filesize($targetDb) === 0) {
    if (file_exists($sourceDb) && filesize($sourceDb) > 0) {
        @copy($sourceDb, $targetDb);
    } else {
        @touch($targetDb);
        $needsSeed = true;
    }
    @chmod($targetDb, 0666);
}

// 3. Set environment variables for serverless execution
putenv('DB_CONNECTION=sqlite');
putenv('DB_DATABASE=' . $targetDb);
putenv('VIEW_COMPILED_PATH=/tmp/views');
putenv('SESSION_DRIVER=cookie');
putenv('CACHE_STORE=array');
putenv('LOG_CHANNEL=stderr');
putenv('APP_CONFIG_CACHE=/tmp/config.php');
putenv('APP_ROUTES_CACHE=/tmp/routes.php');
putenv('APP_SERVICES_CACHE=/tmp/services.php');
putenv('APP_PACKAGES_CACHE=/tmp/packages.php');

// 4. In-process self-healing migration and seeder fallback if database is fresh
if ($needsSeed) {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->call('migrate', ['--force' => true]);
    $kernel->call('db:seed', ['--class' => 'Database\\Seeders\\ProductionSeeder', '--force' => true]);
    $app->handleRequest(Illuminate\Http\Request::capture());
    return;
}

// 5. Delegate execution to Laravel public index
require __DIR__ . '/../public/index.php';
