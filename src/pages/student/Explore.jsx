import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, ArrowUpDown, X, Globe, Clock, Sparkles } from 'lucide-react';
import ProgramCard from '../../components/ProgramCard';
import AuthService from '../../services/AuthService';

const Explore = ({ isGuest = false }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [selectedDegree, setSelectedDegree] = useState('All');
    const [selectedDuration, setSelectedDuration] = useState('All');
    const [budgetRange, setBudgetRange] = useState([0, 50000]);
    const [showFilters, setShowFilters] = useState(false);
    const [sortBy, setSortBy] = useState('id');
    const [savedProgramIds, setSavedProgramIds] = useState([]);

    useEffect(() => {
        fetch('/api/programs')
            .then(res => res.json())
            .then(data => { setPrograms(data); setLoading(false); })
            .catch(() => setLoading(false));

        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setSavedProgramIds((currentUser.savedPrograms ?? []).map(p => p.program_id ?? p.id));
        }
    }, []);

    const handleToggleSave = async (program) => {
        if (isGuest) return;
        try {
            const isNowSaved = await AuthService.toggleSavedProgram(program);
            if (isNowSaved) {
                setSavedProgramIds(prev => [...prev, program.id]);
            } else {
                setSavedProgramIds(prev => prev.filter(id => id !== program.id));
            }
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };

    const countries = ['All', ...new Set(programs.map(u => u.country))];
    const degrees   = ['All', ...new Set(programs.map(u => u.program?.split(' ')[0]))];
    const durations = ['All', ...new Set(programs.map(u => u.duration))];

    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            program.university?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry  = selectedCountry === 'All' || program.country === selectedCountry;
        const matchesDegree   = selectedDegree === 'All'  || program.program?.startsWith(selectedDegree);
        const matchesDuration = selectedDuration === 'All' || program.duration === selectedDuration;
        const matchesBudget   = Number(program.tuition) >= budgetRange[0] && Number(program.tuition) <= budgetRange[1];
        return matchesSearch && matchesCountry && matchesDegree && matchesDuration && matchesBudget;
    }).sort((a, b) => {
        if (sortBy === 'price_low')  return Number(a.tuition) - Number(b.tuition);
        if (sortBy === 'price_high') return Number(b.tuition) - Number(a.tuition);
        return a.id - b.id;
    });


    const activeFilterCount = [
        selectedCountry !== 'All',
        selectedDegree !== 'All',
        selectedDuration !== 'All',
        budgetRange[0] !== 0 || budgetRange[1] !== 50000
    ].filter(Boolean).length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Hero Section - Image Based */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop"
                        alt="Planning Future"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-pink-900/70 mix-blend-multiply opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <Globe size={12} className="text-cyan-300" />
                                Global Opportunities
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-white">Programs</span>
                            </h1>
                            <p className="text-indigo-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Discover your perfect master's degree from top universities worldwide. Compare costs, requirements, and opportunities.
                            </p>
                        </div>

                        {/* Quick Stats Overlay */}
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
                                <div className="text-3xl font-black text-white mb-1">{filteredPrograms.length}</div>
                                <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Programs</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center min-w-[100px]">
                                <div className="text-3xl font-black text-white mb-1">{countries.length - 1}</div>
                                <div className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">Countries</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Filters Bar - Enhanced Glass */}
            <div className="bg-white/70 glass-card p-6 rounded-[2rem] flex flex-col gap-5 sticky top-4 z-40 backdrop-blur-2xl border border-white/50 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    {/* Enhanced Search Bar */}
                    <div className="relative flex-grow w-full group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search universities, programs, or keywords..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-12 pr-4 py-3.5 bg-white/80 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 placeholder-slate-400 transition-all font-medium border-2 border-indigo-50/50 outline-none hover:border-indigo-100 shadow-sm"
                        />
                    </div>

                    {/* Filters Button */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all whitespace-nowrap relative shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${showFilters ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:text-indigo-600'}`}
                    >
                        <Filter size={18} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg border-2 border-white">
                                {activeFilterCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Expanded Filters - Enhanced */}
                {showFilters && (
                    <div className="pt-6 border-t border-indigo-50/50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-2 duration-200">
                        {/* Country Filter */}
                        <div>
                            <label className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block flex items-center gap-2">
                                <MapPin size={14} />
                                Country
                            </label>
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full px-4 py-3 bg-white/80 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-900 cursor-pointer transition-all font-medium border-2 border-indigo-50/50 outline-none hover:border-indigo-100 shadow-sm"
                            >
                                {countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Degree Type Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <SlidersHorizontal size={14} className="text-purple-500" />
                                Degree Type
                            </label>
                            <select
                                value={selectedDegree}
                                onChange={(e) => setSelectedDegree(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 hover:bg-white focus:bg-white rounded-xl focus:ring-2 focus:ring-purple-500 text-slate-900 cursor-pointer transition-all font-medium border-0 shadow-sm outline-none"
                            >
                                {degrees.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Duration Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Clock size={14} className="text-amber-500" />
                                Duration
                            </label>
                            <select
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                className="w-full px-4 py-3 bg-white/50 hover:bg-white focus:bg-white rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 cursor-pointer transition-all font-medium border-0 shadow-sm outline-none"
                            >
                                {durations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Budget Filter */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <Sparkles size={14} className="text-pink-500" />
                                Budget (Max)
                            </label>
                            <div className="space-y-3 px-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="50000"
                                    step="1000"
                                    value={budgetRange[1]}
                                    onChange={(e) => setBudgetRange([0, parseInt(e.target.value)])}
                                    className="w-full h-2 bg-indigo-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                                />
                                <div className="text-sm font-bold text-slate-900 bg-white/80 px-4 py-2 rounded-xl text-center shadow-sm">
                                    {budgetRange[1] === 50000 ? 'Any Budget' : `$${budgetRange[1].toLocaleString()}`}
                                </div>
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="md:col-span-2 lg:col-span-4 pt-4 border-t border-indigo-50/50">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 block flex items-center gap-2">
                                <ArrowUpDown size={14} className="text-indigo-500" />
                                Sort By
                            </label>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setSortBy('match')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${sortBy === 'match' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'}`}
                                >
                                    Best Match
                                </button>
                                <button
                                    onClick={() => setSortBy('price_low')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${sortBy === 'price_low' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'}`}
                                >
                                    Price: Low to High
                                </button>
                                <button
                                    onClick={() => setSortBy('price_high')}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${sortBy === 'price_high' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 shadow-sm'}`}
                                >
                                    Price: High to Low
                                </button>
                                {activeFilterCount > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedCountry('All');
                                            setSelectedDegree('All');
                                            setSelectedDuration('All');
                                            setBudgetRange([0, 50000]);
                                        }}
                                        className="px-4 py-2 rounded-lg text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all flex items-center gap-2 ml-auto"
                                    >
                                        <X size={14} />
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.length > 0 ? (
                    filteredPrograms.map(program => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            isGuest={isGuest}
                            isSaved={savedProgramIds.includes(program.id)}
                            onToggleSave={handleToggleSave}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-20 px-6 bg-white/60 glass-card rounded-[2rem] border-dashed border-indigo-300 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Search className="text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No programs found</h3>
                        <p className="text-slate-600 max-w-md mx-auto mb-8 font-medium">
                            We couldn't find any programs matching your search criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCountry('All'); }}
                            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
