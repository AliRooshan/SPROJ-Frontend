import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Save, MapPin, Plus, X, Filter, Trash2 } from 'lucide-react';
import api from '../../services/api';
import ConfirmDialog from '../../components/ConfirmDialog';
import AdminModalShell from '../../components/admin/AdminModalShell';

const LIFESTYLE_OPTIONS = ['low', 'medium', 'high'];

const ManageCosts = () => {
    const [costRows, setCostRows] = useState([]);
    const [countries, setCountries] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [currencies, setCurrencies] = useState([]);
    const [selectedLifestyle, setSelectedLifestyle] = useState('medium');
    const [selectedCountry, setSelectedCountry] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [saveToast, setSaveToast] = useState(null);
    const saveToastTimerRef = useRef(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [newLivingCost, setNewLivingCost] = useState({
        city: '',
        lifestyle: 'medium',
        rent: '',
        food: '',
        transport: '',
        currency: ''
    });
    const [costErrorMsg, setCostErrorMsg] = useState('');

    const showSaveToast = useCallback((message) => {
        setSaveToast(message);
        if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
        saveToastTimerRef.current = setTimeout(() => setSaveToast(null), 2600);
    }, []);

    useEffect(() => {
        return () => {
            if (saveToastTimerRef.current) clearTimeout(saveToastTimerRef.current);
        };
    }, []);

    const loadCosts = async () => {
        const costsData = await api.get('/costs');
        setCostRows(
            costsData.map((row) => ({
                ...row,
                rent: Number(row.rent ?? row.rent_monthly ?? 0),
                food: Number(row.food ?? row.food_monthly ?? 0),
                transport: Number(row.transport ?? row.transport_monthly ?? 0)
            }))
        );
    };

    useEffect(() => {
        loadCosts().catch(console.error);
        api.get('/scholarships/countries')
            .then(setCountries)
            .catch(console.error);
        api.get('/programs/universities')
            .then(setUniversities)
            .catch(console.error);
        api.get('/programs/currencies')
            .then(setCurrencies)
            .catch(console.error);
    }, []);

    const availableCountries = useMemo(
        () => ['All', ...new Set(costRows.map((r) => r.country).filter(Boolean))],
        [costRows]
    );

    const filteredCosts = useMemo(
        () =>
            costRows.filter((row) => {
                const lifestyleMatch = String(row.lifestyle || '').toLowerCase() === selectedLifestyle;
                const countryMatch = selectedCountry === 'All' || row.country === selectedCountry;
                return lifestyleMatch && countryMatch;
            }),
        [costRows, selectedLifestyle, selectedCountry]
    );

    const citiesWithUniversities = useMemo(() => {
        const names = universities
            .map((u) => u.city)
            .filter(Boolean);
        return [...new Set(names)].sort((a, b) => a.localeCompare(b));
    }, [universities]);

    const openAddModal = () => {
        setCostErrorMsg('');
        setNewLivingCost({
            city: '',
            lifestyle: selectedLifestyle,
            rent: '',
            food: '',
            transport: '',
            currency: currencies[0] || ''
        });
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setCostErrorMsg('');
        setIsSaving(false);
    };

    const updateCostField = (id, key, value) => {
        setCostRows((prev) => prev.map((row) => (row.id === id ? { ...row, [key]: value } : row)));
    };

    const saveCostRow = async (row) => {
        try {
            await api.put(`/costs/${row.id}`, {
                city: row.city,
                country: row.country,
                currency: String(row.currency || '').trim().toUpperCase(),
                lifestyle: row.lifestyle,
                rent: Number(row.rent),
                food: Number(row.food),
                transport: Number(row.transport)
            });
            await loadCosts();
            showSaveToast(`Saved ${row.city} (${String(row.lifestyle || '').toLowerCase()}).`);
        } catch (err) {
            alert(`Failed to save living cost row: ${err.message}`);
        }
    };

    const handleDeleteCost = async (id) => {
        try {
            await api.delete(`/costs/${id}`);
            await loadCosts();
            showSaveToast('Living cost removed.');
        } catch (err) {
            alert(`Failed to delete living cost: ${err.message}`);
            throw err;
        }
    };

    const addLivingCost = async (e) => {
        e?.preventDefault();
        setCostErrorMsg('');
        const city = String(newLivingCost.city || '').trim();
        const cur = String(newLivingCost.currency || '').trim().toUpperCase();
        const rent = Number(newLivingCost.rent);
        const food = Number(newLivingCost.food);
        const transport = Number(newLivingCost.transport);
        const life = String(newLivingCost.lifestyle || 'medium').toLowerCase();

        if (!city || !citiesWithUniversities.includes(city)) {
            setCostErrorMsg('Select a city from the list.');
            return;
        }
        if (!cur || !currencies.includes(cur)) {
            setCostErrorMsg('Select a currency from the list.');
            return;
        }
        if (![rent, food, transport].every((n) => Number.isFinite(n) && n >= 0)) {
            setCostErrorMsg('Rent, food, and transport must be non-negative numbers.');
            return;
        }

        setIsSaving(true);
        try {
            const selectedCity = universities.find((u) => u.city === city);
            const country = selectedCity?.country || '';

            await api.post('/costs', {
                city,
                country,
                currency: cur,
                lifestyle: life,
                rent,
                food,
                transport
            });
            await loadCosts();
            closeAddModal();
            showSaveToast(`Added ${city} (${life}).`);
        } catch (err) {
            setCostErrorMsg(err.message || 'Failed to add living cost');
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-row justify-between items-start md:items-center gap-4 group">
                <div className="flex-1 min-w-0">
                    <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight truncate">Costs</h1>
                    <p className="text-zinc-600 font-medium text-xs md:text-sm mt-1 mb-0.5 truncate max-w-full">Living costs by city and lifestyle.</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowFilterDropdown((open) => !open)}
                            className="flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-3 bg-zinc-50 border border-zinc-300 rounded-xl text-zinc-700 font-bold hover:bg-zinc-200 transition-all shrink-0"
                            aria-expanded={showFilterDropdown}
                            aria-haspopup="true"
                        >
                            <Filter size={18} />
                        </button>
                        {showFilterDropdown && (
                            <div className="absolute right-0 top-14 w-64 bg-zinc-100 border border-zinc-200 rounded-xl shadow-2xl z-50 p-3 space-y-3 max-h-[65vh] overflow-y-auto">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Lifestyle</label>
                                    <select
                                        value={selectedLifestyle}
                                        onChange={(e) => setSelectedLifestyle(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm"
                                    >
                                        {LIFESTYLE_OPTIONS.map((life) => (
                                            <option key={life} value={life}>
                                                {life}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 uppercase mb-1">Country</label>
                                    <select
                                        value={selectedCountry}
                                        onChange={(e) => setSelectedCountry(e.target.value)}
                                        className="w-full px-3 py-2 bg-zinc-50 border border-zinc-300 rounded-lg text-zinc-800 text-sm"
                                    >
                                        {availableCountries.map((country) => (
                                            <option key={country} value={country}>
                                                {country === 'All' ? 'All countries' : country}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedLifestyle('medium');
                                        setSelectedCountry('All');
                                        setShowFilterDropdown(false);
                                    }}
                                    className="w-full px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/12 transition-all shrink-0"
                    >
                        <Plus size={20} className="md:hidden shrink-0" />
                        <Plus size={18} className="hidden md:inline shrink-0" />
                        <span className="hidden md:inline">Add new</span>
                    </button>
                </div>
            </div>

            <section className="relative bg-zinc-100 rounded-2xl border border-zinc-200 overflow-hidden flex flex-col min-h-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="bg-zinc-50/95 border-b border-zinc-200">
                                <th className="px-4 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Location</th>
                                <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase">Rent</th>
                                <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase">Food</th>
                                <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase">Trans.</th>
                                <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase">CCY</th>
                                <th className="px-4 py-2.5 text-[10px] font-bold text-zinc-500 uppercase text-right min-w-[5.5rem]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200/80">
                            {filteredCosts.map((row) => (
                                <tr key={row.id} className="hover:bg-zinc-200/50">
                                    <td className="px-4 py-2 align-middle">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <MapPin size={14} className="text-amber-500 shrink-0" />
                                            <div className="min-w-0">
                                                <div className="text-zinc-900 font-semibold truncate">{row.city}</div>
                                                <div className="text-zinc-500 text-[11px] uppercase truncate">{row.country}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2 align-middle">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.rent}
                                            onChange={(e) => updateCostField(row.id, 'rent', e.target.value)}
                                            className="w-20 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm tabular-nums"
                                        />
                                    </td>
                                    <td className="px-3 py-2 align-middle">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.food}
                                            onChange={(e) => updateCostField(row.id, 'food', e.target.value)}
                                            className="w-20 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm tabular-nums"
                                        />
                                    </td>
                                    <td className="px-3 py-2 align-middle">
                                        <input
                                            type="number"
                                            min="0"
                                            value={row.transport}
                                            onChange={(e) => updateCostField(row.id, 'transport', e.target.value)}
                                            className="w-20 px-2 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-900 text-sm tabular-nums"
                                        />
                                    </td>
                                    <td className="px-3 py-2 align-middle">
                                        <input
                                            type="text"
                                            maxLength={3}
                                            value={String(row.currency || '').toUpperCase()}
                                            onChange={(e) => updateCostField(row.id, 'currency', e.target.value.toUpperCase())}
                                            className="w-14 px-1.5 py-1 rounded-md bg-zinc-50 border border-zinc-300 text-zinc-900 uppercase text-sm text-center"
                                        />
                                    </td>
                                    <td className="px-4 py-2 align-middle text-right">
                                        <div className="inline-flex items-center gap-1 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => saveCostRow(row)}
                                                className="inline-flex items-center justify-center p-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg"
                                                title="Save"
                                            >
                                                <Save size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDeleteConfirmId(row.id)}
                                                className="inline-flex items-center justify-center p-1.5 rounded-lg bg-zinc-200 hover:bg-red-50 border border-zinc-300 hover:border-red-300 text-zinc-700 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCosts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-zinc-500 text-sm">
                                        No rows match your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {saveToast && (
                    <div
                        role="status"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold shadow-lg z-20 pointer-events-none animate-in fade-in zoom-in-95 duration-200 max-w-[90%] text-center"
                    >
                        {saveToast}
                    </div>
                )}
            </section>

            <ConfirmDialog
                isOpen={deleteConfirmId != null}
                onClose={() => setDeleteConfirmId(null)}
                onConfirm={() => handleDeleteCost(deleteConfirmId)}
                title="Delete living cost?"
                confirmText="Delete"
                cancelText="Cancel"
                message="This action cannot be undone. Are you sure you want to delete this living cost?"
            />

            {isAddModalOpen && (
                <AdminModalShell>
                    <div className="bg-zinc-100 w-full max-w-md rounded-xl border border-zinc-200 shadow-2xl overflow-hidden max-h-[min(85dvh,32rem)] flex flex-col">
                        <div className="px-4 py-2.5 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/80 shrink-0">
                            <h2 className="text-base font-black text-zinc-900">Add living cost</h2>
                            <button type="button" onClick={closeAddModal} className="text-zinc-500 hover:text-zinc-900 p-0.5">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={addLivingCost} className="px-4 py-3 space-y-3 overflow-y-auto">
                            {costErrorMsg && (
                                <p className="text-sm text-red-600 font-medium">{costErrorMsg}</p>
                            )}
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1.5">City</label>
                                <select
                                    required
                                    value={newLivingCost.city}
                                    onChange={(e) => setNewLivingCost((p) => ({ ...p, city: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-800"
                                >
                                    <option value="">Select city</option>
                                    {citiesWithUniversities.map((name) => (
                                        <option key={name} value={name}>
                                            {name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Lifestyle</label>
                                <select
                                    value={newLivingCost.lifestyle}
                                    onChange={(e) => setNewLivingCost((p) => ({ ...p, lifestyle: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-800"
                                >
                                    {LIFESTYLE_OPTIONS.map((life) => (
                                        <option key={life} value={life}>
                                            {life}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Rent / mo</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={newLivingCost.rent}
                                        onChange={(e) => setNewLivingCost((p) => ({ ...p, rent: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Food / mo</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={newLivingCost.food}
                                        onChange={(e) => setNewLivingCost((p) => ({ ...p, food: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1.5">Transport / mo</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={newLivingCost.transport}
                                        onChange={(e) => setNewLivingCost((p) => ({ ...p, transport: e.target.value }))}
                                        className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-900"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1.5">Currency</label>
                                <select
                                    required
                                    value={newLivingCost.currency}
                                    onChange={(e) => setNewLivingCost((p) => ({ ...p, currency: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-300 text-sm text-zinc-800"
                                >
                                    <option value="">{currencies.length ? 'Select currency' : 'No currencies in currency_rates'}</option>
                                    {currencies.map((code) => (
                                        <option key={code} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={closeAddModal}
                                    className="flex-1 py-2 rounded-lg bg-zinc-200 text-sm text-zinc-700 font-bold hover:bg-zinc-300"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2 rounded-lg bg-amber-500 text-sm text-black font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </AdminModalShell>
            )}
        </div>
    );
};

export default ManageCosts;