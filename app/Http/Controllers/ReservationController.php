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
        return Inertia::render('Reservations/Index', [
            // On charge les réservations en incluant les données du client et de la chambre associée (Eager Loading)
            'reservations' => Reservation::with(['client', 'room'])->get(),
            'clients' => Client::all(),
            'rooms' => Room::where('status', 'available')->get(), // Uniquement les chambres libres
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
            'total_price' => 'required|numeric|min:0',
        ]);

        Reservation::created($validated);

        //Changer le statut de la chambre en occupied
        Room::where('id', $request->room_id)->update(['status' => 'occupied']);
        return redirect()->route('reservations.index');
    }
}
