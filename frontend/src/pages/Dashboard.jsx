import { useState, useEffect } from 'react';
import { api, iotApi } from '../api/axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Droplets, Thermometer, Sun, Zap, MessageCircle } from 'lucide-react';

export default function Dashboard() {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [readings, setReadings] = useState([]); // Mock data structure for chart
    const [pumpStatus, setPumpStatus] = useState('OFF');
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [inputMsg, setInputMsg] = useState('');

    useEffect(() => {
        // Fetch User's Devices
        const fetchDevices = async () => {
            try {
                const res = await api.get('/devices/');
                setDevices(res.data);
                if (res.data.length > 0) setSelectedDevice(res.data[0]);
            } catch (err) { console.error(err); }
        };
        fetchDevices();

        // Generate Mock Chart Data (since we might not have real historical data yet)
        const mockData = Array.from({ length: 10 }, (_, i) => ({
            name: `${i}:00`,
            moisture: Math.floor(Math.random() * 40) + 30,
            temp: Math.floor(Math.random() * 10) + 20,
        }));
        setReadings(mockData);

    }, []);

    const togglePump = async () => {
        if (!selectedDevice) return;
        try {
            const res = await iotApi.get(`/control-pump/${selectedDevice.device_id}`);
            setPumpStatus(res.data.pump_status);
        } catch (err) { console.error(err); }
    };

    const sendChat = async () => {
        if (!inputMsg.trim()) return;
        const newMsgs = [...chatMessages, { role: 'user', content: inputMsg }];
        setChatMessages(newMsgs);
        setInputMsg('');

        try {
            const res = await iotApi.post('/chat', { message: inputMsg });
            setChatMessages([...newMsgs, { role: 'bot', content: res.data.response }]);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="space-y-8 relative">
            <h1 className="text-3xl font-bold text-nature-900">My Smart Garden</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Device Status Card */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ActivityIcon className="text-blue-500" /> Live Monitor
                            </h2>
                            <select
                                className="border rounded-lg p-2"
                                onChange={(e) => setSelectedDevice(devices.find(d => d.id === parseInt(e.target.value)))}
                            >
                                {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={readings}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="moisture" stroke="#34ae6f" strokeWidth={2} />
                                    <Line type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={<Droplets className="text-blue-500" />} label="Soil Moisture" value="45%" />
                        <StatCard icon={<Thermometer className="text-red-500" />} label="Temperature" value="24°C" />
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-6">
                    <div className="card p-6 text-center">
                        <h3 className="text-lg font-bold mb-4">Pump Control</h3>
                        <div className={`text-2xl font-bold mb-4 ${pumpStatus === 'ON' ? 'text-green-500' : 'text-gray-400'}`}>
                            {pumpStatus}
                        </div>
                        <button
                            onClick={togglePump}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${pumpStatus === 'ON' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                        >
                            <Zap className="inline-block mr-2" />
                            {pumpStatus === 'ON' ? 'Stop Watering' : 'Activate Pump'}
                        </button>
                    </div>

                    <div className="card p-6 bg-nature-50 border-nature-200">
                        <h3 className="font-bold text-nature-800 mb-2">Sustainable Tip</h3>
                        <p className="text-sm text-nature-600">Water early in the morning to minimize evaporation and ensure your plants stay hydrated longer.</p>
                    </div>
                </div>
            </div>

            {/* Chatbot Bubble */}
            <div className={`fixed bottom-8 right-8 w-80 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-all transform ${chatOpen ? 'scale-100' : 'scale-0'}`}>
                <div className="bg-nature-600 p-4 text-white font-bold flex justify-between items-center">
                    <span>Plant Expert AI</span>
                    <button onClick={() => setChatOpen(false)}>×</button>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {chatMessages.map((m, i) => (
                        <div key={i} className={`p-2 rounded-lg text-sm max-w-[80%] ${m.role === 'user' ? 'ml-auto bg-nature-500 text-white' : 'bg-white border'}`}>
                            {m.content}
                        </div>
                    ))}
                </div>
                <div className="p-2 border-t flex gap-2">
                    <input
                        className="flex-1 border rounded px-2 py-1 text-sm"
                        value={inputMsg}
                        onChange={(e) => setInputMsg(e.target.value)}
                        placeholder="Ask about plants..."
                    />
                    <button onClick={sendChat} className="bg-nature-600 text-white px-3 rounded">Send</button>
                </div>
            </div>

            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-8 right-8 bg-nature-600 text-white p-4 rounded-full shadow-lg hover:bg-nature-700 transition-transform hover:scale-110"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}
        </div>
    );
}

function StatCard({ icon, label, value }) {
    return (
        <div className="card p-4 flex items-center gap-4">
            <div className="p-3 bg-gray-50 rounded-full">{icon}</div>
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-xl font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function ActivityIcon(props) {
    return <Activity {...props} />
}
