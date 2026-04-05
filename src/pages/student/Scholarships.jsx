import React, { useState, useEffect } from 'react';
import { Search, Filter, Award, CheckCircle, XCircle, GraduationCap, DollarSign, Sparkles, MapPin, ArrowRight, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const Scholarships = () => {
    const navigate = useNavigate();
    const [scholarships, setScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    useEffect(() => {
        fetch('/api/scholarships')
            .then(res => res.json())
            .then(data => setScholarships(data))
            .catch(err => console.error('Failed to load scholarships:', err));
    }, []);

    // Get unique types for filter
    const types = ['All', ...new Set(scholarships.map(s => s.type))];

    const filtered = scholarships.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.provider && s.provider.toLowerCase().includes(searchTerm.toLowerCase())) ||
            s.country.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || s.type === filterType;
        return matchesSearch && matchesFilter;
    });


    const checkEligibility = (status) => {
        return status === 'Eligible';
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop"
                        alt="Graduation Success"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-blue-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <DollarSign size={12} className="text-emerald-300" />
                                Financial Support
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">Scholarships</span>
                            </h1>
                            <p className="text-emerald-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Don't let cost hold you back. Discover funding opportunities tailored for your academic profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/70 glass-card p-6 rounded-[2rem] flex flex-col md:flex-row gap-5 items-center backdrop-blur-2xl border border-white/50 shadow-xl sticky top-4 z-40">
                <div className="relative flex-grow w-full group">
                    <Search className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, provider, or country..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-12 pr-4 py-3.5 bg-white/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all font-medium border-2 border-emerald-50/50 outline-none hover:border-emerald-100 shadow-sm"
                    />
                </div>

                <div className="relative min-w-[200px] w-full md:w-auto">
                    <div className="absolute left-4 top-3.5 pointer-events-none text-emerald-600">
                        <Filter size={18} />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="block w-full pl-12 pr-10 py-3.5 bg-white border-2 border-emerald-100 rounded-xl appearance-none text-emerald-900 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-emerald-50 transition-colors shadow-sm"
                    >
                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-6">
                {filtered.length > 0 ? (
                    filtered.map(item => {
                        const isEligible = checkEligibility(item.status);
                        return (
                            <div key={item.id} className="relative group overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50 backdrop-blur-xl p-0 rounded-[2.5rem] border border-white/60 shadow-lg hover:shadow-2xl hover:shadow-emerald-100/50 transition-all duration-300 flex flex-col md:flex-row hover:-translate-y-1">

                                {/* Left Accent / Image Strip */}
                                <div className="md:w-32 bg-gradient-to-br from-emerald-600 to-teal-700 relative overflow-hidden flex items-center justify-center p-6 group-hover:w-40 transition-all duration-500">
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                                    <Award size={48} className="text-white drop-shadow-md group-hover:scale-110 transition-transform duration-500" />
                                </div>

                                {/* Content */}
                                <div className="flex-grow p-8 flex flex-col md:flex-row gap-8 justify-between items-center bg-transparent">
                                    <div className="space-y-4 flex-grow w-full">
                                        <div className="flex flex-wrap items-center gap-4">
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">{item.name}</h3>
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${isEligible
                                                ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200'
                                                : item.status === 'Check Requirements'
                                                    ? 'bg-amber-100/50 text-amber-700 border-amber-200'
                                                    : 'bg-slate-100/50 text-slate-500 border-slate-200'
                                                }`}>
                                                {isEligible ? <CheckCircle size={12} strokeWidth={3} /> : item.status === 'Check Requirements' ? <Sparkles size={12} /> : <XCircle size={12} strokeWidth={3} />}
                                                {item.status}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-colors">
                                                    <Building2 size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Provider</p>
                                                    <p className="font-bold text-slate-700">{item.provider}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-50 rounded-xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                                                    <MapPin size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                                                    <p className="font-bold text-slate-700">{item.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side: Amount & CTA */}
                                    <div className="flex flex-col items-center md:items-end gap-5 min-w-[200px] w-full md:w-auto border-t md:border-t-0 md:border-l border-emerald-100/50 pt-6 md:pt-0 md:pl-8">
                                        <div className="text-center md:text-right">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Value</p>
                                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 block">{item.amount}</span>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/student/scholarships/${item.id}`)}
                                            className="w-full px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 hover:-translate-y-0.5 group/btn flex items-center justify-center gap-2"
                                        >
                                            View Details
                                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <p className="text-xs font-bold text-slate-400 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50 uppercase tracking-wide w-full text-center">
                                            Deadline: <span className="text-slate-700 ml-1">{item.deadline}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-20 bg-white/40 rounded-[2rem] border-2 border-dashed border-emerald-100">
                        <div className="inline-flex p-4 rounded-full bg-emerald-50 mb-4 text-emerald-300">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700">No scholarships found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scholarships;
