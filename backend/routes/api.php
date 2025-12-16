<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\JobController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Version 1 Group
Route::prefix('v1')->group(function () {

    // POST /api/v1/jobs -> Create a new scraping job
    Route::post('/jobs', [JobController::class, 'store']);

    // GET /api/v1/jobs/{id} -> Check job status & get results
    Route::get('/jobs/{id}', [JobController::class, 'show']);

});