import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, Sparkles, BookmarkCheck, Target, Award, ArrowRight, GraduationCap, DollarSign, Wallet, Home, Coffee, Bus } from 'lucide-react';
import ProgramCard from '../../components/ProgramCard';
import DocumentChecklist from '../../components/DocumentChecklist';
import AuthService from '../../services/AuthService';
import api from '../../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ fullName: 'Student', stats: { saved: 0, pending: 0, accepted: 0 } });
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [costPreview, setCostPreview] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setSavedPrograms(currentUser.savedPrograms || []);
            setSavedScholarships(currentUser.savedScholarships || []);
        } else {
            navigate('/login');
        }
        // Fetch first city for the cost preview widget
        api.get('/costs').then(data => {
            if (data && data.length > 0) setCostPreview(data[0]);
        }).catch(() => {});
    }, [navigate]);

    const deadlines = user.deadlines || [];
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Student';

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-12">
            {/* Top Section: Hero Welcome */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group">
                {/* Dynamic Background */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-purple-900/80 to-pink-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                {/* Glass Overlays & Decorations */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/30 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-pink-500/30 rounded-full blur-[80px] -ml-10 -mb-10 mix-blend-screen"></div>

                <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row md:items-end justify-between gap-8 h-full min-h-[300px]">
                    <div className="flex-1 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-black uppercase tracking-widest shadow-lg">
                            <Sparkles size={12} className="text-yellow-300" />
                            Premium Student Dashboard
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none drop-shadow-2xl">
                            Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">{firstName}</span>
                        </h1>
                        <p className="text-indigo-100/90 text-xl font-medium max-w-xl leading-relaxed">
                            Your future is waiting. You have <span className="text-white font-bold ">{deadlines.length} pending deadlines</span> this week.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => navigate('/student/profile')}
                            className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 font-bold rounded-2xl hover:bg-white/20 hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            Update Profile
                        </button>
                        <button
                            onClick={() => navigate('/student/explore')}
                            className="group relative px-8 py-4 bg-white text-indigo-900 font-extrabold rounded-2xl hover:bg-indigo-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative flex items-center gap-3">
                                Explore Programs <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Main Stats & content) - Spans 8 cols */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Animated Glass Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative group overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/60 p-6 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-400 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                                    <BookmarkCheck size={28} />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                                    Saved
                                </span>
                            </div>
                            <div className="text-5xl font-black text-slate-800 tracking-tighter mb-1 group-hover:text-indigo-600 transition-colors">
                                {user.stats?.saved || 0}
                            </div>
                            <p className="text-slate-500 font-medium text-sm">Programs shortlisted</p>
                        </div>

                        <div className="relative group overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/60 p-6 rounded-[2rem] shadow-lg hover:shadow-xl hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                                    <Target size={28} />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                                    Tracking
                                </span>
                            </div>
                            <div className="text-5xl font-black text-slate-800 tracking-tighter mb-1 group-hover:text-amber-600 transition-colors">
                                {user.stats?.pending || 0}
                            </div>
                            <p className="text-slate-500 font-medium text-sm">Applications in progress</p>
                        </div>

                        <div className="relative group overflow-hidden bg-white/60 backdrop-blur-2xl border border-white/60 p-6 rounded-[2rem] shadow-lg hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-2">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"></div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                                    <Award size={28} />
                                </div>
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-wider">
                                    Success
                                </span>
                            </div>
                            <div className="text-5xl font-black text-slate-800 tracking-tighter mb-1 group-hover:text-emerald-600 transition-colors">
                                {user.stats?.accepted || 0}
                            </div>
                            <p className="text-slate-500 font-medium text-sm">Offers received</p>
                        </div>
                    </div>

                    {/* Saved Programs - Premium List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <div className="bg-gradient-to-br from-pink-500 to-rose-500 text-white p-2 rounded-xl shadow-lg shadow-pink-200">
                                    <BookmarkCheck size={20} />
                                </div>
                                Saved Programs
                            </h2>
                            <button onClick={() => navigate('/student/saved-programs')} className="text-sm font-bold text-indigo-500 hover:text-indigo-700 hover:underline transition">
                                View all →
                            </button>
                        </div>

                        {savedPrograms.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {savedPrograms.slice(0, 4).map(program => (
                                    <ProgramCard key={program.id} program={program} isSaved={true} onToggleSave={(p) => {
                                        AuthService.toggleSavedProgram(p);
                                        const updated = AuthService.getCurrentUser();
                                        setUser(updated);
                                        setSavedPrograms(updated.savedPrograms || []);
                                    }} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/40 backdrop-blur-xl border-2 border-dashed border-indigo-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <Search className="text-indigo-400" size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-700 mb-2">Your library is empty</h3>
                                <p className="text-slate-500 mb-6 max-w-sm">Start exploring universities to build your dream list.</p>
                                <button onClick={() => navigate('/student/explore')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all">
                                    Start Exploring
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Saved Scholarships - Premium List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                                    <Award size={20} />
                                </div>
                                Saved Scholarships
                            </h2>
                            <button onClick={() => navigate('/student/saved-scholarships')} className="text-sm font-bold text-emerald-500 hover:text-emerald-700 hover:underline transition">
                                View all →
                            </button>
                        </div>

                        {savedScholarships.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {savedScholarships.slice(0, 4).map(scholarship => (
                                    <div
                                        key={scholarship.id}
                                        onClick={() => navigate(`/student/scholarships/${scholarship.id}`)}
                                        className="group relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

                                        <div className="relative z-10 space-y-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h3 className="font-black text-lg text-slate-800 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                                        {scholarship.name}
                                                    </h3>
                                                    <p className="text-sm text-slate-500 font-medium line-clamp-1">
                                                        {scholarship.provider}
                                                    </p>
                                                </div>
                                                <div className={`px-3 py-1 rounded-lg text-xs font-bold ${scholarship.status === 'Eligible' ? 'bg-emerald-100 text-emerald-700' :
                                                    scholarship.status === 'Not Eligible' ? 'bg-red-100 text-red-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {scholarship.status}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign size={16} className="text-emerald-500" />
                                                    <span className="text-sm font-bold text-slate-700">{scholarship.amount}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-slate-400" />
                                                    <span className="text-sm font-medium text-slate-500">{scholarship.deadline}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                                    {scholarship.type}
                                                </span>
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                                    {scholarship.country}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white/40 backdrop-blur-xl border-2 border-dashed border-emerald-200 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4 animate-bounce">
                                    <Award className="text-emerald-400" size={32} />
                                </div>
                                <h3 className="text-xl font-black text-slate-700 mb-2">No saved scholarships yet</h3>
                                <p className="text-slate-500 mb-6 max-w-sm">Discover funding opportunities to support your studies abroad.</p>
                                <button onClick={() => navigate('/student/scholarships')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all">
                                    Explore Scholarships
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) - Spans 4 cols */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Premium Deadline Widget */}
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/50 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-200/30 rounded-full blur-3xl"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-3 bg-amber-100/80 text-amber-600 rounded-2xl shadow-sm">
                                <Clock size={24} />
                            </div>
                            <div>
                                <h3 className="font-black text-xl text-slate-800">Deadlines</h3>
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Action Required</p>
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
                            {deadlines.length > 0 ? deadlines.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer group/item">
                                    <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 group-hover/item:border-amber-200 group-hover/item:bg-amber-50">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase group-hover/item:text-amber-500">{item.date.split('-')[1]}</span>
                                        <span className="text-lg font-black text-slate-700 group-hover/item:text-amber-700">{item.date.split('-')[2]}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-800 text-base line-clamp-1 mb-0.5">{item.university || item.title}</h4>
                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                                            {item.task || item.type || 'Application'}
                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                            {item.date.split('-')[0]}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-slate-400 text-center text-sm py-4 font-medium italic">No upcoming deadlines.</p>
                            )}
                        </div>
                    </div>

                    {/* Glassy Checklist */}
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/50 p-6 rounded-[2.5rem] shadow-xl relative">
                        <DocumentChecklist compact={true} />
                    </div>

                    {/* Mini Cost Estimator Widget */}
                    <div
                        onClick={() => navigate('/student/cost')}
                        className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group cursor-pointer border border-indigo-500/30 ring-1 ring-white/10 hover:ring-white/20 transition-all"
                    >
                        {/* Background Noise/Decoration */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/30 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/30 rounded-full blur-3xl -ml-10 -mb-10"></div>

                        <div className="relative z-10 space-y-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
                                    <Wallet size={14} className="text-indigo-300" />
                                    <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Monthly Cost</span>
                                </div>
                                <div className="text-[10px] font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/20 hover:bg-white/20 transition-colors">
                                    $ CONVERT TO PKR
                                </div>
                            </div>

                            {costPreview ? (
                            <>
                                <div>
                                    <div className="text-5xl font-black text-white tracking-tighter mb-1 drop-shadow-lg">
                                        {costPreview.currency} {(costPreview.rent + costPreview.food + costPreview.transport).toLocaleString()}
                                    </div>
                                    <p className="text-indigo-200 font-medium text-sm">for <span className="text-white border-b-2 border-indigo-400 pb-0.5">{costPreview.city}</span></p>
                                </div>
                                <div className="space-y-2.5 pt-1">
                                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-500/20 rounded-xl group-hover/item:scale-110 transition-transform"><Home size={16} className="text-indigo-300" /></div>
                                            <span className="text-xs text-indigo-100 font-bold">Accommodation</span>
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-tight">{costPreview.currency} {Number(costPreview.rent).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/20 rounded-xl group-hover/item:scale-110 transition-transform"><Coffee size={16} className="text-emerald-300" /></div>
                                            <span className="text-xs text-indigo-100 font-bold">Food & Groceries</span>
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-tight">{costPreview.currency} {Number(costPreview.food).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group/item">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-amber-500/20 rounded-xl group-hover/item:scale-110 transition-transform"><Bus size={16} className="text-amber-300" /></div>
                                            <span className="text-xs text-indigo-100 font-bold">Transport</span>
                                        </div>
                                        <span className="text-sm font-bold text-white tracking-tight">{costPreview.currency} {Number(costPreview.transport).toLocaleString()}</span>
                                    </div>
                                </div>
                            </>
                            ) : (
                                <p className="text-indigo-300 text-sm font-medium animate-pulse">Loading cost data...</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
