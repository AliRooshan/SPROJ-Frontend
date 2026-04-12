import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, X, Edit2, Trash2, Eye, Clock, Globe } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import AdminModalShell from '../../components/admin/AdminModalShell';

const toRequirementsText = (requirements) =>
    (Array.isArray(requirements) ? requirements : [])
        .map((item) => {
            const trimmed = String(item || '').trim();
            if (!trimmed) return '';
            return trimmed.startsWith('- ') ? trimmed : `- ${trimmed}`;
        })
        .filter(Boolean)
        .join('\n');

const fromRequirementsText = (text) =>
    String(text || '')
        .split('\n')
        .map((v) => v.trim().replace(/^-+\s*/, ''))
        .filter(Boolean);

const normalizeRequirementsInput = (raw) => {
    const lines = String(raw || '').split('\n');
    return lines
        .map((line) => {
            const trimmed = line.trim();
            if (!trimmed) return '- ';
            if (trimmed.startsWith('- ')) return trimmed;
            return `- ${trimmed.replace(/^-+\s*/, '')}`;
        })
        .join('\n');
};

const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ManageScholarships = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [scholarships, setScholarships] = useState([]);
    const [filters, setFilters] = useState({ countries: [], types: [] });
    const [countries, setCountries] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('All');
    const [filterType, setFilterType] = useState('All');
    const [amountMax, setAmountMax] = useState(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [sortBy, setSortBy] = useState('id');

    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [activeScholarship, setActiveScholarship] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    const loadData = async () => {
        setLoading(true);
        try {
            const [schData, filtersData, countriesData, currenciesData] = await Promise.all([
                api.get('/scholarships'),
                api.get('/scholarships/filters'),
                api.get('/scholarships/countries'),
                api.get('/scholarships/currencies')
            ]);
            setScholarships(schData);
            setFilters({
                countries: filtersData.countries || [],
                types: filtersData.types || []
            });
            setCountries(countriesData || []);
            setCurrencies(Array.isArray(currenciesData) && currenciesData.length ? currenciesData : ['USD']);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData().catch(console.error);
    }, []);

    useEffect(() => {
        if (searchParams.get('action') === 'add') openAddModal();
    }, [searchParams, countries, currencies]);

    const maxAmount = useMemo(
        () => Math.max(0, ...scholarships.map(s => Number(s.standard_amount ?? s.amount ?? 0))),
        [scholarships]
    );

    const filteredScholarships = useMemo(() => {
        return scholarships
            .filter((s) => {
                const amount = Number(s.standard_amount ?? s.amount ?? 0);
                const matchesSearch =
                    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (s.provider || '').toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCountry = filterCountry === 'All' || s.country === filterCountry;
                const matchesType = filterType === 'All' || s.type === filterType;
                const matchesAmount = amountMax == null || amount <= amountMax;
                return matchesSearch && matchesCountry && matchesType && matchesAmount;
            })
            .sort((a, b) => {
                if (sortBy === 'amount_low') return Number(a.standard_amount ?? a.amount) - Number(b.standard_amount ?? b.amount);
                if (sortBy === 'amount_high') return Number(b.standard_amount ?? b.amount) - Number(a.standard_amount ?? a.amount);
                return a.id - b.id;
            });
    }, [scholarships, searchTerm, filterCountry, filterType, amountMax, sortBy]);

    const openAddModal = () => {
        setErrorMsg('');
        setActiveScholarship({
            name: '',
            provider: '',
            amount: '',
            deadline: '',
            country_id: countries[0]?.id || '',
            type: '',
            description: '',
            requirements: '- ',
            website: '',
            currency: currencies[0] || 'USD'
        });
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setOpenMenuId(null);
        setErrorMsg('');
        const countryId = countries.find(c => c.name === item.country)?.id || '';
        setActiveScholarship({
            ...item,
            country_id: countryId,
            requirements: toRequirementsText(item.requirements)
        });
        setIsEditModalOpen(true);
    };

    const openDetailsModal = (item) => {
        setOpenMenuId(null);
        setActiveScholarship(item);
        setIsDetailsModalOpen(true);
    };

    const upsertScholarship = async (mode) => {
        try {
            const requiredFields = [
                activeScholarship.name, activeScholarship.provider, activeScholarship.amount, activeScholarship.deadline,
                activeScholarship.country_id, activeScholarship.type, activeScholarship.description,
                activeScholarship.requirements, activeScholarship.website, activeScholarship.currency
            ];
            if (requiredFields.some(v => String(v ?? '').trim() === '')) {
                setErrorMsg('All fields are mandatory.');
                return;
            }
            const amount = Number(activeScholarship.amount);
            if (!Number.isFinite(amount) || amount <= 0) {
                setErrorMsg('Amount must be a positive number.');
                return;
            }

            const payload = {
                name: activeScholarship.name,
                provider: activeScholarship.provider,
                amount,
                deadline: activeScholarship.deadline,
                country_id: Number(activeScholarship.country_id),
                type: activeScholarship.type,
                description: activeScholarship.description,
                requirements: fromRequirementsText(activeScholarship.requirements),
                website: activeScholarship.website,
                currency: activeScholarship.currency
            };
            if (mode === 'create') await api.post('/scholarships', payload);
            else await api.put(`/scholarships/${activeScholarship.id}`, payload);
            await loadData();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            setActiveScholarship(null);
            setSearchParams({});
        } catch (err) {
            setErrorMsg(err.message || 'Failed to save scholarship');
        }
    };

    const handleDeleteScholarship = async (id) => {
        try {
            await api.delete(`/scholarships/${id}`);
            await loadData();
            setDeleteConfirmId(null);
            setOpenMenuId(null);
        } catch (err) {
            alert(`Failed to delete scholarship: ${err.message}`);
        }
    };

    const updateField = (key, value) => setActiveScholarship(prev => ({ ...prev, [key]: value }));

    return (
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-row justify-between items-start md:items-center gap-4 group">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight truncate">Scholarships</h1>
                    <p className="text-zinc-600 font-medium text-xs md:text-sm mt-1 mb-0.5 truncate max-w-full">Manage normalized scholarship records from database.</p>
                </div>
                <button 
                    onClick={openAddModal} 
                    className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/12 transition-all hover:-translate-y-0.5 shrink-0"
                >
                    <Plus size={20} className="md:hidden shrink-0" />
                    <Plus size={18} className="hidden md:inline shrink-0" />
                    <span className="hidden md:inline">Add Scholarship</span>
                </button>
            </div>

            <div className="bg-zinc-100 p-3 md:p-4 rounded-2xl border border-zinc-200 flex flex-row gap-3 md:gap-4 items-stretch">
                <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input type="text" placeholder="Search by name, provider..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-zinc-50/80 border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50" />
                </div>
                <div className="flex gap-2 relative">
                    <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className="px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-700 font-bold hover:bg-zinc-200 flex items-center gap-2">
                        <Filter size={18} />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-14 w-64 md:w-72 bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xl z-50 p-3 space-y-3 max-h-[65vh] overflow-y-auto">
                            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="All">All Countries</option>
                                {filters.countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="All">All Types</option>
                                {filters.types.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="id">Default Sort</option>
                                <option value="amount_high">Amount: High to Low</option>
                                <option value="amount_low">Amount: Low to High</option>
                            </select>
                            <div>
                                <label className="text-xs text-zinc-600 font-bold">
                                    Max Standard Amount: {(amountMax == null ? maxAmount : amountMax).toLocaleString()}
                                </label>
                                <input type="range" min="0" max={maxAmount || 1000} step="1000" value={amountMax ?? maxAmount} onChange={(e) => setAmountMax(Number(e.target.value))} className="w-full" />
                            </div>
                            <button onClick={() => { setFilterCountry('All'); setFilterType('All'); setSortBy('id'); setAmountMax(null); setShowFilterDropdown(false); }} className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg">
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {!loading && filteredScholarships.map((s) => (
                    <div key={s.id} className="group bg-zinc-100 p-5 rounded-2xl border border-zinc-200 hover:border-amber-500/30 transition-all flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">{s.name}</h3>
                            <div className="text-sm text-zinc-600 flex flex-wrap items-center gap-3 mt-1">
                                <span>{s.provider}</span>
                                <span className="flex items-center gap-1"><Globe size={14} />{s.country}</span>
                                <span className="flex items-center gap-1"><Clock size={14} />{formatDate(s.deadline)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-zinc-900 font-bold">{s.currency} {Number(s.amount ?? 0).toLocaleString()}</div>
                                <div className="text-[11px] text-zinc-500">USD: {Number(s.standard_amount ?? 0).toLocaleString()}</div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)} className="p-2 hover:bg-zinc-300 rounded-lg text-zinc-600">
                                    <MoreHorizontal size={20} />
                                </button>
                                {openMenuId === s.id && (
                                    <div className="absolute right-0 top-10 w-48 bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xl z-50 p-2">
                                        <button onClick={() => openDetailsModal(s)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 rounded-lg">
                                            <Eye size={16} /> See Details
                                        </button>
                                        <button onClick={() => openEditModal(s)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 rounded-lg">
                                            <Edit2 size={16} /> Edit
                                        </button>
                                        <button onClick={() => { setDeleteConfirmId(s.id); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && filteredScholarships.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">No scholarships found.</div>
                )}
            </div>

            {(isModalOpen || isEditModalOpen) && activeScholarship && (
                <AdminModalShell>
                    <div className="bg-zinc-100 w-full max-w-xl rounded-xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[min(85dvh,40rem)] flex flex-col">
                        <div className="px-4 py-2.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80 shrink-0">
                            <h2 className="text-lg font-black text-zinc-900">{isModalOpen ? 'Add Scholarship' : 'Edit Scholarship'}</h2>
                            <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="text-zinc-500 hover:text-zinc-900 p-0.5"><X size={20} /></button>
                        </div>
                        <div className="px-4 py-3 space-y-3 overflow-y-auto">
                            {errorMsg && <div className="text-red-600 text-sm font-semibold">{errorMsg}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Name</label>
                                    <input value={activeScholarship.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Provider</label>
                                    <input value={activeScholarship.provider || ''} onChange={(e) => updateField('provider', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Amount</label>
                                    <input type="number" min="0.01" step="0.01" value={activeScholarship.amount ?? ''} onChange={(e) => updateField('amount', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Currency</label>
                                    <select value={activeScholarship.currency || 'USD'} onChange={(e) => updateField('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900">
                                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Deadline</label>
                                    <input type="date" value={activeScholarship.deadline ? String(activeScholarship.deadline).slice(0, 10) : ''} onChange={(e) => updateField('deadline', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Country</label>
                                    <select value={activeScholarship.country_id || ''} onChange={(e) => updateField('country_id', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900">
                                        <option value="">Select country</option>
                                        {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Type</label>
                                    <input value={activeScholarship.type || ''} onChange={(e) => updateField('type', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Website</label>
                                    <input type="url" value={activeScholarship.website || ''} onChange={(e) => updateField('website', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-600 mb-1">Description</label>
                                <textarea rows={2} value={activeScholarship.description || ''} onChange={(e) => updateField('description', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-600 mb-1">Requirements (one rule per line)</label>
                                <textarea
                                    rows={3}
                                    value={activeScholarship.requirements || '- '}
                                    onChange={(e) => updateField('requirements', normalizeRequirementsInput(e.target.value))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const value = activeScholarship.requirements || '';
                                            if (!value.endsWith('\n')) {
                                                e.preventDefault();
                                                updateField('requirements', `${value}\n- `);
                                            }
                                        }
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 resize-none"
                                />
                            </div>
                            <div className="pt-1 flex gap-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-2 rounded-lg bg-zinc-200 text-sm text-zinc-700 font-bold hover:bg-zinc-300">Cancel</button>
                                <button type="button" onClick={() => upsertScholarship(isModalOpen ? 'create' : 'update')} className="flex-1 py-2 rounded-lg bg-amber-500 text-sm text-black font-bold hover:bg-amber-400">
                                    {isModalOpen ? 'Create Scholarship' : 'Update Scholarship'}
                                </button>
                            </div>
                        </div>
                    </div>
                </AdminModalShell>
            )}

            {isDetailsModalOpen && activeScholarship && (
                <AdminModalShell>
                    <div className="bg-zinc-100 w-full max-w-lg rounded-xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[min(85dvh,36rem)] flex flex-col">
                        <div className="px-4 py-2.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80 shrink-0">
                            <h2 className="text-base font-black text-zinc-900">Scholarship Details</h2>
                            <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 p-0.5"><X size={20} /></button>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs overflow-y-auto">
                            <div className="text-zinc-700"><span className="text-zinc-500">Name:</span> {activeScholarship.name}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Provider:</span> {activeScholarship.provider}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Country:</span> {activeScholarship.country}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Type:</span> {activeScholarship.type}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Deadline:</span> {formatDate(activeScholarship.deadline)}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Amount:</span> {activeScholarship.currency} {Number(activeScholarship.amount ?? 0).toLocaleString()}</div>
                            <div className="text-zinc-700 col-span-2">
                                <span className="text-zinc-500">Website:</span>{' '}
                                {activeScholarship.website ? (
                                    <a href={activeScholarship.website} target="_blank" rel="noreferrer" className="text-amber-700 hover:text-amber-600 underline break-all">
                                        {activeScholarship.website}
                                    </a>
                                ) : '—'}
                            </div>
                            <div className="text-zinc-700 col-span-2"><span className="text-zinc-500">Description:</span> {activeScholarship.description || '—'}</div>
                            <div className="text-zinc-700 col-span-2">
                                <span className="text-zinc-500 block mb-2">Requirements:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {(Array.isArray(activeScholarship.requirements) ? activeScholarship.requirements : []).length > 0 ? (
                                        (Array.isArray(activeScholarship.requirements) ? activeScholarship.requirements : []).map((item, idx) => (
                                            <span key={`${item}-${idx}`} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-200 border border-zinc-300 text-zinc-800 text-[11px]">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                {item}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-zinc-600">—</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </AdminModalShell>
            )}

            <ConfirmDialog
                isOpen={deleteConfirmId != null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={() => handleDeleteScholarship(deleteConfirmId)}
                title="Delete scholarship?"
                confirmText="Delete"
                cancelText="Cancel"
                message="This action cannot be undone. Are you sure you want to delete this scholarship?"
            />
        </div>
    );
};

export default ManageScholarships;
