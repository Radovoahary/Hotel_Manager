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
            header={<h2 className="text-xl font-bold tracking-tight text-white">Tableau de bord</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* GRILLE DES CARTES DE STATISTIQUES (Inspirée du style top staking assets de image_ec2c0c.jpg) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        {/* Carte Chambres */}
                        <div className="bg-[#12111A] border border-[#1F1D2C] relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-[#2A283E]">
                            <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Chambres Totales</div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-white tracking-tight">{total_rooms}</div>
                                <span className="text-lg"></span>
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                        {/* Carte Clients */}
                        <div className="bg-[#12111A] border border-[#1F1D2C] relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-[#2A283E]">
                            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Clients Enregistrés</div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-white tracking-tight">{total_clients}</div>
                                <span className="text-lg">👥</span>
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                        {/* Carte Réservations */}
                        <div className="bg-[#12111A] border border-[#1F1D2C] relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-[#2A283E]">
                            <div className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Réservations</div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-white tracking-tight">{total_reservations}</div>
                                <span className="text-lg"></span>
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                        {/* Carte Revenus */}
                        <div className="bg-[#12111A] border border-[#1F1D2C] relative overflow-hidden rounded-2xl p-6 shadow-xl transition-all hover:border-[#2A283E]">
                            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Revenus Totaux</div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <div className="text-3xl font-black text-emerald-400 tracking-tight">{formattedRevenue} €</div>
                                <span className="text-lg">✨</span>
                            </div>
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                        </div>

                    </div>

                    {/* EN-TÊTE BIENVENUE / PANEL DE CONTRÔLE (Inspiré de la grande carte droite de image_ec2c0c.jpg) */}
                    <div className="relative bg-gradient-to-br from-[#12111A] to-[#1A1926] border border-[#2A283E] overflow-hidden rounded-2xl p-8 shadow-2xl">
                        <div className="relative z-10 max-w-2xl">
                            <h3 className="text-xl font-black text-white tracking-tight">
                                Bienvenue dans votre gestionnaire hôtelier !
                            </h3>
                            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                                Utilisez le menu supérieur pour naviguer de manière fluide entre la gestion de votre parc de chambres, le registre de vos clients et la planification de vos réservations en temps réel.
                            </p>
                        </div>
                        
                        {/* Effet lumineux d'arrière-plan discret */}
                        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}