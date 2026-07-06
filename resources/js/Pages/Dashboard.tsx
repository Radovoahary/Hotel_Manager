import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

// On définit proprement les types des props attendues depuis web.php
interface Props {
    total_rooms?: number;
    total_clients?: number;
    total_reservations?: number;
    revenue?: number | string;
}

export default function Dashboard({ 
    total_rooms = 0, 
    total_clients = 0, 
    total_reservations = 0, 
    revenue = 0 
}: Props) {
    
    // Sécurité au cas où le revenu arrive sous forme de chaîne de caractères
    const formattedRevenue = Number(revenue).toFixed(2);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Tableau de bord</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* GRILLE DES CARTES DE STATISTIQUES */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Carte Chambres */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg p-6 border-l-4 border-indigo-500">
                            <div className="text-sm font-medium text-gray-500 uppercase">Chambres Totales</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{total_rooms}</div>
                        </div>

                        {/* Carte Clients */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg p-6 border-l-4 border-green-500">
                            <div className="text-sm font-medium text-gray-500 uppercase">Clients Enregistrés</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{total_clients}</div>
                        </div>

                        {/* Carte Réservations */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg p-6 border-l-4 border-yellow-500">
                            <div className="text-sm font-medium text-gray-500 uppercase">Réservations</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{total_reservations}</div>
                        </div>

                        {/* Carte Revenus */}
                        <div className="bg-white overflow-hidden shadow sm:rounded-lg p-6 border-l-4 border-red-500">
                            <div className="text-sm font-medium text-gray-500 uppercase">Revenus Totaux</div>
                            <div className="mt-2 text-3xl font-bold text-gray-900">{formattedRevenue} €</div>
                        </div>

                    </div>

                    {/* MESSAGE DE BIENVENUE */}
                    <div className="mt-8 bg-white overflow-hidden shadow sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold text-gray-800">Bienvenue dans votre gestionnaire hôtelier !</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Utilisez le menu supérieur pour naviguer entre la gestion des chambres, des clients et planifier vos réservations en temps réel.
                        </p>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}