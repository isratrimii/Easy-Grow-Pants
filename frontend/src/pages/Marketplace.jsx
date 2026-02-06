import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { ShoppingBag, Search } from 'lucide-react';

export default function Marketplace() {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlants();
    }, []);

    const fetchPlants = async () => {
        try {
            const res = await api.get('/plants/');
            setPlants(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-nature-900">Marketplace</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search plants..."
                        className="pl-10 pr-4 py-2 border rounded-full focus:ring-2 focus:ring-nature-400 outline-none w-64"
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading plants...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plants.map(plant => (
                        <div key={plant.id} className="card group hover:-translate-y-1 transition-transform duration-300">
                            <div className="h-48 bg-gray-200 overflow-hidden relative">
                                <img
                                    src={plant.image_url || 'https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=1000&auto=format&fit=crop'}
                                    alt={plant.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-nature-700">
                                    ${plant.price}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-gray-800">{plant.name}</h3>
                                <p className="text-sm text-gray-500 mb-4 truncate">{plant.description}</p>
                                <button className="w-full btn btn-primary flex items-center justify-center gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
