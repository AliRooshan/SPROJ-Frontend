import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, SlidersHorizontal, ArrowUpDown, X, Clock, DollarSign, Compass, ChevronDown, Check } from 'lucide-react';
import ProgramCard from '../../components/ProgramCard';
import PageHeader from '../../components/PageHeader';
import AuthService from '../../services/AuthService';
import api from '../../services/api';
import Pagination from '../../components/Pagination';

const Explore = ({ isGuest = false }) => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOptions, setFilterOptions] = useState({ countries: [], durations: [], degrees: [] });
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedDegrees, setSelectedDegrees] = useState([]);
    const [selectedDurations, setSelectedDurations] = useState([]);
    const [budgetRange, setBudgetRange] = useState([0, 50000]);
    const [maxBudget, setMaxBudget] = useState(50000);
    const [showFilters, setShowFilters] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [sortBy, setSortBy] = useState('id');
    const [savedProgramIds, setSavedProgramIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const getProgramPrice = (program) => Number(
        program.standard_tuition ?? program.tuition ?? program.tuition_amount ?? 0
    );

    // 1. Fetch initial filter constraints on mount
    useEffect(() => {
        api.get('/programs/filters')
            .then(data => {
                setFilterOptions({
                    countries: data.countries || [],
                    durations: data.durations || [],
                    degrees: data.degrees || []
                });
                if (data.maxTuition) {
                    setMaxBudget(data.maxTuition);
                    setBudgetRange([0, data.maxTuition]);
                }
            })
            .catch(err => console.error('Failed to load filters:', err));

        if (!isGuest) {
            AuthService.getSavedPrograms()
                .then(saved => {
                    setSavedProgramIds(saved.map(p => p.program_id ?? p.id));
                })
                .catch(() => {
                    const currentUser = AuthService.getCurrentUser();
                    if (currentUser) {
                        setSavedProgramIds((currentUser.savedPrograms ?? []).map(p => p.program_id ?? p.id));
                    }
                });
        }
    }, []);

    // Reset page to 1 when filters change (except page itself)
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedCountries, selectedDegrees, selectedDurations, budgetRange, sortBy]);

    // 2. Fetch paginated data dynamically
    useEffect(() => {
        let active = true;
        setLoading(true);

        const queryParams = new URLSearchParams({
            page: currentPage,
            limit: 15,
            search: searchTerm,
            countries: selectedCountries.join(','),
            degrees: selectedDegrees.join(','),
            durations: selectedDurations.join(','),
            tuition_min: budgetRange[0],
            tuition_max: budgetRange[1],
            sort_by: sortBy
        });

        api.get(`/programs?${queryParams.toString()}`)
            .then(data => {
                if (active) {
                    setPrograms(data.results || []);
                    setTotalPages(data.totalPages || 1);
                    setTotalCount(data.total || 0);
                    setLoading(false);
                }
            })
            .catch(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [currentPage, searchTerm, selectedCountries, selectedDegrees, selectedDurations, budgetRange, sortBy]);

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

    const countries = ['All', ...filterOptions.countries];
    const degrees = ['All', ...filterOptions.degrees];
    const durations = ['All', ...filterOptions.durations];

    const activeFilterCount = selectedCountries.length + selectedDegrees.length + selectedDurations.length + (budgetRange[0] !== 0 || budgetRange[1] !== maxBudget ? 1 : 0);

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-500">
            <PageHeader
                title="Explore Programs"
                subtitle="Discover and compare academic programs worldwide"
                icon={Compass}
                actions={
                    <div className="flex flex-row items-center w-full gap-2 md:gap-3 md:w-auto">
                        {/* Compact Search Bar */}
                        <div className="relative flex-1 min-w-0 md:w-64 group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="text-indigo-500 group-focus-within:text-indigo-600 transition-colors" size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-4 h-11 md:h-[46px] bg-indigo-50/95 hover:bg-white focus:bg-white text-indigo-950 placeholder-indigo-600 rounded-xl outline-none transition-all text-sm font-bold shadow-md focus:shadow-lg"
                            />
                        </div>
                        {/* Compact Filter Button (Icon only) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`h-11 w-11 md:h-[46px] md:w-[46px] !p-0 rounded-xl transition-all relative flex items-center justify-center shadow-md hover:shadow-lg shrink-0 ${showFilters ? 'bg-white text-indigo-700' : 'bg-indigo-50/95 text-indigo-900 hover:bg-white'}`}
                            title="Filters"
                        >
                            <Filter size={20} />
                            {activeFilterCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>

                    </div>
                }
            />

            {/* Expanded Filters Panel (Pills) */}
            {showFilters && (
                <div className="flex flex-wrap items-center gap-3 relative z-40 animate-in slide-in-from-top-2 duration-200">
                    {/* Transparent overlay for dismiss */}
                    {activeDropdown && (
                        <div className="fixed inset-0 z-30" onClick={() => setActiveDropdown(null)} />
                    )}

                    {/* Country Pill */}
                    <div className={`relative ${activeDropdown === 'country' ? 'z-50' : 'z-40'}`}>
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

                    {/* Degree Pill */}
                    <div className={`relative ${activeDropdown === 'degree' ? 'z-50' : 'z-40'}`}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'degree' ? null : 'degree')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${selectedDegrees.length > 0 || activeDropdown === 'degree' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <SlidersHorizontal size={14} />
                            Degree {selectedDegrees.length > 0 && `(${selectedDegrees.length})`}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'degree' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'degree' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                {/* All option */}
                                <label onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedDegrees([]);
                                }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedDegrees.length === 0 ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                        {selectedDegrees.length === 0 && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 leading-none">All</span>
                                </label>

                                {degrees.filter(c => c !== 'All').map(d => (
                                    <label key={d} onClick={(e) => {
                                        e.preventDefault();
                                        if (selectedDegrees.includes(d)) setSelectedDegrees(selectedDegrees.filter(x => x !== d));
                                        else setSelectedDegrees([...selectedDegrees, d]);
                                    }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedDegrees.includes(d) ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                            {selectedDegrees.includes(d) && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 leading-none">{d}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Duration Pill */}
                    <div className={`relative ${activeDropdown === 'duration' ? 'z-50' : 'z-40'}`}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'duration' ? null : 'duration')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${selectedDurations.length > 0 || activeDropdown === 'duration' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <Clock size={14} />
                            Duration {selectedDurations.length > 0 && `(${selectedDurations.length})`}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'duration' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'duration' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                                {/* All option */}
                                <label onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedDurations([]);
                                }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                    <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedDurations.length === 0 ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                        {selectedDurations.length === 0 && <Check size={12} strokeWidth={3} />}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 leading-none">All</span>
                                </label>

                                {durations.filter(c => c !== 'All').map(d => (
                                    <label key={d} onClick={(e) => {
                                        e.preventDefault();
                                        if (selectedDurations.includes(d)) setSelectedDurations(selectedDurations.filter(x => x !== d));
                                        else setSelectedDurations([...selectedDurations, d]);
                                    }} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group transition-colors select-none">
                                        <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors shrink-0 ${selectedDurations.includes(d) ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 group-hover:border-purple-400'}`}>
                                            {selectedDurations.includes(d) && <Check size={12} strokeWidth={3} />}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 leading-none">{d}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Budget Pill */}
                    <div className={`relative ${activeDropdown === 'budget' ? 'z-50' : 'z-40'}`}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${(budgetRange[0] !== 0 || budgetRange[1] !== maxBudget) || activeDropdown === 'budget' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <DollarSign size={14} />
                            Budget {budgetRange[1] !== maxBudget && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 ml-0.5"></span>}
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'budget' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'budget' && (
                            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-5 animate-in fade-in zoom-in-95 duration-150">
                                <input
                                    type="range"
                                    min="0"
                                    max={maxBudget || 1000}
                                    step="1000"
                                    value={budgetRange[1]}
                                    onChange={(e) => setBudgetRange([0, parseInt(e.target.value)])}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600 mb-5 border border-slate-200"
                                />
                                <div className="text-sm font-bold text-purple-700 bg-purple-50 px-4 py-2.5 rounded-xl text-center border border-purple-100">
                                    {budgetRange[1] === maxBudget ? 'Max' : `Up to $${budgetRange[1].toLocaleString()}`}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Pill */}
                    <div className={`relative ${activeDropdown === 'sort' ? 'z-50' : 'z-40'}`}>
                        <button
                            onClick={() => setActiveDropdown(activeDropdown === 'sort' ? null : 'sort')}
                            className={`flex items-center gap-2 px-4 h-[40px] rounded-full text-sm font-bold transition-all border outline-none ${sortBy !== 'id' || activeDropdown === 'sort' ? 'bg-purple-100 border-purple-200 text-purple-700 shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}
                        >
                            <ArrowUpDown size={14} />
                            Sort: {
                                sortBy === 'match_high' ? 'Match: High to Low' :
                                sortBy === 'match_low' ? 'Match: Low to High' :
                                sortBy === 'price_low' ? 'Price: Low to High' :
                                sortBy === 'price_high' ? 'Price: High to Low' : 'Default'
                            }
                            <ChevronDown size={14} className={`transition-transform opacity-70 ml-0.5 ${activeDropdown === 'sort' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeDropdown === 'sort' && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white flex flex-col rounded-2xl shadow-xl shadow-slate-200 border border-slate-100 p-2 animate-in fade-in zoom-in-95 duration-150">
                                {[
                                    { id: 'id', label: 'Default' },
                                    ...(!isGuest ? [
                                        { id: 'match_high', label: 'Match: High to Low' },
                                        { id: 'match_low', label: 'Match: Low to High' }
                                    ] : []),
                                    { id: 'price_low', label: 'Price: Low to High' },
                                    { id: 'price_high', label: 'Price: High to Low' }
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
                                setSelectedDegrees([]);
                                setSelectedDurations([]);
                                setBudgetRange([0, maxBudget]);
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

            {/* Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {loading ? (
                    // Show 6 elegant animated skeleton cards
                    Array.from({ length: 6 }).map((_, idx) => (
                        <div key={`skeleton-${idx}`} className="bg-white/40 rounded-[2rem] border border-slate-100 p-6 space-y-4 animate-pulse shadow-sm">
                            <div className="h-4 bg-slate-200 rounded w-1/3" />
                            <div className="h-6 bg-slate-200 rounded w-3/4" />
                            <div className="space-y-2 pt-4">
                                <div className="h-4 bg-slate-200 rounded w-5/6" />
                                <div className="h-4 bg-slate-200 rounded w-1/2" />
                            </div>
                        </div>
                    ))
                ) : programs.length > 0 ? (
                    programs.map(program => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            isGuest={isGuest}
                            isSaved={savedProgramIds.includes(program.id)}
                            onToggleSave={handleToggleSave}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-10 px-4 md:py-20 md:px-6 bg-white/60 glass-card rounded-[2rem] border-dashed border-indigo-300 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <Search className="text-indigo-400" size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No programs found</h3>
                        <p className="text-slate-600 max-w-md mx-auto mb-4 md:mb-8 text-sm md:text-base font-medium">
                            We couldn't find any programs matching your search criteria. Try adjusting your filters or search terms.
                        </p>
                        <button
                            onClick={() => { setSearchTerm(''); setSelectedCountries([]); setSelectedDegrees([]); }}
                            className="px-5 py-2.5 md:px-8 md:py-3 text-sm md:text-base bg-indigo-600 text-white font-bold rounded-lg md:rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Explore;
