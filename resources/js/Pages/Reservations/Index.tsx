import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// Définition des types TypeScript adaptés à tes tables
interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface Room {
    id: number;
    room_number: string;
    type: string;
    price_per_night: number;
}

interface Reservation {
    id: number;
    client: Client;
    room: Room;
    check_in_date: string;
    check_out_date: string;
    total_price: number;
    status: string;
}

interface Props {
    reservations: Reservation[];
    clients: Client[];
    rooms: Room[];
}

export default function Index({ reservations, clients, rooms }: Props) {
    const [showModal, setShowModal] = useState(false);

    // Initialisation du formulaire Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: '',
        room_id: '',
        check_in_date: '',
        check_out_date: '',
        total_price: 0,
    });

    // Calcul automatique du prix total
    useEffect(() => {
        if (data.room_id && data.check_in_date && data.check_out_date) {
            const selectedRoom = rooms.find(r => r.id === parseInt(data.room_id));
            const start = new Date(data.check_in_date);
            const end = new Date(data.check_out_date);

            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (selectedRoom && diffDays > 0 && end > start) {
                setData('total_price', diffDays * selectedRoom.price_per_night);
            } else {
                setData('total_price', 0);
            }
        }
    }, [data.room_id, data.check_in_date, data.check_out_date, rooms]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Gestion des Réservations
                    </h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition duration-150"
                    >
                        Nouvelle Réservation
                    </button>
                </div>
            }
        >
            <Head title="Réservations" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Tableau des réservations */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chambre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrivée</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Départ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Aucune réservation trouvée.
                                                </td>
                                            </tr>
                                        ) : (
                                            reservations.map((reservation) => (
                                                <tr key={reservation.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {reservation.client ? `${reservation.client.first_name} ${reservation.client.last_name}` : 'Client supprimé'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {reservation.room ? `Chambre N°${reservation.room.room_number} (${reservation.room.type})` : 'Chambre supprimée'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(reservation.check_in_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(reservation.check_out_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                        {reservation.total_price} €
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {reservation.status === 'confirmed' ? 'Confirmée' : reservation.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de création de réservation */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full max-w-md mx-auto my-6 z-50">
                        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none p-6">
                            
                            <h3 className="text-lg font-semibold mb-4 text-gray-900">
                                Créer une nouvelle réservation
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Sélection du Client */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Client</label>
                                    <select
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Sélectionner un client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>
                                                {client.first_name} {client.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && <span className="text-red-500 text-xs">{errors.client_id}</span>}
                                </div>

                                {/* Sélection de la Chambre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Chambre disponible</label>
                                    <select
                                        value={data.room_id}
                                        onChange={e => setData('room_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Sélectionner une chambre</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id}>
                                                N°{room.room_number} - {room.type} ({room.price_per_night}€/nuit)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.room_id && <span className="text-red-500 text-xs">{errors.room_id}</span>}
                                </div>

                                {/* Date d'arrivée */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date d'arrivée</label>
                                    <input
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={e => setData('check_in_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.check_in_date && <span className="text-red-500 text-xs">{errors.check_in_date}</span>}
                                </div>

                                {/* Date de départ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Date de départ</label>
                                    <input
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={e => setData('check_out_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.check_out_date && <span className="text-red-500 text-xs">{errors.check_out_date}</span>}
                                </div>

                                {/* Prix total estimé */}
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm font-medium text-gray-700">
                                        Prix Total Estimé : <span className="text-lg font-bold text-indigo-600">{data.total_price} €</span>
                                    </p>
                                </div>

                                {/* Actions boutons */}
                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
                                    >
                                        {processing ? 'Enregistrement...' : 'Confirmer'}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}