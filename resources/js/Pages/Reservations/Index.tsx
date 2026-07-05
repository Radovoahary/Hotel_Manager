import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

// ==========================================
// 1. TYPAGES TS (Structures de données)
// ==========================================
interface Client {
    id: number;
    nom: string;
    prenom: string;
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
    // État pour afficher ou masquer la modale de création
    const [showModal, setShowModal] = useState(false);

    // ==========================================
    // 2. FORMULAIRE & LOGIQUE METIER
    // ==========================================
    
    // Initialisation du formulaire géré par Inertia.js
    const { data, setData, post, processing, errors, reset } = useForm({
        client_id: '',
        room_id: '',
        check_in_date: '',
        check_out_date: '',
        total_price: 0,
    });

    // Recalcule le prix automatiquement dès qu'une chambre ou une date change
    useEffect(() => {
        if (data.room_id && data.check_in_date && data.check_out_date) {
            const selectedRoom = rooms.find(r => r.id === parseInt(data.room_id));
            const start = new Date(data.check_in_date);
            const end = new Date(data.check_out_date);

            // Différence en millisecondes convertie en nombre de jours
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            // Si les données sont valides, on met à jour le prix total dans Inertia
            if (selectedRoom && diffDays > 0 && end > start) {
                setData('total_price', diffDays * selectedRoom.price_per_night);
            } else {
                setData('total_price', 0);
            }
        }
    }, [data.room_id, data.check_in_date, data.check_out_date, rooms]);

    // Soumission des données au serveur Laravel via Inertia
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('reservations.store'), {
            onSuccess: () => {
                setShowModal(false); // Ferme la modale en cas de succès
                reset();             // Réinitialise les champs du formulaire
            },
        });
    };

    // ==========================================
    // 3. EN-TÊTE ET STRUCTURE PRINCIPALE
    // ==========================================
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
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

            {/* Conteneur principal de la liste */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            
                            {/* ==========================================
                                4. TABLEAU DES RESERVATIONS EXISTANTES
                                ========================================== */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Chambre</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Arrivée</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Départ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Prix Total</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {reservations.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    Aucune réservation trouvée.
                                                </td>
                                            </tr>
                                        ) : (
                                            reservations.map((reservation) => (
                                                <tr key={reservation.id}>
                                                    {/* Sécurité si le client a été supprimé de la BDD */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {reservation.client ? `${reservation.client.prenom} ${reservation.client.nom}` : 'Client supprimé'}
                                                    </td>
                                                    {/* Sécurité si la chambre a été supprimée de la BDD */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {reservation.room ? `Chambre N°${reservation.room.room_number} (${reservation.room.type})` : 'Chambre supprimée'}
                                                    </td>
                                                    {/* Formatage local des dates */}
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(reservation.check_in_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(reservation.check_out_date).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                                                        {reservation.total_price} €
                                                    </td>
                                                    {/* Badge de statut colorisé dynamiquement */}
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

            {/* ==========================================
                5. FENÊTRE MODALE : FORMULAIRE DE AJOUT
                ========================================== */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
                    {/* Arrière-plan semi-transparent cliquable pour fermer la modale */}
                    <div className="fixed inset-0 bg-black opacity-50" onClick={() => setShowModal(false)}></div>
                    
                    <div className="relative w-full max-w-md mx-auto my-6 z-50">
                        <div className="relative flex flex-col w-full bg-white dark:bg-gray-800 border-0 rounded-lg shadow-lg outline-none focus:outline-none p-6">
                            
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                Créer une nouvelle réservation
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Menu déroulant Clients */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                                    <select
                                        value={data.client_id}
                                        onChange={e => setData('client_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Sélectionner un client</option>
                                        {clients.map(client => (
                                            <option key={client.id} value={client.id}>{client.prenom} {client.nom}</option>
                                        ))}
                                    </select>
                                    {errors.client_id && <span className="text-red-500 text-xs">{errors.client_id}</span>}
                                </div>

                                {/* Menu déroulant Chambres */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chambre disponible</label>
                                    <select
                                        value={data.room_id}
                                        onChange={e => setData('room_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

                                {/* Sélection Date Arrivée */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date d'arrivée</label>
                                    <input
                                        type="date"
                                        value={data.check_in_date}
                                        onChange={e => setData('check_in_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.check_in_date && <span className="text-red-500 text-xs">{errors.check_in_date}</span>}
                                </div>

                                {/* Sélection Date Départ */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date de départ</label>
                                    <input
                                        type="date"
                                        value={data.check_out_date}
                                        onChange={e => setData('check_out_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                    {errors.check_out_date && <span className="text-red-500 text-xs">{errors.check_out_date}</span>}
                                </div>

                                {/* Affichage en temps réel du prix calculé par le useEffect */}
                                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Prix Total Estimé : <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{data.total_price} €</span>
                                    </p>
                                </div>

                                {/* Boutons de validation / annulation */}
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
                                        disabled={processing} // Désactive le bouton pendant l'envoi
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