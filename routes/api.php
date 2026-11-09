<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\DashboardApiController;
use App\Http\Controllers\Api\V1\EvaluationApiController;
use App\Http\Controllers\Api\V1\PeriodApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| SPKTAD REST API Routes (Version 1.0) - PT Pelindo Multi Terminal Cirebon
|--------------------------------------------------------------------------
|
| Base Path: /api/v1/...
| Authentication: Laravel Sanctum Bearer Token
| Standards: RFC 7807 problem details, standardized envelope, ISO 8601 timestamps
|
*/

Route::prefix('v1')->group(function () {

    // Public Authentication Endpoint with Brute Force Protection (max 6 attempts per minute)
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

    // Protected Enterprise Endpoints (Sanctum Authenticated)
    Route::middleware(['auth:sanctum'])->group(function () {

        // Session & Identity
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        // SLA Gembok & Periode
        Route::get('/periods/current/sla-status', [PeriodApiController::class, 'slaStatus']);

        // Dashboard Interaktif (6 Pilar AKHLAK, MoM Trend, Top/Bottom Performers, PDS Recommendation)
        Route::get('/dashboard/metrics', [DashboardApiController::class, 'metrics']);

        // Scoring & Penilaian Lapangan
        Route::get('/evaluations/rubrik', [EvaluationApiController::class, 'rubrik']);
        Route::get('/evaluations/unassessed', [EvaluationApiController::class, 'unassessed']);
        Route::post('/evaluations/submit', [EvaluationApiController::class, 'submit']);
        Route::post('/evaluations/batch-submit', [EvaluationApiController::class, 'batchSubmit']);

    });

});
