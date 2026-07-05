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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|unique:clients,email',
            'phone' => 'nullable|string|max:20',
        ]);
        Client::create($validated);

        return redirect()->route('clients.index');
    }
}
