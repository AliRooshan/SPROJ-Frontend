import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Search, BookmarkCheck, Target, Award, DollarSign, LayoutDashboard, Building2, CalendarCheck } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import AuthService from '../../services/AuthService';
import api from '../../services/api';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ fullName: 'Student' });
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            // Fetch live user data
            Promise.allSettled([
                api.get(`/users/${currentUser.id}/saved-programs`),
                api.get(`/users/${currentUser.id}/saved-scholarships`),
                api.get(`/users/${currentUser.id}/applications`)
            ]).then(([programsRes, scholarshipsRes, appsRes]) => {
                const programs = programsRes.status === 'fulfilled' ? programsRes.value : [];
                const scholarships = scholarshipsRes.status === 'fulfilled' ? scholarshipsRes.value : [];
                const apps = appsRes.status === 'fulfilled' ? appsRes.value : [];

                // Filter out nulls from the backend joined responses if any
                setSavedPrograms(programs.filter(p => p !== null));
                setSavedScholarships(scholarships.filter(s => s !== null));
                setApplications(apps);
            });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // Derive stats
    const stats = {
        saved: savedPrograms.length,
        pending: applications.filter(a => a.status === 'pending').length,
        accepted: applications.filter(a => a.status === 'accepted').length
    };

    // Derive deadlines from pending apps
    const deadlines = applications
        .filter(a => a.status === 'pending' && a.deadline)
        .map(a => ({
            id: a.id,
            program_id: a.program_id,
            university: a.university || a.country || 'Application',
            title: a.program_name || a.program,
            date: a.deadline,
            type: 'Application'
        }))
        .sort((a, b) => {
            const da = a.date ? new Date(a.date).getTime() : Infinity;
            const db = b.date ? new Date(b.date).getTime() : Infinity;
            return da - db;
        });
    const firstName = user.fullName ? user.fullName.split(' ')[0] : 'Student';

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-700 text-slate-800">
            <PageHeader
                title="Dashboard"
                subtitle={`Welcome back, ${firstName}`}
                icon={LayoutDashboard}
                actions={
                    <>
                        <button
                            onClick={() => navigate('/student/profile')}
                            className="bg-indigo-50/95 hover:bg-white text-indigo-900 font-bold rounded-lg md:rounded-xl px-3 py-2 text-xs md:px-6 md:py-2.5 md:text-base transition-all shadow-md hover:shadow-lg"
                        >
                            Update Profile
                        </button>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
                {/* Left Column (Main Stats & content) - Spans 8 cols */}
                <div className="lg:col-span-8 space-y-5 md:space-y-8">

                    {/* Animated Glass Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
                        <div className="relative group overflow-hidden bg-indigo-50 border border-indigo-100 p-3 rounded-[1.25rem] shadow-sm hover:shadow-md hover:shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors"></div>
                            <div className="flex items-start justify-between mb-0.5">
                                <div className="p-1.5 bg-white text-indigo-600 rounded-lg group-hover:scale-110 transition-transform shadow-sm relative z-10">
                                    <BookmarkCheck size={18} />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md uppercase tracking-wider relative z-10">
                                    Saved
                                </span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center pb-1 -mt-0.5">
                                <div className="text-[28px] font-black text-indigo-950 tracking-tighter leading-none mb-0.5">
                                    {stats.saved}
                                </div>
                                <p className="text-indigo-700/80 font-bold text-[11px]">Programs</p>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden bg-amber-50 border border-amber-100 p-3 rounded-[1.25rem] shadow-sm hover:shadow-md hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors"></div>
                            <div className="flex items-start justify-between mb-0.5">
                                <div className="p-1.5 bg-white text-amber-600 rounded-lg group-hover:scale-110 transition-transform shadow-sm relative z-10">
                                    <Target size={18} />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md uppercase tracking-wider relative z-10">
                                    Tracking
                                </span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center pb-1 -mt-0.5">
                                <div className="text-[28px] font-black text-amber-950 tracking-tighter leading-none mb-0.5">
                                    {stats.pending}
                                </div>
                                <p className="text-amber-700/80 font-bold text-[11px]">In progress</p>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden bg-emerald-50 border border-emerald-100 p-3 rounded-[1.25rem] shadow-sm hover:shadow-md hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 rounded-full blur-xl group-hover:bg-white/60 transition-colors"></div>
                            <div className="flex items-start justify-between mb-0.5">
                                <div className="p-1.5 bg-white text-emerald-600 rounded-lg group-hover:scale-110 transition-transform shadow-sm relative z-10">
                                    <Award size={18} />
                                </div>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-white/70 backdrop-blur-sm px-1.5 py-0.5 rounded-md uppercase tracking-wider relative z-10">
                                    Success
                                </span>
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center pb-1 -mt-0.5">
                                <div className="text-[28px] font-black text-emerald-950 tracking-tighter leading-none mb-0.5">
                                    {stats.accepted}
                                </div>
                                <p className="text-emerald-700/80 font-bold text-[11px]">Offers received</p>
                            </div>
                        </div>
                    </div>

                    {/* Saved Content Grid: Programs & Scholarships */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* Saved Programs Card Container */}
                        <div className="bg-white/80 backdrop-blur-3xl border border-white/50 p-4 rounded-2xl shadow-xl md:p-6 md:rounded-[2.5rem] flex flex-col">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
                                    <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shadow-inner">
                                        <BookmarkCheck size={20} />
                                    </div>
                                    Programs
                                </h2>
                                <button onClick={() => navigate('/student/saved-programs')} className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">
                                    View all
                                </button>
                            </div>

                            <div className="flex-1 space-y-4">
                                {savedPrograms.length > 0 ? savedPrograms.slice(0, 3).map(program => (
                                    <div
                                        key={program.id}
                                        onClick={() => navigate(`/student/program/${program.program_id ?? program.id}`)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-indigo-500 hover:-translate-y-1 md:gap-4 md:p-4 md:rounded-2xl"
                                    >
                                        <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                                            <Building2 className="text-indigo-500" size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                                {program.program_name ?? program.program ?? program.name}
                                            </h4>
                                            <p className="text-xs font-bold text-slate-500 line-clamp-1 mt-0.5">
                                                {program.university || program.country || ''}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 py-12 bg-white/40 rounded-2xl border border-dashed border-indigo-100">
                                        <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="text-indigo-300" size={24} />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-700 mb-1">No programs saved</h3>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Saved Scholarships Card Container */}
                        <div className="bg-white/80 backdrop-blur-3xl border border-white/50 p-4 rounded-2xl shadow-xl md:p-6 md:rounded-[2.5rem] flex flex-col">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
                                    <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl shadow-inner">
                                        <Award size={20} />
                                    </div>
                                    Scholarships
                                </h2>
                                <button onClick={() => navigate('/student/saved-scholarships')} className="text-[11px] font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-lg transition-colors uppercase tracking-wider">
                                    View all
                                </button>
                            </div>

                            <div className="flex-1 space-y-4">
                                {savedScholarships.length > 0 ? savedScholarships.slice(0, 3).map(scholarship => (
                                    <div
                                        key={scholarship.id}
                                        onClick={() => navigate(`/student/scholarships/${scholarship.scholarship_id ?? scholarship.id}`)}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-emerald-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-emerald-500 hover:-translate-y-1 md:gap-4 md:p-4 md:rounded-2xl"
                                    >
                                        <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                                            <DollarSign className="text-emerald-500" size={22} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">{scholarship.name}</h4>
                                            <p className="text-xs font-bold text-slate-500 line-clamp-1 mt-0.5">{scholarship.provider}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-6 py-12 bg-white/40 rounded-2xl border border-dashed border-emerald-100">
                                        <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                            <Search className="text-emerald-300" size={24} />
                                        </div>
                                        <h3 className="text-sm font-black text-slate-700 mb-1">No scholarships saved</h3>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar Widgets) - Spans 4 cols */}
                <div className="lg:col-span-4 space-y-4 md:space-y-6 max-h-[528px]">

                    {/* Premium Deadline Widget */}
                    <div className="bg-white/80 backdrop-blur-3xl border border-white/50 p-4 rounded-2xl shadow-xl relative flex flex-col h-full max-h-[528px] overflow-hidden md:p-6 md:rounded-[2.5rem]">

                        {/* Header */}
                        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 relative z-10">
                            <div className="bg-red-100/80 text-red-600 p-2.5 rounded-xl shadow-inner">
                                <Clock size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-lg md:text-xl text-slate-800">Deadlines</h3>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="space-y-3 relative z-10 flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">

                            {deadlines.length > 0 ? deadlines.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => navigate(`/student/program/${item.program_id}`)}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-red-200 shadow-sm hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-red-500 hover:-translate-y-1 md:gap-4 md:p-4 md:rounded-2xl"
                                >
                                    <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center bg-red-50 group-hover:bg-red-100 transition-colors flex-col">
                                        <span className="text-[9px] font-bold text-red-500 uppercase leading-none">
                                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                                        </span>
                                        <span className="text-sm font-black text-red-700 leading-none mt-0.5">
                                            {new Date(item.date).toLocaleDateString('en-US', { day: '2-digit' })}
                                        </span>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-red-600 transition-colors mb-0.5">
                                            {item.title}
                                        </h4>
                                        <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5 opacity-80">
                                            {item.university}
                                        </span>
                                    </div>
                                </div>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 py-12 bg-white/40 rounded-2xl border border-dashed border-red-100">
                                    <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                        <CalendarCheck className="text-red-300" size={24} />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-700 mb-1">No upcoming deadlines.</h3>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
