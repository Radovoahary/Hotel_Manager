import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

// Typage TypeScript pour la structure d'un client
interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
}

// Typage des propriétés (Props) reçues depuis le contrôleur Laravel
interface Props {
    clients: Client[];
}

export default function Index({ clients }: Props) {
    // Gestionnaire de formulaire fourni par Inertia
    // Gère le state local, la soumission, les erreurs et le chargement
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    // Envoi des données du formulaire vers la route de stockage
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clients.store'), {
            onSuccess: () => reset(), // Vide le formulaire si la sauvegarde réussit
        });
    };

    return (
        // Layout de base pour les utilisateurs connectés
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Gestion des Clients</h2>}
        >
            {/* Balise dynamique pour changer le titre de l'onglet du navigateur */}
            <Head title="Clients" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* --- BLOC FORMULAIRE D'AJOUT --- */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Enregistrer un nouveau client</h3>
                    
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        {/* Prénom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prénom</label>
                            <input type="text" value={data.first_name} onChange={e => setData('first_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                        </div>
                        
                        {/* Nom */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nom</label>
                            <input type="text" value={data.last_name} onChange={e => setData('last_name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                        </div>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        
                        {/* Téléphone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                            <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                        </div>
                        
                        {/* Bouton de soumission (désactivé pendant l'envoi pour éviter les doublons) */}
                        <button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm transition">
                            {processing ? 'Enregistrement...' : 'Ajouter'}
                        </button>
                    </form>
                </div>

                {/* --- BLOC LISTE DES CLIENTS --- */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Liste des clients</h3>
                    
                    {/* Rendu conditionnel : message si vide, sinon affichage du tableau */}
                    {clients.length === 0 ? (
                        <p className="text-gray-500">Aucun client enregistré.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom Complet</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {/* Boucle sur le tableau des clients */}
                                    {clients.map((client) => (
                                        <tr key={client.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.first_name} {client.last_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.phone || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}