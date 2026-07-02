import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Room {
    id: number;
    room_number: string;
    type: string;
    price_per_night: string;
    status: string;
}

interface Props {
    rooms: Room[];
}

export default function Index({ rooms }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestion des Chambres
                </h2>
            }
        >
            <Head title="Chambres" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-4">Liste des chambres de l'hôtel</h3>
                        
                        {rooms.length === 0 ? (
                            <p className="text-gray-500">Aucune chambre enregistrée pour le moment.</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {rooms.map((room) => (
                                    <div key={room.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                                        <p className="text-xl font-semibold">Chambre N°{room.room_number}</p>
                                        <p className="text-gray-600">Type : {room.type}</p>
                                        <p className="text-green-600 font-bold mt-2">{room.price_per_night} € / nuit</p>
                                        <span className="inline-block px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded mt-2">
                                            {room.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}