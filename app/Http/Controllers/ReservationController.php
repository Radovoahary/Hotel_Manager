<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Client;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function index()
    {
        // C'est cette ligne qui charge les données nécessaires pour le tableau !
        return Inertia::render('Reservations/Index', [
            'reservations' => Reservation::with(['client', 'room'])->latest()->get(),
            'clients' => Client::all(),
            'rooms' => Room::where('status', 'available')->get(), // Uniquement les chambres dispos pour une nouvelle résa
        ]);
    }

   public function store(Request $request)
{
    // 1. On valide les données reçues de React (qui utilise start_date et end_date)
    $validated = $request->validate([
        'client_id' => 'required|exists:clients,id',
        'room_id' => 'required|exists:rooms,id',
        'start_date' => 'required|date',
        'end_date' => 'required|date|after:start_date',
        'total_price' => 'required|numeric|min:0',
        'status' => 'required|in:pending,confirmed,cancelled',
    ]);

    // 2. On crée la réservation en associant start_date -> check_in_date et end_date -> check_out_date
    Reservation::create([
        'client_id' => $validated['client_id'],
        'room_id' => $validated['room_id'],
        'check_in_date' => $validated['start_date'],  // Mappe vers ta colonne SQL
        'check_out_date' => $validated['end_date'],    // Mappe vers ta colonne SQL
        'total_price' => $validated['total_price'],
        'status' => $validated['status'],
    ]);

    // 3. Changement automatique du statut de la chambre à 'occupied'
    $room = Room::find($request->room_id);
    $room->update(['status' => 'occupied']);

    return redirect()->route('reservations.index');
}
}