import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

interface Client {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
}

interface Props {
    clients: Client[];
}

export default function Index({ clients }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
    });

    const handleCreateOpen = () => {
        setEditingClient(null);
        reset();
        setIsOpen(true);
    };

    const handleEditOpen = (client: Client) => {
        setEditingClient(client);
        setData({
            first_name: client.first_name,
            last_name: client.last_name,
            email: client.email,
            phone: client.phone || '',
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            patch(route('clients.update', editingClient.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post(route('clients.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce client définitivement ?')) {
            router.delete(route('clients.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold tracking-tight text-white">Gestion des Clients</h2>}
        >
            <Head title="Clients" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON D'AJOUT */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#12111A] border border-[#1F1D2C] p-6 rounded-2xl shadow-xl">
                    <div>
                        <h3 className="text-lg font-bold text-white">Registre des Clients</h3>
                        <p className="text-sm text-gray-400 mt-1">Gérez le portefeuille clients de votre établissement.</p>
                    </div>
                    <button
                        onClick={handleCreateOpen}
                        className="inline-flex justify-center items-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-95"
                    >
                        <span className="mr-2">👤</span> Ajouter un Client
                    </button>
                </div>

                {/* TABLEAU DES CLIENTS */}
                <div className="bg-[#12111A] border border-[#1F1D2C] rounded-2xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#1F1D2C]">
                            <thead className="bg-[#161522]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nom Complet</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Téléphone</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F1D2C]">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-400">
                                            <div className="text-2xl mb-2">👥</div>
                                            Aucun client enregistré pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-[#1A1926] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                                {client.first_name} {client.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {client.phone ? (
                                                    <span className="font-mono text-indigo-300">{client.phone}</span>
                                                ) : (
                                                    <span className="text-gray-600 italic text-xs">Non renseigné</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => handleEditOpen(client)}
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="text-rose-400 hover:text-rose-300 transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL UNIQUE STYLE SOMBRE PREMIUM */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#12111A] border border-[#2A283E] rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
                            <h3 className="text-lg font-black text-white tracking-tight">
                                {editingClient ? ' Modifier la fiche client' : ' Enregistrer un nouveau client'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Prénom</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={e => setData('first_name', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                            placeholder="John"
                                        />
                                        {errors.first_name && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.first_name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Nom</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={e => setData('last_name', e.target.value)}
                                            className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                            placeholder="Doe"
                                        />
                                        {errors.last_name && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Adresse Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        placeholder="john.doe@example.com"
                                    />
                                    {errors.email && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Téléphone (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        placeholder="+33 6 12 34 56 78"
                                    />
                                    {errors.phone && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.phone}</p>}
                                </div>

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
                                        {processing ? 'Enregistrement...' : 'Enregistrer'}
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