import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

// Définition des types pour TypeScript
interface Client {
    id: number;
    first_name: string;
    last_name: string;
}

interface Room {
    id: number;
    room_number: string;
    type: string;
    price_per_night: number;
    status: string;
}

interface Reservation {
    id: number;
    client_id: number;
    room_id: number;
    start_date: string;
    end_date: string;
    total_price: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    client?: Client;
    room?: Room;
}

interface Props {
    reservations: Reservation[];
    clients: Client[];
    rooms: Room[];
}

export default function Index({ reservations, clients, rooms }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    // Formulaire Inertia.js
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: '',
        room_id: '',
        start_date: '',
        end_date: '',
        total_price: 0,
        status: 'confirmed',
    });

    // Calcul automatique du prix total estimé quand les dates ou la chambre changent
    React.useEffect(() => {
        if (data.start_date && data.end_date && data.room_id) {
            const selectedRoom = rooms.find(r => r.id === parseInt(data.room_id));
            if (selectedRoom) {
                const start = new Date(data.start_date);
                const end = new Date(data.end_date);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                if (diffDays > 0) {
                    setData('total_price', diffDays * selectedRoom.price_per_night);
                }
            }
        }
    }, [data.start_date, data.end_date, data.room_id, rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Gestion des Réservations</h2>}
        >
            <Head title="Réservations" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON NOUVELLE RÉSERVATION */}
                <div className="flex justify-between items-center bg-white p-6 shadow sm:rounded-lg">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Historique des Réservations</h3>
                        <p className="text-sm text-gray-500">Consultez et planifiez les séjours de vos clients.</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition"
                    >
                        Nouvelle Réservation
                    </button>
                </div>

                {/* TABLEAU DE LA LISTE DES RÉSERVATIONS */}
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arrivée</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Départ</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix Total</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Aucune réservation trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {reservation.client ? `${reservation.client.first_name} ${reservation.client.last_name}` : <span className="text-red-400 italic">Client supprimé</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {reservation.room ? `N°${reservation.room.room_number} (${reservation.room.type})` : <span className="text-red-400 italic">Chambre supprimée</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(reservation.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(reservation.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {Number(reservation.total_price).toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                                                    reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {reservation.status === 'confirmed' ? 'Confirmée' : reservation.status === 'pending' ? 'En attente' : 'Annulée'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL / POPUP DE CRÉATION DE RÉSERVATION */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">Créer une nouvelle réservation</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Choix du Client */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Client</label>
                                    <select
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
                                    >
                                        <option value="">Sélectionner un client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.first_name} {client.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && <p className="text-red-500 text-xs mt-1">{errors.client_id}</p>}
                                </div>

                                {/* Choix de la Chambre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chambre</label>
                                    <select
                                        value={data.room_id}
                                        onChange={e => setData('room_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
                                    >
                                        <option value="">Sélectionner une chambre disponible</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                N°{room.room_number} - {room.type} ({room.price_per_night}€/nuit)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.room_id && <p className="text-red-500 text-xs mt-1">{errors.room_id}</p>}
                                </div>

                                {/* Date d'arrivée */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date d'arrivée</label>
                                    <input
                                        type="date"
                                        value={data.start_date}
                                        onChange={e => setData('start_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
                                    />
                                    {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
                                </div>

                                {/* Date de départ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de départ</label>
                                    <input
                                        type="date"
                                        value={data.end_date}
                                        onChange={e => setData('end_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500"
                                    />
                                    {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
                                </div>

                                {/* Affichage automatique du prix estimé */}
                                <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                    <span className="text-sm font-medium text-gray-500">Prix Total Calculé : </span>
                                    <span className="text-lg font-bold text-indigo-600">{data.total_price.toFixed(2)} €</span>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-gray-250 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-50"
                                    >
                                        {processing ? 'Enregistrement...' : 'Confirmer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}