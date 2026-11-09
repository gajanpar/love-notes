<?php

declare(strict_types=1);

// Vercel Serverless Writable Environment Initialization
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

// Copy pre-seeded production SQLite database into writable /tmp
$sourceDb = __DIR__ . '/../database/database.sqlite';
if (!file_exists($sourceDb) || filesize($sourceDb) === 0) {
    $sourceDb = __DIR__ . '/../.vscode/ptp/database/database.sqlite';
}
$targetDb = '/tmp/database.sqlite';

if (!file_exists($targetDb) || filesize($targetDb) === 0) {
    if (file_exists($sourceDb) && filesize($sourceDb) > 0) {
        @copy($sourceDb, $targetDb);
    } else {
        @touch($targetDb);
    }
    @chmod($targetDb, 0666);
}

// Set environment variables for serverless execution
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

// Delegate execution to Laravel public index
if (file_exists(__DIR__ . '/../public/index.php')) {
    require __DIR__ . '/../public/index.php';
} elseif (file_exists(__DIR__ . '/../.vscode/ptp/public/index.php')) {
    require __DIR__ . '/../.vscode/ptp/public/index.php';
}
