import { Link } from 'react-router-dom';
import { Leaf, Droplets, CloudSun, Sprout } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-20 bg-gradient-to-b from-nature-50 to-white rounded-3xl">
                <h1 className="text-5xl font-extrabold text-nature-900 leading-tight">
                    Smart Care for Your <span className="text-nature-500">Urban Jungle</span>
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Combine the beauty of nature with the power of AI and IoT. Monitor, care for, and grow your plants with precision.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/marketplace" className="btn btn-primary text-lg px-8 py-3">Shop Plants</Link>
                    <Link to="/register" className="btn btn-secondary text-lg px-8 py-3">Join & Connect Device</Link>
                </div>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Droplets className="w-10 h-10 text-blue-500" />}
                    title="Smart Irrigation"
                    desc="Control your water pumps remotely or let our AI decide the perfect watering schedule."
                />
                <FeatureCard
                    icon={<CloudSun className="w-10 h-10 text-yellow-500" />}
                    title="Environment Monitoring"
                    desc="Real-time tracking of soil moisture, temperature, and light levels."
                />
                <FeatureCard
                    icon={<Sprout className="w-10 h-10 text-nature-500" />}
                    title="AI Plant Doctor"
                    desc="Upload a photo and get instant diagnosis for diseases and care tips."
                />
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="mb-4 bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    );
}
