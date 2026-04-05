import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Clock, CheckCircle, Bookmark, PlusCircle, ChevronLeft, Building2, GraduationCap, Globe } from 'lucide-react';
import AuthService from '../../services/AuthService';


const ProgramDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        fetch(`/api/programs/${id}`)
            .then(res => res.json())
            .then(data => {
                setProgram(data);
                if (currentUser) {
                    setIsSaved(AuthService.isProgramSaved(data.id));
                }
            })
            .catch(err => console.error('Failed to load program:', err));
    }, [id]);

    const handleSave = async () => {
        if (!user) { alert('Please login to save programs'); return; }
        try {
            const newStatus = await AuthService.toggleSavedProgram(program);
            setIsSaved(newStatus);
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };

    const handleAddToTracker = async () => {
        if (!user) { alert('Please login to start an application'); return; }
        try {
            await AuthService.addApplication({
                programId:   program.id,
                university:  program.university,
                program:     program.program,
                deadline:    program.deadline,
                country:     program.country,
                status:      'pending',
            });
            navigate('/student/tracker');
        } catch (err) {
            console.error('Failed to add application:', err.message);
        }
    };


    if (!program) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading program details...</div>;


    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 max-w-6xl mx-auto space-y-6">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-white/50"
            >
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-indigo-100 transition-colors shadow-sm">
                    <ChevronLeft size={18} />
                </div>
                Back to Explore
            </button>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-indigo-900 shadow-2xl h-[400px]">
                <img src={program.image} alt={program.name} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12 z-10 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
                                <Building2 size={14} />
                                {program.name}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight shadow-black drop-shadow-lg">{program.program}</h1>
                            <div className="flex items-center gap-2 text-indigo-200 font-medium text-lg">
                                <MapPin size={20} className="text-pink-500" />
                                {program.city}, {program.country}
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4 text-white">
                            <div className="flex flex-col">
                                <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider">Tuition Fees</span>
                                <span className="text-2xl font-black">{program.currency} {program.tuition.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Overview */}
                    <div className="glass-card p-8 rounded-3xl border border-indigo-50 shadow-xl bg-white space-y-6">
                        <div className="flex items-center gap-3 border-b border-indigo-50 pb-4">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <Globe size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Program Overview</h2>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-lg">
                            {program.description} This comprehensive program is designed to equip students with the theoretical knowledge and practical skills necessary to excel in the competitive global market. Through a blend of rigorous coursework and hands-on projects, you will tackle real-world challenges.
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Duration</span>
                                <span className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <Clock size={18} className="text-indigo-500" />
                                    {program.duration}
                                </span>
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                <span className="block text-slate-500 text-xs font-bold uppercase mb-1">Intake</span>
                                <span className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <Calendar size={18} className="text-indigo-500" />
                                    {program.deadline}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility */}
                    <div className="glass-card p-8 rounded-3xl border border-indigo-50 shadow-xl bg-white space-y-6">
                        <div className="flex items-center gap-3 border-b border-indigo-50 pb-4">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <GraduationCap size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Eligibility Criteria</h2>
                        </div>
                        <ul className="space-y-4">
                            {[
                                program.eligibility,
                                "Bachelor's degree in a relevant field with minimum 60% aggregate.",
                                "Minimum 2 years of relevant work experience recommended.",
                                "English Proficiency: IELTS 6.5 or TOEFL 90."
                            ].map((req, idx) => (
                                <li key={idx} className="flex items-start gap-4 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                                    <span className="font-medium">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Action Card */}
                    <div className="glass-card p-6 rounded-3xl border border-indigo-50 shadow-xl bg-white sticky top-6">
                        <h3 className="text-xl font-black text-slate-900 mb-6 px-1">Take Action</h3>

                        <div className="space-y-4">
                            <button
                                onClick={handleAddToTracker}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                            >
                                <PlusCircle size={20} />
                                Start Application
                            </button>
                            <button
                                onClick={handleSave}
                                className={`w-full py-4 border-2 font-bold rounded-2xl transition-all flex items-center justify-center gap-3 ${isSaved
                                    ? 'bg-amber-50 border-amber-200 text-amber-700'
                                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md'
                                    }`}
                            >
                                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
                                {isSaved ? 'Saved to Library' : 'Save Program'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramDetails;
