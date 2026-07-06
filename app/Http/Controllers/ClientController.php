<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    /**
     * Afficher la liste des clients.
     */
    public function index()
    {
        return Inertia::render('Clients/Index', [
            'clients' => Client::latest()->get()
        ]);
    }

    /**
     * Enregistrer un nouveau client.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email',
            'phone' => 'nullable|string|max:255',
        ]);

        Client::create($validated);

        return redirect()->route('clients.index');
    }

    /**
     * Mettre à jour les informations d'un client.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index');
    }

    /**
     * Supprimer un client.
     */
    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('clients.index');
    }
}