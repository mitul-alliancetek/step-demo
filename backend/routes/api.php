<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {});

Route::apiResource('documents', DocumentController::class);
Route::post('/documents/{id}', [DocumentController::class, 'update']);

Route::get("/dashboard", [DashboardController::class, 'index']);
