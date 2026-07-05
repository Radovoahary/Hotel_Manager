import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Stats {
    total_rooms: number;
    occupied_rooms: number;
    available_rooms: number;
    total_clients: number;
    total_reservations: number;
    revenue: number;
}

interface Reservation {
    id: number;
    client: { first_name: string; last_name: string };
    room: { room_number: string; type: string };
    check_in_date: string;
    total_price: number;
    status: string;
}

interface Props {
    stats: Stats;
    recent_reservations: Reservation[];
}

export default function Dashboard({ stats, recent_reservations }: Props) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tableau de Bord</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Grille des indicateurs (KPIs) */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        
                        {/* Carte Chiffre d'affaires */}
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-5">
                            <dt className="truncate text-sm font-medium text-gray-500">Revenus Générés</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">{stats.revenue} €</dd>
                        </div>

                        {/* Carte Réservations totales */}
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-5">
                            <dt className="truncate text-sm font-medium text-gray-500">Réservations Totales</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-indigo-600">{stats.total_reservations}</dd>
                        </div>

                        {/* Carte Taux d'occupation */}
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-5">
                            <dt className="truncate text-sm font-medium text-gray-500">Chambres Occupées</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
                                {stats.occupied_rooms} <span className="text-sm font-normal text-gray-400">/ {stats.total_rooms}</span>
                            </dd>
                        </div>

                        {/* Carte Chambres disponibles */}
                        <div className="overflow-hidden bg-white shadow sm:rounded-lg p-5">
                            <dt className="truncate text-sm font-medium text-gray-500">Chambres Disponibles</dt>
                            <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">{stats.available_rooms}</dd>
                        </div>
                    </div>

                    {/* Section Activité Récente */}
                    <div className="overflow-hidden bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Dernières Réservations</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chambre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'Arrivée</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recent_reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                                Aucune activité récente.
                                            </td>
                                        </tr>
                                    ) : (
                                        recent_reservations.map((res) => (
                                            <tr key={res.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {res.client ? `${res.client.first_name} ${res.client.last_name}` : 'Client supprimé'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {res.room ? `N°${res.room.room_number} (${res.room.type})` : 'Chambre supprimée'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(res.check_in_date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                    {res.total_price} €
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
        </AuthenticatedLayout>
    );
}