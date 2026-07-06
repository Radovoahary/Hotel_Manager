<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ReservationController;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Client;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Page d'accueil / Redirection
Route::get('/', function () {
    return redirect()->route('dashboard');
});

// Toutes les routes protégées par l'authentification
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. DASHBOARD (Tableau de bord avec statistiques globales)
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'total_rooms' => Room::count(),
            'total_clients' => Client::count(),
            'total_reservations' => Reservation::count(),
            // Somme de toutes les réservations (sans filtre strict pour inclure tes anciens tests)
            'revenue' => Reservation::sum('total_price'), 
        ]);
    })->name('dashboard');

    // 2. GESTION DES CHAMBRES (CRUD Complet)
    Route::get('/rooms', [RoomController::class, 'index'])->name('rooms.index');
    Route::post('/rooms', [RoomController::class, 'store'])->name('rooms.store');
    Route::patch('/rooms/{room}', [RoomController::class, 'update'])->name('rooms.update');
    Route::delete('/rooms/{room}', [RoomController::class, 'destroy'])->name('rooms.destroy');

    // 3. GESTION DES CLIENTS (CRUD Complet)
    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
    Route::patch('/clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');

    // 4. GESTION DES RÉSERVATIONS (Affichage et Création)
    Route::get('/reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

    // 5. GESTION DU PROFIL UTILISATEUR (Généré par Laravel Breeze)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Inclusion des routes d'authentification (Login, Register, Logout...)
require __DIR__.'/auth.php';