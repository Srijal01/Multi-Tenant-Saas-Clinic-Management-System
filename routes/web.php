<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuperAdminController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    //Clinics CRUD
    Route::get('clinics', [SuperAdminController::class, 'indexClinics'])->name('clinics.index');
    Route::get('clinics/create', [SuperAdminController::class, 'createClinic'])->name('clinics.create');
    Route::post('clinics', [SuperAdminController::class, 'storeClinic'])->name('clinics.store');
    Route::get('clinics/{clinic}/edit', [SuperAdminController::class, 'editClinic'])->name('clinics.edit');
    Route::put('clinics/{clinic}', [SuperAdminController::class, 'updateClinic'])->name('clinics.update');

    //Users Management
    Route::get('users', [SuperAdminController::class, 'indexUsers'])->name('users.index');
    Route::patch('users/{user}/toggle', [SuperAdminController::class, 'toggleUserStatus'])->name('users.toggle');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
