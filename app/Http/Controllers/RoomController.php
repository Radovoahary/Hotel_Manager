<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoomController extends Controller 
{
    public function index()
    {
        // Récupération de toutes les chambres de la base de données
        $rooms = Room::all();
        
        // On les envoie au composant React "Rooms/Index"
        return Inertia::render('Rooms/Index', [
            'rooms' => $rooms
        ]);
    }
}