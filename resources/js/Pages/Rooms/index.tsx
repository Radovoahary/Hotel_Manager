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

    const handleCreateOpen = () => {
        setEditingRoom(null);
        reset();
        setIsOpen(true);
    };

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
            header={<h2 className="text-xl font-bold tracking-tight text-white">Gestion des Chambres</h2>}
        >
            <Head title="Chambres" />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* EN-TÊTE AVEC BOUTON D'AJOUT */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#12111A] border border-[#1F1D2C] p-6 rounded-2xl shadow-xl">
                    <div>
                        <h3 className="text-lg font-bold text-white">Liste des Chambres</h3>
                        <p className="text-sm text-gray-400 mt-1">Ajoutez, modifiez ou supprimez les chambres de l'hôtel.</p>
                    </div>
                    <button
                        onClick={handleCreateOpen}
                        className="inline-flex justify-center items-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 shadow-lg shadow-indigo-600/20 transition-all duration-150 active:scale-95"
                    >
                        <span className="mr-2">➕</span> Ajouter une Chambre
                    </button>
                </div>

                {/* TABLEAU DES CHAMBRES */}
                <div className="bg-[#12111A] border border-[#1F1D2C] rounded-2xl shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#1F1D2C]">
                            <thead className="bg-[#161522]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Numéro</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Prix / Nuit</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Statut</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1F1D2C]">
                                {rooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">
                                            <div className="text-2xl mb-2">🛏️</div>
                                            Aucune chambre enregistrée pour le moment.
                                        </td>
                                    </tr>
                                ) : (
                                    rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-[#1A1926] transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                                                N° {room.room_number}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {room.type}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-400">
                                                {Number(room.price_per_night).toFixed(2)} €
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                                                    room.status === 'available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    room.status === 'occupied' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                                        room.status === 'available' ? 'bg-emerald-400' :
                                                        room.status === 'occupied' ? 'bg-blue-400' : 'bg-amber-400'
                                                    }`} />
                                                    {room.status === 'available' ? 'Disponible' : room.status === 'occupied' ? 'Occupée' : 'Maintenance'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                                <button
                                                    onClick={() => handleEditOpen(room)}
                                                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                                                >
                                                    Modifier
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(room.id)}
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
                                {editingRoom ? '✏️ Modifier la chambre' : '✨ Ajouter une chambre'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Numéro de chambre</label>
                                    <input
                                        type="text"
                                        value={data.room_number}
                                        onChange={e => setData('room_number', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        placeholder="Ex: 101"
                                    />
                                    {errors.room_number && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.room_number}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Type de chambre</label>
                                    <input
                                        type="text"
                                        value={data.type}
                                        onChange={e => setData('type', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        placeholder="Ex: Double Deluxe, Suite"
                                    />
                                    {errors.type && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.type}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Prix par nuit (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price_per_night}
                                        onChange={e => setData('price_per_night', e.target.value)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white placeholder-gray-600 focus:border-indigo-500 focus:ring-indigo-500/20 shadow-inner"
                                        placeholder="Ex: 85.00"
                                    />
                                    {errors.price_per_night && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.price_per_night}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">Statut</label>
                                    <select
                                        value={data.status}
                                        onChange={e => setData('status', e.target.value as any)}
                                        className="mt-1.5 block w-full rounded-xl bg-[#1A1926] border-[#2A283E] text-white focus:border-indigo-500 focus:ring-indigo-500/20"
                                    >
                                        <option value="available" className="bg-[#12111A]">Disponible</option>
                                        <option value="occupied" className="bg-[#12111A]">Occupée</option>
                                        <option value="maintenance" className="bg-[#12111A]">Maintenance</option>
                                    </select>
                                    {errors.status && <p className="text-rose-400 text-xs mt-1 font-medium">{errors.status}</p>}
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