<?php

namespace App\Http\Controllers;

use App\Http\Controllers;
use App\Models\Room;
use Inertia\Inertia;

class RoomController extends Controller {
    public function index()
    {
        //Récupération de toutes les chambres de la base de données
        $room = Room::all();
        
    }
}
