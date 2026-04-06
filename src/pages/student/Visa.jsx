import React, { useState, useEffect } from 'react';
import { Plane, FileText, CheckCircle, Calendar, Globe, Shield, AlertCircle, Landmark, GraduationCap, Stethoscope, Banknote, Square, Loader2 } from 'lucide-react';
import api from '../../services/api';

// Map step titles to icons (since icons can't be stored in the DB)
const STEP_ICON_MAP = {
  default: <Globe size={24} />,
  'Acceptance': <GraduationCap size={24} />,
  'I-20': <FileText size={24} />,
  'CoE': <FileText size={24} />,
  'Admission': <GraduationCap size={24} />,
  'Finance': <Banknote size={24} />,
  'SEVIS': <Banknote size={24} />,
  'Blocked': <Banknote size={24} />,
  'Health': <Stethoscope size={24} />,
  'OSHC': <Stethoscope size={24} />,
  'Medical': <Stethoscope size={24} />,
  'Biometric': <Shield size={24} />,
  'Passport': <Plane size={24} />,
  'Visa': <Plane size={24} />,
  'Receive': <Plane size={24} />,
  'Embassy': <Landmark size={24} />,
  'Interview': <Landmark size={24} />,
};

const STEP_COLORS = [
  'from-blue-600 to-indigo-600',
  'from-indigo-600 to-violet-600',
  'from-violet-600 to-purple-600',
  'from-purple-600 to-fuchsia-600',
  'from-fuchsia-600 to-pink-600',
];

const getStepIcon = (title = '') => {
  const key = Object.keys(STEP_ICON_MAP).find(k => k !== 'default' && title.startsWith(k));
  return key ? STEP_ICON_MAP[key] : STEP_ICON_MAP.default;
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
                setVisaData(data);
                if (data.length > 0) setSelectedCountry(data[0].country);
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
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
                        alt="Visa Process"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-slate-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <Plane size={12} className="text-blue-300" />
                                Travel Ready
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Visa <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Guidance</span>
                            </h1>
                            <p className="text-blue-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Step-by-step roadmap to securing your student visa
                                {selectedCountry && <> for <span className="text-white border-b border-blue-400">{selectedCountry}</span></>}.
                            </p>
                        </div>

                        {/* Country Selector */}
                        {!loading && countries.length > 0 && (
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl flex gap-1 overflow-x-auto max-w-full">
                                {countries.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setSelectedCountry(c)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${selectedCountry === c
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-blue-100 hover:bg-white/10'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
                <div className="grid lg:grid-cols-3 gap-8 items-start">

                    {/* Timeline Steps */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3 mb-2 px-2">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                                <Calendar size={20} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Application Timeline</h2>
                        </div>

                        <div className="space-y-4">
                            {currentData.steps.map((step, index) => (
                                <div key={step.id ?? index} className={`relative overflow-hidden rounded-[2rem] p-6 shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl group bg-gradient-to-br ${STEP_COLORS[index % STEP_COLORS.length]} text-white`}>
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                    <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-inner">
                                            {getStepIcon(step.title)}
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-bold mb-1 text-white">{step.title}</h3>
                                                <span className="text-xs font-black bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md uppercase tracking-wider">{step.duration}</span>
                                            </div>
                                            <p className="text-blue-50/90 font-medium leading-relaxed max-w-lg">{step.description}</p>
                                        </div>
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

                        <div className="bg-white glass-card p-6 rounded-[2.5rem] shadow-xl border border-slate-100">
                            <div className="mb-4 pb-4 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Checklist for {selectedCountry}</h3>
                            </div>
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

                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex gap-3 text-amber-800 text-sm">
                                    <AlertCircle size={20} className="shrink-0" />
                                    <p className="font-medium leading-tight">Requirements change frequently. Always verify.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisaGuidance;
