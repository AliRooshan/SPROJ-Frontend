import React, { useState, useEffect } from 'react';
import { DollarSign, RefreshCw, Save, MapPin, Plus, X } from 'lucide-react';
import api from '../../services/api';

const ManageCosts = () => {
    const [cities, setCities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        api.get('/costs')
            .then(data => setCities(data))
            .catch(console.error);
    }, []);

    const handleAddExchangeRate = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCity = {
            city: formData.get('city'),
            country: formData.get('country'),
            currency: formData.get('currency'),
            rent: parseInt(formData.get('rent')),
            food: parseInt(formData.get('food')),
            transport: parseInt(formData.get('transport'))
        };
        setCities([...cities, newCity]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Cost Configuration</h1>
                    <p className="text-zinc-400 font-medium">Update base estimates for the Cost Estimator tool.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Add Exchange Rate</span>
                    </button>
                    <button
                        onClick={() => alert('Exchange rates synced successfully!')}
                        className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl border border-zinc-700 shadow-sm transition-all active:scale-95"
                    >
                        <RefreshCw size={18} />
                        <span>Sync Rates</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#18181b] rounded-[2rem] border border-zinc-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-900/50 border-b border-zinc-800">
                                <th className="p-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">City</th>
                                <th className="p-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">Base Rent</th>
                                <th className="p-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">Food Est.</th>
                                <th className="p-6 text-sm font-bold text-zinc-500 uppercase tracking-wider">Transport</th>
                                <th className="p-6 text-sm font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {cities.map((city, idx) => (
                                <tr key={idx} className="group hover:bg-zinc-800/50 transition-colors">
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-zinc-800 rounded-lg text-amber-500 group-hover:text-amber-400">
                                                <MapPin size={18} />
                                            </div>
                                            <div>
                                                <span className="block font-bold text-white text-lg">{city.city}</span>
                                                <span className="text-xs font-bold text-zinc-500 uppercase">{city.country}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 w-32 focus-within:border-amber-500 transition-colors">
                                            <span className="text-zinc-500 text-xs font-bold">{city.currency}</span>
                                            <input type="number" defaultValue={city.rent} className="bg-transparent text-white font-mono w-full outline-none" />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 w-32 focus-within:border-amber-500 transition-colors">
                                            <span className="text-zinc-500 text-xs font-bold">{city.currency}</span>
                                            <input type="number" defaultValue={city.food} className="bg-transparent text-white font-mono w-full outline-none" />
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 w-32 focus-within:border-amber-500 transition-colors">
                                            <span className="text-zinc-500 text-xs font-bold">{city.currency}</span>
                                            <input type="number" defaultValue={city.transport} className="bg-transparent text-white font-mono w-full outline-none" />
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <button
                                            onClick={() => alert(`Saved costs for ${city.city}!`)}
                                            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg transition-colors shadow-lg shadow-amber-900/20 active:scale-95"
                                        >
                                            <Save size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Exchange Rate Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Add New Exchange Rate</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddExchangeRate} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">City</label>
                                    <input name="city" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. London" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Country</label>
                                    <input name="country" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. UK" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">Currency</label>
                                <select name="currency" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors">
                                    <option value="$">$ USD</option>
                                    <option value="£">£ GBP</option>
                                    <option value="€">€ EUR</option>
                                    <option value="¥">¥ JPY</option>
                                    <option value="A$">A$ AUD</option>
                                    <option value="C$">C$ CAD</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Rent/Month</label>
                                    <input name="rent" required type="number" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="800" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Food/Month</label>
                                    <input name="food" required type="number" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="300" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Transport/Month</label>
                                    <input name="transport" required type="number" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="100" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">Add Rate</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCosts;
