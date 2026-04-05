import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, CheckCircle, Bookmark, ExternalLink, ChevronLeft, Building2, GraduationCap, Globe, Award, Sparkles } from 'lucide-react';
import AuthService from '../../services/AuthService';


const ScholarshipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        fetch(`/api/scholarships/${id}`)
            .then(res => res.json())
            .then(data => {
                setScholarship(data);
                setIsSaved(AuthService.isScholarshipSaved(data.id));
            })
            .catch(err => console.error('Failed to load scholarship:', err));
    }, [id]);

    if (!scholarship) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading scholarship details...</div>;

    const handleSaveScholarship = async () => {
        try {
            const newSavedState = await AuthService.toggleSavedScholarship(scholarship);
            setIsSaved(newSavedState);
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };


    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-6xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-white/50"
            >
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-emerald-100 transition-colors shadow-sm">
                    <ChevronLeft size={18} />
                </div>
                Back to Scholarships
            </button>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-900 shadow-2xl h-[400px]">
                <img
                    src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2070&auto=format&fit=crop"
                    alt="Scholarship Funding"
                    className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-14 z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 text-xs font-black uppercase tracking-widest mb-4">
                                <Award size={14} className="text-emerald-400" />
                                {scholarship.type} Scholarship
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tight shadow-black drop-shadow-xl loading-none">{scholarship.name}</h1>
                            <div className="flex items-center gap-2 text-emerald-100 font-medium text-xl">
                                <Building2 size={24} className="text-emerald-400" />
                                {scholarship.provider}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-4 text-white min-w-[200px]">
                            <div className="flex flex-col">
                                <span className="text-xs text-emerald-200 uppercase font-bold tracking-wider mb-1">Award Value</span>
                                <span className="text-3xl font-black text-white leading-none">{scholarship.amount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/50 shadow-xl bg-white/60 space-y-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4 border-b border-emerald-100/50 pb-6">
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600 shadow-sm">
                                <Sparkles size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">About the Scholarship</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg font-medium">
                            The <span className="text-emerald-700 font-bold">{scholarship.name}</span> is a prestigious award designed to support outstanding students in their academic journey.
                            Wait, this is mock data, but imagine a beautiful description here about how this scholarship empowers future leaders in {scholarship.country}.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-2">
                            <div className="p-6 rounded-3xl bg-white border border-emerald-50 shadow-sm group hover:border-emerald-200 transition-colors">
                                <span className="block text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Location</span>
                                <span className="text-xl font-black text-slate-800 flex items-center gap-3">
                                    <Globe size={20} className="text-emerald-500" />
                                    {scholarship.country}
                                </span>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-emerald-50 shadow-sm group hover:border-emerald-200 transition-colors">
                                <span className="block text-slate-400 text-xs font-black uppercase tracking-wider mb-2">Deadline</span>
                                <span className="text-xl font-black text-slate-800 flex items-center gap-3">
                                    <Calendar size={20} className="text-emerald-500" />
                                    {scholarship.deadline}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility & Requirements */}
                    <div className="glass-card p-10 rounded-[2.5rem] border border-white/50 shadow-xl bg-white/60 space-y-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4 border-b border-emerald-100/50 pb-6">
                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
                                <CheckCircle size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">Eligibility & Requirements</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                "Must be an international student from a qualifying country.",
                                "A strong academic record (GPA 3.5+ or equivalent).",
                                "Demonstrated leadership potential and community service.",
                                "Proficiency in English (IELTS/TOEFL) required for non-native speakers."
                            ].map((req, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-slate-700 bg-white p-5 rounded-2xl border border-slate-100 hover:border-emerald-100 transition-colors shadow-sm">
                                    <div className="mt-1 p-1 bg-emerald-100 rounded-full text-emerald-600">
                                        <CheckCircle size={16} strokeWidth={3} />
                                    </div>
                                    <span className="font-bold text-lg">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="glass-card p-8 rounded-[2.5rem] border border-emerald-100 shadow-2xl bg-white sticky top-6">
                        <h3 className="text-2xl font-black text-slate-900 mb-8 px-1">Apply Now</h3>

                        <div className="space-y-4">
                            <button
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-emerald-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 shadow-lg"
                            >
                                <ExternalLink size={20} />
                                Visit Official Website
                            </button>
                            <button
                                onClick={handleSaveScholarship}
                                className={`w-full py-4 border-2 font-bold rounded-2xl hover:shadow-md transition-all flex items-center justify-center gap-3 ${isSaved
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-emerald-200 hover:text-emerald-700'
                                    }`}
                            >
                                <Bookmark size={20} className={isSaved ? 'fill-current' : ''} />
                                {isSaved ? 'Saved' : 'Save Scholarship'}
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                            <p className="text-sm text-slate-400 font-bold mb-2 uppercase tracking-wider">Share this opportunity</p>
                            <div className="flex justify-center gap-4">
                                <button className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Globe size={20} /></button>
                                <button className="p-3 bg-slate-50 rounded-full text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors"><ExternalLink size={20} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScholarshipDetails;
