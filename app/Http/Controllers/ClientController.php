<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Inertia::render('Client/Index', [
            'clients' => Client::all()
        ]);
    }
}
