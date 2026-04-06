import React, { useState, useEffect } from 'react';
import { MoreHorizontal, Calendar, ArrowRight, CheckCircle, XCircle, Clock, Bookmark, Plus, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const Tracker = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        AuthService.getApplications().then(setApplications).catch(console.error);
    }, []);


    const statuses = ['pending', 'accepted', 'rejected'];
    const statusLabels = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'rejected': 'Rejected'
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'pending': return 'border-amber-200 bg-amber-50/50 text-amber-700';
            case 'accepted': return 'border-emerald-200 bg-emerald-50/50 text-emerald-700 shadow-sm';
            case 'rejected': return 'border-red-200 bg-red-50/50 text-red-700';
            default: return 'border-slate-200 bg-slate-50/50 text-slate-500';
        }
    };

    const getStatusHeaderStyles = (status) => {
        switch (status) {
            case 'pending': return 'from-amber-500 to-orange-500 shadow-amber-200';
            case 'accepted': return 'from-emerald-500 to-teal-500 shadow-emerald-200';
            case 'rejected': return 'from-red-500 to-pink-500 shadow-red-200';
            default: return 'from-slate-500 to-slate-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-white" />;
            case 'accepted': return <CheckCircle size={16} className="text-white" />;
            case 'rejected': return <XCircle size={16} className="text-white" />;
            default: return null;
        }
    };

    const moveApplication = async (id, newStatus) => {
        try {
            await AuthService.updateApplicationStatus(id, newStatus);
            const updated = await AuthService.getApplications();
            setApplications(updated);
        } catch (err) {
            console.error('Failed to update status:', err.message);
        }
    };


    const renderDateInfo = (app, status) => {
        if (status === 'rejected') return null;

        if (status === 'accepted') {
            return (
                <div className="flex items-center gap-2 text-xs text-emerald-700 mb-4 font-bold bg-emerald-100/80 w-fit px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Calendar size={12} className="text-emerald-600" />
                    <span>Deadline: <span className="text-emerald-900">{app.deadline}</span></span>
                </div>
            );
        }

        // Pending or default
        return (
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-bold bg-white/60 w-fit px-3 py-1.5 rounded-lg border border-slate-100 backdrop-blur-sm">
                <Clock size={12} className="text-indigo-500" />
                <span>Deadline: <span className="text-slate-700">{app.deadline}</span></span>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-8 h-full flex flex-col">

            {/* Hero Section - Image Based */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop"
                        alt="Planning"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-blue-900/80 to-sky-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <Rocket size={12} className="text-sky-300" />
                                My Journey
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Application <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-white">Tracker</span>
                            </h1>
                            <p className="text-sky-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Stay organized and never miss a deadline. Track every step of your study abroad journey.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/student/explore')}
                            className="px-8 py-3.5 bg-white text-indigo-600 rounded-2xl hover:bg-indigo-50 transition-all font-bold shadow-lg shadow-indigo-900/20 hover:shadow-indigo-900/40 hover:-translate-y-1 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            Add Application
                        </button>
                    </div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-6 overflow-x-auto pb-6 flex-grow items-start snap-x">
                {statuses.map(status => (
                    <div key={status} className="flex-1 min-w-[320px] flex flex-col gap-4 snap-center">
                        {/* Column Header */}
                        <div className={`p-5 rounded-2xl shadow-lg bg-gradient-to-r ${getStatusHeaderStyles(status)} text-white flex items-center justify-between`}>
                            <div className="flex items-center gap-2.5 font-black uppercase tracking-wide text-sm">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    {getStatusIcon(status)}
                                </div>
                                {statusLabels[status]}
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-lg text-sm font-bold backdrop-blur-sm">
                                {applications.filter(a => a.status === status).length}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {applications.filter(a => a.status === status).map(app => (
                                <div key={app.id} className="glass-card p-6 rounded-[1.5rem] group relative hover:border-indigo-300 hover:shadow-xl cursor-grab active:cursor-grabbing transition-all border border-white/60 bg-white/60 backdrop-blur-xl">

                                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-400 transition-colors">
                                        <Bookmark size={20} className="fill-current opacity-20 group-hover:opacity-100" />
                                    </div>

                                    <div className="mb-4 pr-6">
                                        <h3 className="font-bold text-slate-800 text-xl leading-tight mb-1 group-hover:text-indigo-700 transition-colors">{app.program}</h3>
                                        <p className="text-sm text-slate-500 font-bold">{app.university}</p>
                                    </div>

                                    {renderDateInfo(app, status)}

                                    {/* Action Footer */}
                                    <div className="pt-4 border-t border-slate-100/50 flex justify-between items-center mt-2">
                                        <button className="text-slate-400 hover:text-indigo-600 transition p-2 hover:bg-white rounded-full">
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => moveApplication(app.id, 'accepted')}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 flex items-center gap-1 transition-all border border-emerald-100"
                                                >
                                                    Accept <CheckCircle size={12} />
                                                </button>
                                                <button
                                                    onClick={() => moveApplication(app.id, 'rejected')}
                                                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 flex items-center gap-1 transition-all border border-red-100"
                                                >
                                                    Reject <XCircle size={12} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {applications.filter(a => a.status === status).length === 0 && (
                                <div className="text-center py-12 border-2 border-dashed border-indigo-100/50 rounded-[1.5rem] bg-white/20 backdrop-blur-sm text-slate-400 text-sm font-medium flex flex-col items-center gap-3">
                                    <div className="w-14 h-14 rounded-full bg-indigo-50/50 flex items-center justify-center mb-1">
                                        <Plus className="text-indigo-300" size={24} />
                                    </div>
                                    <p>No applications in this stage</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracker;
