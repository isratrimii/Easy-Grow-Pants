import { useState, useEffect } from 'react';
import { api } from '../api/axios';
import { Plus, Package } from 'lucide-react';

export default function SellerDashboard() {
    const [plants, setPlants] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '', stock: 0, price: 0, description: '', care_instructions: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('/plants/');
            setPlants(res.data); // In real app, filter by seller
        } catch (err) { console.error(err); }
    };

    const handleAddPlant = async (e) => {
        e.preventDefault();
        try {
            await api.post('/plants/', formData);
            setShowForm(false);
            fetchInventory();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Seller Dashboard</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Plant
                </button>
            </div>

            {showForm && (
                <div className="card p-6 bg-gray-50">
                    <h3 className="font-bold mb-4">Add Listing</h3>
                    <form onSubmit={handleAddPlant} className="grid md:grid-cols-2 gap-4">
                        <input className="p-2 border rounded" placeholder="Plant Name" onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Price ($)" type="number" onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <input className="p-2 border rounded" placeholder="Stock" type="number" onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                        <textarea className="p-2 border rounded md:col-span-2" placeholder="Description" onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <textarea className="p-2 border rounded md:col-span-2" placeholder="Care Instructions" onChange={e => setFormData({ ...formData, care_instructions: e.target.value })} />
                        <button className="btn btn-primary md:col-span-2">List Plant</button>
                    </form>
                </div>
            )}

            <div className="card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4">Plant Name</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {plants.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium">{p.name}</td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4">${p.price}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {p.stock > 0 ? 'Active' : 'Out of Stock'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {plants.length === 0 && <div className="p-8 text-center text-gray-500">No plants listed yet.</div>}
            </div>
        </div>
    );
}
