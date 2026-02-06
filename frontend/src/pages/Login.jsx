import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../api/axios';
import { Leaf } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login/', formData);
            setAuthToken(res.data.access, res.data.refresh);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-nature-100">
            <div className="text-center mb-8">
                <Leaf className="w-12 h-12 text-nature-600 mx-auto mb-2" />
                <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                <p className="text-gray-500">Sign in to manage your garden</p>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nature-500 outline-none"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>
                <button type="submit" className="w-full btn btn-primary py-3">Sign In</button>
            </form>

            <p className="mt-6 text-center text-gray-600">
                Don't have an account? <Link to="/register" className="text-nature-600 font-medium hover:underline">Register</Link>
            </p>
        </div>
    );
}
