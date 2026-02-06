import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { Leaf } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '', password: '', email: '', role: 'buyer'
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register/', formData);
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Username may be taken.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-nature-100">
            <div className="text-center mb-8">
                <Leaf className="w-12 h-12 text-nature-600 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-gray-800">Join the Community</h2>
                <p className="text-gray-500">Start your green journey today</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                    <select
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                        <option value="buyer">Plant Buyer</option>
                        <option value="seller">Plant Seller</option>
                    </select>
                </div>
                <button type="submit" className="w-full btn btn-primary py-3">Register</button>
            </form>

            <p className="mt-6 text-center text-gray-600">
                Already have an account? <Link to="/login" className="text-nature-600 font-medium hover:underline">Login</Link>
            </p>
        </div>
    );
}
