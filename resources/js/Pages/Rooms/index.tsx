import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';

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
    const [isOpen, setIsOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const { data, setData, post, patch, processing, errors, reset } = useForm({
        room_number: '',
        type: '',
        price_per_night: '',
        status: 'available',
    });

    // Ouvrir le modal en mode création
    const handleCreateOpen = () => {
        setEditingRoom(null);
        reset();
        setIsOpen(true);
    };

    // Ouvrir le modal en mode édition
    const handleEditOpen = (room: Room) => {
        setEditingRoom(room);
        setData({
            room_number: room.room_number,
            type: room.type,
            price_per_night: room.price_per_night.toString(),
            status: room.status,
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoom) {
            patch(route('rooms.update', editingRoom.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post(route('rooms.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette chambre ?')) {
            router.delete(route('rooms.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold text-gray-800">Gestion des Chambres</h2>}
        >
            <Head title="Chambres" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON D'AJOUT */}
                <div className="flex justify-between items-center bg-white p-6 shadow sm:rounded-lg">
                    <div>
                        <h3 className="text-lg font-bold text-gray-700">Liste des Chambres</h3>
                        <p className="text-sm text-gray-500">Ajoutez, modifiez ou supprimez les chambres de l'hôtel.</p>
                    </div>
                    <button
                        onClick={handleCreateOpen}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow transition"
                    >
                        Ajouter une Chambre
                    </button>
                </div>

                {/* TABLEAU DES CHAMBRES */}
                <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix / Nuit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-500">
                                            Aucune chambre enregistrée.
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.map((room) => (
                                        <tr key={room.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                N° {room.room_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {room.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {Number(room.price_per_night).toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${
                                                    room.status === 'available' ? 'bg-green-100 text-green-800' :
                                                    room.status === 'occupied' ? 'bg-blue-100 text-blue-800' : 
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {room.status === 'available' ? 'Disponible' : room.status === 'occupied' ? 'Occupée' : 'Maintenance'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => handleEditOpen(room)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
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
                                {editingRoom ? 'Modifier la chambre' : 'Ajouter une nouvelle chambre'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Numéro de chambre</label>
                                    <input
                                        type="text"
                                        value={data.room_number}
                                        onChange={e => setData('room_number', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: 101"
                                    />
                                    {errors.room_number && <p className="text-red-500 text-xs mt-1">{errors.room_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Type de chambre</label>
                                    <input
                                        type="text"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: Double Deluxe, Suite"
                                    />
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Prix par nuit (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_per_night}
                                        onChange={e => setData('price_per_night', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Ex: 85.00"
                                    />
                                    {errors.price_per_night && <p className="text-red-500 text-xs mt-1">{errors.price_per_night}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Statut</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as any)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="available">Disponible</option>
                                        <option value="occupied">Occupée</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                    {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
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