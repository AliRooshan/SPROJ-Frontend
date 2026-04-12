import React, { useState, useEffect } from 'react';
import { Search, Filter, Award, MapPin, Building2, Calendar, DollarSign, Bookmark, ChevronDown, Check, ArrowUpDown, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import AuthService from '../../services/AuthService';
import api from '../../services/api';


const Scholarships = () => {
    const navigate = useNavigate();
    const [scholarships, setScholarships] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [showFilters, setShowFilters] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filterOptions, setFilterOptions] = useState({ countries: [], types: [] });
    const [savedIds, setSavedIds] = useState(new Set());
    const user = AuthService.getCurrentUser();

    const getScholarshipPrice = (scholarship) => Number(
        scholarship.standard_amount ?? scholarship.amount ?? 0
    );
    const toTitleCase = (value = '') =>
        String(value).charAt(0).toUpperCase() + String(value).slice(1).toLowerCase();

    useEffect(() => {
        api.get('/scholarships/filters')
            .then(data => setFilterOptions({
                countries: data.countries || [],
                types: data.types || []
            }))
            .catch(err => console.error('Failed to load scholarship filters:', err));

        api.get('/scholarships')
            .then(data => {
                setScholarships(data);
                if (user) {
                    const saved = new Set(data.filter(s => AuthService.isScholarshipSaved(s.id)).map(s => s.id));
                    setSavedIds(saved);
                }
            })
            .catch(err => console.error('Failed to load scholarships:', err));
    }, []);

    const handleToggleSave = async (e, scholarship) => {
        e.stopPropagation();
        if (!user) return;
        try {
            const newState = await AuthService.toggleSavedScholarship(scholarship);
            setSavedIds(prev => {
                const next = new Set(prev);
                newState ? next.add(scholarship.id) : next.delete(scholarship.id);
                return next;
            });
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };

    // Get unique types and countries for filter
    const types = ['All', ...filterOptions.types.map(t => toTitleCase(t))];
    const countries = ['All', ...filterOptions.countries];

    const filtered = scholarships.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.provider && s.provider.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (s.country || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedTypes.length === 0 ||
            selectedTypes.some(t => t.toLowerCase() === String(s.type || '').toLowerCase());
        const matchesCountry = selectedCountries.length === 0 || selectedCountries.includes(s.country);
        return matchesSearch && matchesType && matchesCountry;
    }).sort((a, b) => {
        let amountA = getScholarshipPrice(a);
        let amountB = getScholarshipPrice(b);
        if (sortBy === 'amount_high') return amountB - amountA;
        if (sortBy === 'amount_low') return amountA - amountB;
        return a.id - b.id;
    });

    const activeFilterCount = selectedCountries.length + selectedTypes.length;

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-500">
            <PageHeader
                title="Scholarships"
                subtitle="Discover funding opportunities tailored for your profile"
                icon={Award}
                actions={
                    <div className="flex flex-col w-full gap-2 md:flex-row md:items-center md:gap-3 md:w-auto">
                        {/* Compact Search Bar */}
                        <div className="relative w-full max-w-xs sm:max-w-none sm:w-64 group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="text-indigo-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 py-2.5 bg-indigo-50/95 hover:bg-white focus:bg-white text-indigo-950 placeholder-indigo-600 rounded-xl outline-none transition-all text-sm font-bold shadow-md focus:shadow-lg"
                            />
                        </div>

                        {/* Compact Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`p-2.5 rounded-xl transition-all relative flex items-center justify-center shadow-md hover:shadow-lg ${showFilters ? 'bg-white text-indigo-700' : 'bg-indigo-50/95 text-indigo-900 hover:bg-white'}`}
                            title="Filters"
                        >
                            <Filter size={18} />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>
                }
            />

            {/* Filters Panel */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 relative z-40 animate-in slide-in-from-top-2 duration-200">
                    {/* Transparent overlay for dismiss */}
                    {activeDropdown && (
                        <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    )}

                    {/* Country Pill */}
                    <div className="relative z-40">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'country' ? null : 'country')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${selectedCountries.length > 0 || activeDropdown === 'country' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <MapPin size={14} />
                            Country {selectedCountries.length > 0 && `(${selectedCountries.length})`}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'country' ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {activeDropdown === 'country' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                {countries.filter(c => c !== 'All').map(c => (
                                    <label key={c} onClick={(e) => {
                                        e.preventDefault();
                                        if (selectedCountries.includes(c)) setSelectedCountries(selectedCountries.filter(x => x !== c));
                                        else setSelectedCountries([...selectedCountries, c]);
                                    }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedCountries.includes(c) ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                            {selectedCountries.includes(c) && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 leading-none">{c}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Type Pill */}
                    <div className="relative z-40">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${selectedTypes.length > 0 || activeDropdown === 'type' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <Award size={14} />
                            Type {selectedTypes.length > 0 && `(${selectedTypes.length})`}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'type' ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {activeDropdown === 'type' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                {types.filter(c => c !== 'All').map(t => (
                                    <label key={t} onClick={(e) => {
                                        e.preventDefault();
                                        if (selectedTypes.includes(t)) setSelectedTypes(selectedTypes.filter(x => x !== t));
                                        else setSelectedTypes([...selectedTypes, t]);
                                    }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedTypes.includes(t) ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                            {selectedTypes.includes(t) && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 leading-none">{t}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sort Pill */}
                    <div className="relative z-40">
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${sortBy !== 'id' || activeDropdown === 'sort' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <ArrowUpDown size={14} />
                            Sort: {sortBy === 'amount_high' ? 'Amount: High to Low' : sortBy === 'amount_low' ? 'Amount: Low to High' : 'Default'}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {activeDropdown === 'sort' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-150">
                                {[
                                    { id: 'id', label: 'Default' },
                                    { id: 'amount_high', label: 'Amount: High to Low' },
                                    { id: 'amount_low', label: 'Amount: Low to High' }
                                ].map(option => (
                                    <label key={option.id} onClick={() => setSortBy(option.id)} className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <span className={`text-sm font-semibold leading-none ${sortBy === option.id ? 'text-purple-700' : 'text-slate-700'}`}>{option.label}</span>
                                        <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${sortBy === option.id ? 'border-purple-600' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                            {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-purple-600" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {/* Clear Filters (if any) */}
                    {activeFilterCount > 0 && (
                        <button
                            onClick={() => {
                                setSelectedCountries([]);
                                setSelectedTypes([]);
                                setSortBy('id');
                                setActiveDropdown(null);
                            }}
                            className="ml-auto flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                            title="Clear Filters"
                        >
                            <X size={14} strokeWidth={3} />
                            Reset
                        </button>
                    )}
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filtered.length > 0 ? (
                    filtered.map(item => {
                        return (
                            <div key={item.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 p-4 space-y-3 group flex flex-col">
                                {/* Header: Provider & Save */}
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                        <Building2 size={16} className="text-indigo-500" />
                                        <span className="line-clamp-1">{item.provider}</span>
                                    </div>
                                    {user && (
                                        <button
                                            onClick={(e) => handleToggleSave(e, item)}
                                            className={`p-2 rounded-xl transition-all shrink-0 ${savedIds.has(item.id) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
                                        >
                                            <Bookmark size={18} fill={savedIds.has(item.id) ? 'currentColor' : 'none'} />
                                        </button>
                                    )}
                                </div>

                                {/* Title (Clickable) */}
                                <div className="flex-grow">
                                    <h3
                                        onClick={() => navigate(`/student/scholarships/${item.id}`)}
                                        className="text-lg font-black text-slate-900 leading-tight cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                                    >
                                        {item.name}
                                    </h3>
                                </div>

                                {/* Meta Info */}
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <MapPin size={16} className="text-slate-400" />
                                        <span className="truncate">{item.country}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <Award size={16} className="text-slate-400" />
                                        <span className="truncate">{toTitleCase(item.type)}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <DollarSign size={16} className="text-slate-400" />
                                        <span className="truncate">{item.currency || ''} {Number(item.amount ?? 0).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                        <Calendar size={16} className="text-slate-400" />
                                        <span className="truncate">{item.deadline}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full py-10 px-4 md:py-20 md:px-6 bg-white/60 glass-card rounded-[2rem] border-dashed border-indigo-300 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Search className="text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No scholarships found</h3>
                        <p className="text-slate-600 max-w-md mx-auto mb-4 md:mb-8 text-sm md:text-base font-medium">
                            We couldn't find any scholarships matching your search criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCountries([]); setSelectedTypes([]); }}
                            className="px-5 py-2.5 md:px-8 md:py-3 text-sm md:text-base bg-indigo-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scholarships;