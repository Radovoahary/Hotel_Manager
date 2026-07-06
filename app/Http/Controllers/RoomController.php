<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index()
    {
        return Inertia::render('Rooms/Index', [
            'rooms' => Room::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:rooms,room_number|max:10',
            'type' => 'required|string|max:255',
            'price_per_night' => 'required|numeric|min:0',
            'status' => 'required|in:available,occupied,maintenance',
        ]);

        Room::create($validated);

        return redirect()->route('rooms.index');
    }

    public function update(Request $request, Room $room)
{
    $validated = $request->validate([
        'status' => 'required|in:available,occupied,maintenance',
    ]);

    $room->update($validated);

    return redirect()->route('rooms.index');
}

}