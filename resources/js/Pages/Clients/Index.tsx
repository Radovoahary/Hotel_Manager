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

    // Ouvrir en mode création
    const handleCreateOpen = () => {
        setEditingClient(null);
        reset();
        setIsOpen(true);
    };

    // Ouvrir en mode édition avec pré-remplissage
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
            header={<h2 className="text-xl font-semibold text-gray-800">Gestion des Clients</h2>}
        >
            <Head title="Clients" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON D'AJOUT */}
                <div className="flex justify-between items-center bg-white p-6 shadow sm:rounded-lg">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Registre des Clients</h3>
                        <p className="text-sm text-gray-500">Gérez le portefeuille clients de votre établissement.</p>
                    </div>
                    <button
                        onClick={handleCreateOpen}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition"
                    >
                        Ajouter un Client
                    </button>
                </div>

                {/* TABLEAU DES CLIENTS */}
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom Complet</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adresse Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {clients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Aucun client enregistré.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.map((client) => (
                                        <tr key={client.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {client.first_name} {client.last_name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {client.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {client.phone || <span className="text-gray-400 italic">Non renseigné</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => handleEditOpen(client)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(client.id)}
                                                    className="text-red-600 hover:text-red-900"
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

                {/* MODAL UNIQUE (AJOUT & ÉDITION) */}
                {isOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingClient ? 'Modifier la fiche client' : 'Enregistrer un nouveau client'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prénom</label>
                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={e => setData('first_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: John"
                                    />
                                    {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nom</label>
                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={e => setData('last_name', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: Doe"
                                    />
                                    {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Adresse Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="john.doe@example.com"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Téléphone (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: +33 6 12 34 56 78"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div className="flex justify-end space-x-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition disabled:opacity-50"
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