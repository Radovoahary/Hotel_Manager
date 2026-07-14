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
            header={<h2 className="text-xl font-bold tracking-tight text-white">Gestion des Réservations</h2>}
        >
            <Head title="Réservations" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON NOUVELLE RÉSERVATION */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#12111A] border border-[#1F1D2C] p-6 rounded-2xl shadow-xl">
                    <div>
                        <h3 className="text-lg font-bold text-white">Historique des Réservations</h3>
                        <p className="text-sm text-gray-400 mt-1">Consultez et planifiez les séjours de vos clients.</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="inline-flex justify-center items-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-95"
                    >
                        <span className="mr-2"></span> Nouvelle Réservation
                    </button>
                </div>

                {/* TABLEAU DE LA LISTE DES RÉSERVATIONS */}
                <div className="bg-[#12111A] border border-[#1F1D2C] rounded-2xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#1F1D2C]">
                            <thead className="bg-[#161522]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Client</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Chambre</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Arrivée</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Départ</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Prix Total</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F1D2C]">
                                {reservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">
                                            <div className="text-2xl mb-2">📭</div>
                                            Aucune réservation trouvée.
                                        </td>
                                    </tr>
                                ) : (
                                    reservations.map((reservation) => (
                                        <tr key={reservation.id} className="hover:bg-[#1A1926] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                                {reservation.client ? (
                                                    `${reservation.client.first_name} ${reservation.client.last_name}`
                                                ) : (
                                                    <span className="text-rose-400 italic font-normal">Client supprimé</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {reservation.room ? (
                                                    <span className="bg-[#1F1D2C] px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-300 border border-[#2A283E]">
                                                        N°{reservation.room.room_number} • {reservation.room.type}
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-400 italic">Chambre supprimée</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                {new Date(reservation.start_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">
                                                {new Date(reservation.end_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-white">
                                                {Number(reservation.total_price).toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-xl border ${
                                                    reservation.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    reservation.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                                                    'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                        reservation.status === 'confirmed' ? 'bg-emerald-400' :
                                                        reservation.status === 'pending' ? 'bg-amber-400' : 'bg-rose-400'
                                                    }`} />
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
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#12111A] border border-[#2A283E] rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                            <h3 className="text-lg font-black text-white tracking-tight">✨ Créer une nouvelle réservation</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Choix du Client */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Client</label>
                                    <select
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                    >
                                        <option value="" className="bg-[#12111A]">Sélectionner un client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id} className="bg-[#1A1926]">
                                                {client.first_name} {client.last_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.client_id && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.client_id}</p>}
                                </div>

                                {/* Choix de la Chambre */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Chambre</label>
                                    <select
                                        value={data.room_id}
                                        onChange={e => setData('room_id', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                    >
                                        <option value="" className="bg-[#12111A]">Sélectionner une chambre</option>
                                        {rooms.map(room => (
                                            <option key={room.id} value={room.id} className="bg-[#1A1926]">
                                                N°{room.room_number} - {room.type} ({room.price_per_night}€/nuit)
                                            </option>
                                        ))}
                                    </select>
                                    {errors.room_id && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.room_id}</p>}
                                </div>

                                {/* Dates d'arrivée et de départ */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Arrivée</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        />
                                        {errors.start_date && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.start_date}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Départ</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        />
                                        {errors.end_date && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.end_date}</p>}
                                    </div>
                                </div>

                                {/* Affichage automatique du prix estimé */}
                                <div className="p-4 bg-[#161522] rounded-xl border border-[#1F1D2C] flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Prix Total Estimé</span>
                                    <span className="text-xl font-black text-indigo-400 font-mono">
                                        {data.total_price.toFixed(2)} €
                                    </span>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex justify-end space-x-3 pt-4 border-t border-[#1F1D2C]">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-[#1F1D2C] hover:bg-[#2A283E] text-gray-300 font-semibold py-2 px-4 rounded-xl transition duration-150"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-5 rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 disabled:opacity-50"
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