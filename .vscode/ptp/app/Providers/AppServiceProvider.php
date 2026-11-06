<?php

namespace App\Providers;

use App\Models\Setting;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Set custom corporate Pelindo pagination view (anti-giant SVG icon)
        Paginator::defaultView('vendor.pagination.corporate');
        Paginator::defaultSimpleView('vendor.pagination.corporate');

        view()->composer('*', function ($view) {
            $view->with('branchSettings', Setting::getAllKeyValue());
        });
    }
}
