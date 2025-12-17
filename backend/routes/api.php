<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController; // Ensure correct import if you move it, currently it is in App\Http\Controllers
use App\Http\Controllers\AuthController as AuthCtrl; // Alias to avoid confusion if needed
use App\Http\Controllers\Api\V1\JobController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Auth Routes
Route::post('/register', [AuthCtrl::class, 'register']);
Route::post('/login', [AuthCtrl::class, 'login']);
Route::post('/logout', [AuthCtrl::class, 'logout']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Version 1 Group
    Route::prefix('v1')->group(function () {
        // Create a new scraping job
        Route::post('/jobs', [JobController::class, 'store']);

        // List jobs (new endpoint needed in Controller for dashboard history)
        Route::get('/jobs', [JobController::class, 'index']); // Assuming index method exists or will be added

        // Get specific job status
        Route::get('/jobs/{id}', [JobController::class, 'show']);
    });
});