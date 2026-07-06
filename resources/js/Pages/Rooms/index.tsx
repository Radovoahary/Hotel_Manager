import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React from 'react';

interface Room {
    id: number;
    room_number: string;
    type: string;
    price_per_night: number;
    status: 'available' | 'occupied' | 'maintenance';
}

interface Props {
    rooms: Room[];
}

export default function Index({ rooms }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        room_number: '',
        type: '',
        price_per_night: '',
        status: 'available',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('rooms.store'), {
            onSuccess: () => reset(),
        });
    };

    // Fonction magique pour mettre à jour le statut instantanément au clic/changement
    const handleStatusChange = (roomId: number, newStatus: string) => {
        router.patch(route('rooms.update', roomId), {
            status: newStatus
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Gestion des Chambres</h2>}
        >
            <Head title="Chambres" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* FORMULAIRE D'AJOUT */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Ajouter une nouvelle chambre</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Numéro</label>
                            <input type="text" value={data.room_number} onChange={e => setData('room_number', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500" placeholder="Ex: 102"/>
                            {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Type</label>
                            <input type="text" value={data.type} onChange={e => setData('type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500" placeholder="Ex: Double Deluxe"/>
                            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Prix par nuit (€)</label>
                            <input type="number" step="0.01" value={data.price_per_night} onChange={e => setData('price_per_night', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500" placeholder="85.00"/>
                            {errors.price_per_night && <p className="text-red-500 text-xs mt-1">{errors.price_per_night}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Statut initial</label>
                            <select value={data.status} onChange={e => setData('status', e.target.value as any)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500">
                                <option value="available">Disponible</option>
                                <option value="occupied">Occupée</option>
                                <option value="maintenance">En maintenance</option>
                            </select>
                        </div>
                        <button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow-sm transition">
                            {processing ? 'Ajout...' : 'Ajouter'}
                        </button>
                    </form>
                </div>

                {/* LISTE DES CHAMBRES AVEC MODIFICATION DE STATUT */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">Liste des chambres de l'hôtel</h3>
                    
                    {rooms.length === 0 ? (
                        <p className="text-gray-500">Aucune chambre enregistrée.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {rooms.map((room) => (
                                <div key={room.id} className="border border-gray-200 rounded-lg p-5 shadow-sm bg-gray-50 flex flex-col justify-between">
                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900">Chambre N°{room.room_number}</h4>
                                        <p className="text-sm text-gray-500 mt-1">Type : {room.type}</p>
                                        <p className="text-base font-semibold text-green-600 mt-2">{Number(room.price_per_night).toFixed(2)} € / nuit</p>
                                    </div>
                                    
                                    {/* Sélecteur de modification rapide du statut */}
                                    <div className="mt-4">
                                        <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Modifier le statut :</label>
                                        <select
                                            value={room.status}
                                            onChange={(e) => handleStatusChange(room.id, e.target.value)}
                                            className={`block w-full text-xs font-semibold rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 ${
                                                room.status === 'available' ? 'bg-green-50 text-green-800 border-green-300' :
                                                room.status === 'occupied' ? 'bg-red-50 text-red-800 border-red-300' : 
                                                'bg-yellow-50 text-yellow-800 border-yellow-300'
                                            }`}
                                        >
                                            <option value="available">Disponible (available)</option>
                                            <option value="occupied">Occupée (occupied)</option>
                                            <option value="maintenance">En maintenance (maintenance)</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}