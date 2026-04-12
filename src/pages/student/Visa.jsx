import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Calendar, AlertCircle, Square, Loader2 } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';

const normalizeSteps = (steps) => {
    if (Array.isArray(steps)) {
        return steps.map((step, idx) => {
            if (typeof step === 'string') {
                return {
                    id: idx + 1,
                    title: step,
                    duration: 'TBD',
                    description: ''
                };
            }
            return {
                id: step?.id ?? idx + 1,
                title: step?.title ?? `Step ${idx + 1}`,
                duration: step?.duration ?? 'TBD',
                description: step?.description ?? ''
            };
        });
    }
    return [];
};

const normalizeDocuments = (documents) => {
    if (Array.isArray(documents)) return documents;
    if (typeof documents === 'string') {
        try {
            const parsed = JSON.parse(documents);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return documents.split('\n').map(d => d.trim()).filter(Boolean);
        }
    }
    return [];
};

const VisaGuidance = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [visaData, setVisaData] = useState([]);    // array of {country, steps, documents}
    const [checkedItems, setCheckedItems] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVisaData = async () => {
            try {
                setLoading(true);
                const data = await api.get('/visa');
                const normalized = (Array.isArray(data) ? data : []).map(item => ({
                    ...item,
                    steps: normalizeSteps(item.steps),
                    documents: normalizeDocuments(item.documents)
                }));
                setVisaData(normalized);
                if (normalized.length > 0) setSelectedCountry(normalized[0].country);
            } catch (err) {
                console.error('Failed to fetch visa guidance:', err);
                setError('Failed to load visa guidance. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchVisaData();
    }, []);

    const currentData = visaData.find(d => d.country === selectedCountry) || null;
    const countries = visaData.map(d => d.country);

    const toggleItem = (doc) => {
        const key = `${selectedCountry}-${doc}`;
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-500">
            <PageHeader
                title="Visa Guidance"
                subtitle={`Step-by-step roadmap for ${selectedCountry || 'your destination'}`}
                icon={null}
                actions={
                    countries.length > 0 && (
                        <div className="bg-black/20 backdrop-blur-md rounded-full p-1 border border-white/10 inline-flex items-center shadow-inner ring-1 ring-white/5">
                            {countries.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedCountry(c)}
                                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${selectedCountry === c
                                        ? 'bg-indigo-50/95 text-indigo-900 shadow-md border border-white/60'
                                        : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    )
                }
            />

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center py-24">
                    <Loader2 size={40} className="animate-spin text-blue-500" />
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 flex gap-3 text-red-700">
                    <AlertCircle size={22} className="shrink-0 mt-0.5" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Content */}
            {!loading && !error && currentData && (
                <div className="grid lg:grid-cols-3 gap-4 md:gap-8 items-start">

                    {/* Timeline Steps */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Country Selector moved to PageHeader */}

                        <div className="flex items-center gap-3 mb-2 px-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Application Timeline</h2>
                        </div>

                        <div className="space-y-3">
                            {currentData.steps.map((step, index) => (
                                <div key={step.id ?? index} className="relative bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-indigo-100 transition-all group flex items-start gap-4">
                                    {/* Step number */}
                                    <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-black">
                                        {index + 1}
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                                            {step.duration && String(step.duration).toUpperCase() !== 'TBD' && (
                                                <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg uppercase tracking-wide shrink-0">{step.duration}</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar - Document Checklist */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                                <FileText size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Required Documents</h2>
                        </div>

                        <div className="bg-white glass-card p-6 rounded-2xl shadow-xl border border-slate-100">
                            <div className="space-y-3">
                                {currentData.documents.map((doc, i) => {
                                    const isChecked = checkedItems[`${selectedCountry}-${doc}`];
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => toggleItem(doc)}
                                            className={`flex items-center gap-3 p-3 rounded-2xl transition-all group cursor-pointer border ${isChecked ? 'bg-indigo-50 border-indigo-100' : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-100'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-300 group-hover:bg-slate-200'}`}>
                                                {isChecked ? <CheckCircle size={14} className="stroke-[3]" /> : <Square size={14} className="stroke-[3]" />}
                                            </div>
                                            <span className={`font-bold transition-colors ${isChecked ? 'text-indigo-800 line-through decoration-2 decoration-indigo-300' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                {doc}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisaGuidance;
