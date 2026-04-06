import React, { useState, useEffect } from 'react';
import { DollarSign, Home, Coffee, Bus, Info, Wallet, Calculator, Globe } from 'lucide-react';
import api from '../../services/api';

const CostEstimator = () => {
    const [costsData, setCostsData] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [lifestyle, setLifestyle] = useState('Moderate');

    useEffect(() => {
        api.get('/costs')
            .then(data => {
                setCostsData(data);
                if (data.length > 0) setSelectedCity(data[0].city);
            })
            .catch(err => console.error('Failed to load costs:', err));
    }, []);

    const cityData = costsData.find(c => c.city === selectedCity);

    if (!cityData) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading cost data...</div>;



    const calculateTotal = () => {
        let multiplier = 1;
        if (lifestyle === 'Frugal') multiplier = 0.8;
        if (lifestyle === 'Expensive') multiplier = 1.3;

        return {
            rent: Math.round(cityData.rent * multiplier),
            food: Math.round(cityData.food * multiplier),
            transport: Math.round(cityData.transport * multiplier),
            total: Math.round((cityData.rent + cityData.food + cityData.transport) * multiplier)
        };
    };

    const costs = calculateTotal();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Hero Section - Image Based */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?q=80&w=2070&auto=format&fit=crop"
                        alt="Finance Planning"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-900/60 via-purple-900/50 to-indigo-900/40 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <Wallet size={12} className="text-violet-300" />
                                Budget Planner
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Cost <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-200 to-white">Estimator</span>
                            </h1>
                            <p className="text-violet-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Plan your monthly budget wisely based on your student destination and personal lifestyle choices.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                {/* Controls - Glass Card */}
                <div className="bg-white/70 glass-card p-8 rounded-[2.5rem] border border-white/50 shadow-xl backdrop-blur-2xl space-y-8">
                    <div>
                        <label className="block text-xs font-black text-indigo-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Globe size={14} />
                            Select Destination
                        </label>
                        <div className="relative group">
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="block w-full px-5 py-4 bg-white/50 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all cursor-pointer outline-none font-bold text-lg hover:bg-white hover:border-indigo-200 shadow-sm appearance-none"
                            >
                                {costsData.map(c => (
                                    <option key={c.city} value={c.city}>{c.city}, {c.country}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 group-hover:text-indigo-600 transition-colors">
                                <DollarSign size={20} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-indigo-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Calculator size={14} />
                            Lifestyle Preference
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Frugal', 'Moderate', 'Expensive'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setLifestyle(mode)}
                                    className={`py-4 px-2 text-sm font-bold rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${lifestyle === mode
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200 transform scale-105'
                                        : 'bg-white text-slate-500 border-indigo-50 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-slate-500 mt-6 leading-relaxed bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 flex gap-2">
                            <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                            <span>
                                <span className="font-bold text-indigo-900">{lifestyle}</span> estimates assume {lifestyle === 'Frugal' ? 'shared accommodation and cooking at home.' : lifestyle === 'Moderate' ? 'standard student housing and occasional eating out.' : 'private studio and frequent outings.'}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Result Card - Premium Gradient Glass */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl p-8 flex flex-col justify-between group h-full min-h-[450px]">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900"></div>
                    <div className="absolute top-0 right-0 p-32 bg-indigo-500/30 rounded-full blur-[80px] -mr-16 -mt-16 group-hover:bg-indigo-500/40 transition-all duration-700 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-pink-500/20 rounded-full blur-[60px] -ml-10 -mb-10"></div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-indigo-200 font-bold uppercase tracking-widest text-[10px] border border-indigo-500/30 w-fit px-3 py-1 rounded-full bg-indigo-500/10">
                                <Wallet size={12} /> Monthly Cost
                            </div>
                        </div>
                        <div className="text-6xl md:text-7xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-200 drop-shadow-2xl transition-all duration-500">
                            {cityData.currency} {costs.total.toLocaleString()}
                        </div>
                        <p className="text-indigo-200/80 font-medium text-xl">for <span className="text-white border-b-2 border-indigo-400 pb-0.5">{selectedCity}</span></p>
                    </div>

                    <div className="mt-8 space-y-4 relative z-10 bg-white/5 rounded-[2rem] p-6 backdrop-blur-md border border-white/10 shadow-inner">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 group/item hover:bg-white/5 rounded-xl px-2 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 group-hover/item:scale-110 transition-transform"><Home size={20} className="text-indigo-300" /></div>
                                <span className="text-slate-200 font-medium text-sm">Accommodation</span>
                            </div>
                            <span className="font-bold font-mono text-xl tracking-tight">{cityData.currency} {costs.rent.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-white/5 pb-4 group/item hover:bg-white/5 rounded-xl px-2 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 group-hover/item:scale-110 transition-transform"><Coffee size={20} className="text-emerald-300" /></div>
                                <span className="text-slate-200 font-medium text-sm">Food & Groceries</span>
                            </div>
                            <span className="font-bold font-mono text-xl tracking-tight">{cityData.currency} {costs.food.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between group/item hover:bg-white/5 rounded-xl px-2 pt-2 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/30 group-hover/item:scale-110 transition-transform"><Bus size={20} className="text-amber-300" /></div>
                                <span className="text-slate-200 font-medium text-sm">Transport</span>
                            </div>
                            <span className="font-bold font-mono text-xl tracking-tight">{cityData.currency} {costs.transport.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white/40 border border-white/60 rounded-2xl p-6 flex gap-4 text-slate-600 text-sm shadow-sm items-start backdrop-blur-sm">
                <Info className="shrink-0 text-indigo-400" size={24} />
                <p className="font-medium pt-0.5 leading-relaxed">These estimates are indicative only and can vary significantly based on personal choices and exchange rates. This tool does <span className="font-black text-slate-800">not</span> include tuition fees, which vary by institution.</p>
            </div>
        </div>
    );
};

export default CostEstimator;
