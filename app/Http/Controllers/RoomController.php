<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Afficher la liste des chambres.
     */
    public function index()
    {
        return Inertia::render('Rooms/Index', [
            'rooms' => Room::latest()->get()
        ]);
    }

    /**
     * Enregistrer une nouvelle chambre.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:255|unique:rooms,room_number',
            'type' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        Room::create($validated);

        return redirect()->route('rooms.index');
    }

    /**
     * Mettre à jour une chambre existante.
     */
    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|max:255|unique:rooms,room_number,' . $room->id,
            'type' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        $room->update($validated);

        return redirect()->route('rooms.index');
    }

    /**
     * Supprimer une chambre.
     */
    public function destroy(Room $room)
    {
        $room->delete();

        return redirect()->route('rooms.index');
    }
}