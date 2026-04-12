import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, MapPin, X, Edit2, Trash2, Eye, Clock } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import AdminModalShell from '../../components/admin/AdminModalShell';

const toEligibilityText = (eligibility) =>
    (Array.isArray(eligibility) ? eligibility : [])
        .map(item => {
            const trimmed = String(item || '').trim();
            if (!trimmed) return '';
            return trimmed.startsWith('- ') ? trimmed : `- ${trimmed}`;
        })
        .filter(Boolean)
        .join('\n');

const fromEligibilityText = (text) =>
    String(text || '')
        .split('\n')
        .map(v => v.trim().replace(/^-+\s*/, ''))
        .filter(Boolean);

const normalizeEligibility = (eligibility) => {
    if (Array.isArray(eligibility)) return eligibility;
    if (typeof eligibility === 'string') return fromEligibilityText(eligibility);
    return [];
};

const normalizeEligibilityInput = (raw) => {
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

const formatDate = (value) => {
    if (!value) return '—';
    return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const ManagePrograms = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [programs, setPrograms] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [filters, setFilters] = useState({ countries: [], durations: [], degrees: [] });
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCountry, setFilterCountry] = useState('All');
    const [filterDegree, setFilterDegree] = useState('All');
    const [filterDuration, setFilterDuration] = useState('All');
    const [tuitionMax, setTuitionMax] = useState(null);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [sortBy, setSortBy] = useState('id');

    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [activeProgram, setActiveProgram] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const [programsData, universitiesData, filterData, currenciesData] = await Promise.all([
                api.get('/programs'),
                api.get('/programs/universities'),
                api.get('/programs/filters'),
                api.get('/programs/currencies')
            ]);
            setPrograms(programsData);
            setUniversities(universitiesData);
            setCurrencies(Array.isArray(currenciesData) && currenciesData.length ? currenciesData : ['USD']);
            setFilters({
                countries: filterData.countries || [],
                durations: filterData.durations || [],
                degrees: filterData.degrees || []
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData().catch(console.error);
    }, []);

    useEffect(() => {
        if (searchParams.get('action') === 'add') setIsModalOpen(true);
    }, [searchParams]);

    const maxTuition = useMemo(
        () => Math.max(0, ...programs.map(p => Number(p.standard_tuition ?? p.tuition_amount ?? 0))),
        [programs]
    );

    const filteredPrograms = useMemo(() => {
        return programs
            .filter((p) => {
                const tuition = Number(p.standard_tuition ?? p.tuition_amount ?? 0);
                const matchesSearch =
                    (p.program || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.university || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.field_of_study || '').toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCountry = filterCountry === 'All' || p.country === filterCountry;
                const matchesDegree = filterDegree === 'All' || p.degree_level === filterDegree;
                const matchesDuration = filterDuration === 'All' || p.duration === filterDuration;
                const matchesTuition = tuitionMax == null || tuition <= tuitionMax;
                return matchesSearch && matchesCountry && matchesDegree && matchesDuration && matchesTuition;
            })
            .sort((a, b) => {
                if (sortBy === 'price_low') return Number(a.standard_tuition ?? a.tuition_amount) - Number(b.standard_tuition ?? b.tuition_amount);
                if (sortBy === 'price_high') return Number(b.standard_tuition ?? b.tuition_amount) - Number(a.standard_tuition ?? a.tuition_amount);
                return a.id - b.id;
            });
    }, [programs, searchTerm, filterCountry, filterDegree, filterDuration, tuitionMax, sortBy]);

    const openAddModal = () => {
        setErrorMsg('');
        setActiveProgram({
            university_id: universities[0]?.id || '',
            name: '',
            degree_level: '',
            field_of_study: '',
            deadline: '',
            tuition_amount: '',
            currency: currencies[0] || 'USD',
            duration: '',
            description: '',
            eligibility: '- ',
            website: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (p) => {
        setOpenMenuId(null);
        setErrorMsg('');
        setActiveProgram({
            ...p,
            eligibility: toEligibilityText(p.eligibility)
        });
        setIsEditModalOpen(true);
    };

    const openDetailsModal = (p) => {
        setOpenMenuId(null);
        setActiveProgram(p);
        setIsDetailsModalOpen(true);
    };

    const upsertProgram = async (mode) => {
        setIsSaving(true);
        try {
            const requiredFields = [
                ['university_id', activeProgram.university_id],
                ['name', activeProgram.name],
                ['degree_level', activeProgram.degree_level],
                ['field_of_study', activeProgram.field_of_study],
                ['deadline', activeProgram.deadline],
                ['tuition_amount', activeProgram.tuition_amount],
                ['currency', activeProgram.currency],
                ['duration', activeProgram.duration],
                ['description', activeProgram.description],
                ['eligibility', activeProgram.eligibility],
                ['website', activeProgram.website]
            ];
            const missing = requiredFields.filter(([, value]) => String(value ?? '').trim() === '');
            if (missing.length > 0) {
                setErrorMsg('All fields are mandatory.');
                return;
            }
            const tuition = Number(activeProgram.tuition_amount);
            if (!Number.isFinite(tuition) || tuition <= 0) {
                setErrorMsg('Tuition amount must be a positive number.');
                return;
            }
            const payload = {
                university_id: Number(activeProgram.university_id),
                name: activeProgram.name,
                degree_level: activeProgram.degree_level,
                field_of_study: activeProgram.field_of_study,
                deadline: activeProgram.deadline || null,
                tuition_amount: tuition,
                currency: String(activeProgram.currency || 'USD').toUpperCase(),
                duration: activeProgram.duration,
                description: activeProgram.description,
                eligibility: fromEligibilityText(activeProgram.eligibility),
                website: activeProgram.website
            };
            if (mode === 'create') await api.post('/programs', payload);
            else await api.put(`/programs/${activeProgram.id}`, payload);
            await loadData();
            setIsModalOpen(false);
            setIsEditModalOpen(false);
            setActiveProgram(null);
            setSearchParams({});
            setIsSaving(false);
        } catch (err) {
            setIsSaving(false);
            setErrorMsg(err.message || 'Failed to save program');
        }
    };

    const handleDeleteProgram = async (id) => {
        try {
            await api.delete(`/programs/${id}`);
            await loadData();
            setDeleteConfirmId(null);
            setOpenMenuId(null);
        } catch (err) {
            alert(`Failed to delete program: ${err.message}`);
        }
    };

    const updateField = (key, value) => setActiveProgram(prev => ({ ...prev, [key]: value }));
    const selectedUni = universities.find(u => Number(u.id) === Number(activeProgram?.university_id));

    return (
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-row justify-between items-start md:items-center gap-4 group">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight truncate">Programs</h1>
                    <p className="text-zinc-600 font-medium text-xs md:text-sm mt-1 mb-0.5 truncate max-w-full">Manage normalized program records from database.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/12 transition-all hover:-translate-y-0.5 shrink-0"
                >
                    <Plus size={20} className="md:hidden shrink-0" />
                    <Plus size={18} className="hidden md:inline shrink-0" />
                    <span className="hidden md:inline">Add Program</span>
                </button>
            </div>

            <div className="bg-zinc-100 p-3 md:p-4 rounded-2xl border border-zinc-200 flex flex-row gap-3 md:gap-4 items-stretch">
                <div className="flex-1 relative min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, university, field..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50/80 border border-zinc-300 rounded-xl text-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
                    />
                </div>
                <div className="flex gap-2 relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="px-4 py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-700 font-bold hover:bg-zinc-200 flex items-center gap-2"
                    >
                        <Filter size={18} />
                    </button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-14 w-64 md:w-72 bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xl z-50 p-3 space-y-3 max-h-[65vh] overflow-y-auto">
                            <select value={filterCountry} onChange={(e) => setFilterCountry(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="All">All Countries</option>
                                {filters.countries.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select value={filterDegree} onChange={(e) => setFilterDegree(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="All">All Degrees</option>
                                {filters.degrees.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="All">All Durations</option>
                                {filters.durations.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm">
                                <option value="id">Default Sort</option>
                                <option value="price_high">Tuition: High to Low</option>
                                <option value="price_low">Tuition: Low to High</option>
                            </select>
                            <div>
                                <label className="text-xs text-zinc-600 font-bold">
                                    Max Standard Tuition: {(tuitionMax == null ? maxTuition : tuitionMax).toLocaleString()}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max={maxTuition || 1000}
                                    step="1000"
                                    value={tuitionMax ?? maxTuition}
                                    onChange={(e) => setTuitionMax(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <button
                                onClick={() => { setFilterCountry('All'); setFilterDegree('All'); setFilterDuration('All'); setSortBy('id'); setTuitionMax(null); setShowFilterDropdown(false); }}
                                className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {!loading && filteredPrograms.map((p) => (
                    <div key={p.id} className="group bg-zinc-100 p-5 rounded-2xl border border-zinc-200 hover:border-amber-500/30 transition-all flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <h3 className="text-lg font-bold text-zinc-900 group-hover:text-amber-600 transition-colors line-clamp-1">{p.program}</h3>
                            <div className="text-sm text-zinc-600 flex flex-wrap items-center gap-3 mt-1">
                                <span>{p.university}</span>
                                <span className="flex items-center gap-1"><MapPin size={14} />{p.city}, {p.country}</span>
                                <span className="flex items-center gap-1"><Clock size={14} />{p.duration}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-zinc-900 font-bold">{p.currency} {Number(p.tuition_amount ?? 0).toLocaleString()}</div>
                                <div className="text-[11px] text-zinc-500">USD: {Number(p.standard_tuition ?? 0).toLocaleString()}</div>
                            </div>
                            <div className="relative">
                                <button onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)} className="p-2 hover:bg-zinc-300 rounded-lg text-zinc-600">
                                    <MoreHorizontal size={20} />
                                </button>
                                {openMenuId === p.id && (
                                    <div className="absolute right-0 top-10 w-48 bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xl z-50 p-2">
                                        <button onClick={() => openDetailsModal(p)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 rounded-lg">
                                            <Eye size={16} /> See Details
                                        </button>
                                        <button onClick={() => openEditModal(p)} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-200 rounded-lg">
                                            <Edit2 size={16} /> Edit Program
                                        </button>
                                        <button onClick={() => { setDeleteConfirmId(p.id); setOpenMenuId(null); }} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={16} /> Delete Program
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {!loading && filteredPrograms.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">No programs found.</div>
                )}
            </div>

            {(isModalOpen || isEditModalOpen) && activeProgram && (
                <AdminModalShell>
                    <div className="bg-zinc-100 w-full max-w-xl rounded-xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[min(85dvh,40rem)] flex flex-col">
                        <div className="px-4 py-2.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80 shrink-0">
                            <h2 className="text-lg font-black text-zinc-900">{isModalOpen ? 'Add Program' : 'Edit Program'}</h2>
                            <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="text-zinc-500 hover:text-zinc-900 p-0.5"><X size={20} /></button>
                        </div>
                        <div className="px-4 py-3 space-y-3 overflow-y-auto">
                            {errorMsg && <div className="text-red-600 text-sm font-semibold">{errorMsg}</div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">University</label>
                                    <select
                                        value={activeProgram.university_id}
                                        disabled={isEditModalOpen}
                                        onChange={(e) => updateField('university_id', e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 disabled:bg-zinc-100 disabled:text-zinc-600 disabled:border-zinc-300 disabled:border-dashed disabled:cursor-not-allowed"
                                    >
                                        {universities.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {isEditModalOpen && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-600 mb-1">City</label>
                                            <input readOnly value={activeProgram.city || selectedUni?.city || ''} className="w-full px-3 py-2 rounded-lg bg-zinc-100 border border-dashed border-zinc-300 text-sm text-zinc-700 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-zinc-600 mb-1">Country</label>
                                            <input readOnly value={activeProgram.country || selectedUni?.country || ''} className="w-full px-3 py-2 rounded-lg bg-zinc-100 border border-dashed border-zinc-300 text-sm text-zinc-700 cursor-not-allowed" />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Name</label>
                                    <input value={activeProgram.name || ''} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Degree Level</label>
                                    <select value={activeProgram.degree_level || ''} onChange={(e) => updateField('degree_level', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900">
                                        <option value="">Select degree level</option>
                                        <option value="Masters">Masters</option>
                                        <option value="PHD">PHD</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Field of Study</label>
                                    <input value={activeProgram.field_of_study || ''} onChange={(e) => updateField('field_of_study', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Deadline</label>
                                    <input type="date" value={activeProgram.deadline ? String(activeProgram.deadline).slice(0, 10) : ''} onChange={(e) => updateField('deadline', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Tuition Amount</label>
                                    <input type="number" min="0.01" step="0.01" value={activeProgram.tuition_amount ?? ''} onChange={(e) => updateField('tuition_amount', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Currency</label>
                                    <select value={activeProgram.currency || 'USD'} onChange={(e) => updateField('currency', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900">
                                        {currencies.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Duration (Years)</label>
                                    <input value={activeProgram.duration || ''} onChange={(e) => updateField('duration', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-600 mb-1">Website</label>
                                    <input type="url" value={activeProgram.website || ''} onChange={(e) => updateField('website', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-600 mb-1">Description</label>
                                <textarea rows={2} value={activeProgram.description || ''} onChange={(e) => updateField('description', e.target.value)} className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-600 mb-1">Eligibility (one rule per line)</label>
                                <textarea
                                    rows={3}
                                    value={activeProgram.eligibility || '- '}
                                    onChange={(e) => updateField('eligibility', normalizeEligibilityInput(e.target.value))}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            const value = activeProgram.eligibility || '';
                                            if (!value.endsWith('\n')) {
                                                e.preventDefault();
                                                updateField('eligibility', `${value}\n- `);
                                            }
                                        }
                                    }}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900 resize-none"
                                />
                            </div>
                            <div className="pt-1 flex gap-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); }} className="flex-1 py-2 rounded-lg bg-zinc-200 text-sm text-zinc-700 font-bold hover:bg-zinc-300">Cancel</button>
                                <button type="button" onClick={() => upsertProgram(isModalOpen ? 'create' : 'update')} className="flex-1 py-2 rounded-lg bg-amber-500 text-sm text-black font-bold hover:bg-amber-400">
                                    {isModalOpen ? 'Create Program' : 'Update Program'}
                                </button>
                            </div>
                        </div>
                    </div>
                </AdminModalShell>
            )}

            {isDetailsModalOpen && activeProgram && (
                <AdminModalShell>
                    <div className="bg-zinc-100 w-full max-w-lg rounded-xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[min(85dvh,36rem)] flex flex-col">
                        <div className="px-4 py-2.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80 shrink-0">
                            <h2 className="text-base font-black text-zinc-900">Program Details</h2>
                            <button type="button" onClick={() => setIsDetailsModalOpen(false)} className="text-zinc-500 hover:text-zinc-900 p-0.5"><X size={20} /></button>
                        </div>
                        <div className="px-4 py-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs overflow-y-auto">
                            <div className="text-zinc-700"><span className="text-zinc-500">Name:</span> {activeProgram.program}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">University:</span> {activeProgram.university}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">City:</span> {activeProgram.city}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Country:</span> {activeProgram.country}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Degree:</span> {activeProgram.degree_level}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Field:</span> {activeProgram.field_of_study}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Deadline:</span> {formatDate(activeProgram.deadline)}</div>
                            <div className="text-zinc-700"><span className="text-zinc-500">Tuition:</span> {activeProgram.currency} {Number(activeProgram.tuition_amount ?? 0).toLocaleString()}</div>
                            <div className="text-zinc-700 col-span-2"><span className="text-zinc-500">Duration:</span> {activeProgram.duration}</div>
                            <div className="text-zinc-700 col-span-2">
                                <span className="text-zinc-500">Website:</span>{' '}
                                {activeProgram.website ? (
                                    <a
                                        href={activeProgram.website}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-amber-700 hover:text-amber-600 underline break-all"
                                    >
                                        {activeProgram.website}
                                    </a>
                                ) : '—'}
                            </div>
                            <div className="text-zinc-700 col-span-2"><span className="text-zinc-500">Description:</span> {activeProgram.description || '—'}</div>
                            <div className="text-zinc-700 col-span-2">
                                <span className="text-zinc-500 block mb-2">Eligibility:</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {normalizeEligibility(activeProgram.eligibility).length > 0 ? (
                                        normalizeEligibility(activeProgram.eligibility).map((item, idx) => (
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
                onConfirm={() => handleDeleteProgram(deleteConfirmId)}
                title="Delete program?"
                confirmText="Delete"
                cancelText="Cancel"
                message="This action cannot be undone. Are you sure you want to delete this program?"
            />
        </div>
    );
};

export default ManagePrograms;
