import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Plus, Target, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';

const Tracker = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, appId: null, isPending: false });

    useEffect(() => {
        AuthService.getApplications().then(setApplications).catch(console.error);
    }, []);


    const statuses = ['pending', 'accepted', 'rejected'];
    const statusLabels = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'rejected': 'Rejected'
    };

    const getStatusHeaderStyles = (status) => {
        switch (status) {
            case 'pending':  return 'bg-white border-2 border-amber-400';
            case 'accepted': return 'bg-white border-2 border-emerald-400';
            case 'rejected': return 'bg-white border-2 border-red-400';
            default:         return 'bg-white border-2 border-slate-300';
        }
    };

    const getStatusAccentStyles = (status) => {
        switch (status) {
            case 'pending': return 'bg-amber-200 text-amber-900';
            case 'accepted': return 'bg-emerald-200 text-emerald-900';
            case 'rejected': return 'bg-red-200 text-red-900';
            default: return 'bg-slate-200 text-slate-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock size={16} className="text-amber-700" />;
            case 'accepted': return <CheckCircle size={16} className="text-emerald-700" />;
            case 'rejected': return <XCircle size={16} className="text-red-700" />;
            default: return null;
        }
    };

    const moveApplication = async (app, newStatus) => {
        try {
            await AuthService.updateApplicationStatus(app, newStatus);
            const updated = await AuthService.getApplications();
            setApplications(updated);
        } catch (err) {
            console.error('Failed to update status:', err.message);
            throw err;
        }
    };

    const deleteApplication = async (id) => {
        try {
            await AuthService.deleteApplication(id);
            setApplications(apps => apps.filter(a => a.id !== id));
        } catch (err) {
            console.error('Delete failed:', err.message);
            throw err;
        }
    };

    const openConfirmDialog = (appId, isPending) => {
        setConfirmDialog({ isOpen: true, appId, isPending });
    };

    const handleConfirmedAction = async () => {
        const { appId, isPending } = confirmDialog;
        if (isPending) {
            await deleteApplication(appId);
        } else {
            const app = applications.find(a => a.id === appId);
            if (app) await moveApplication(app, 'pending');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };



    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-500 h-full flex flex-col">
            <PageHeader
                title="Application Tracker"
                subtitle={`Track your applications easily`}
                icon={Target}
                actions={
                    <button
                        onClick={() => navigate('/student/explore')}
                        className="bg-indigo-50/95 hover:bg-white text-indigo-900 font-bold rounded-lg md:rounded-xl px-4 py-2 text-sm md:px-6 md:py-2.5 md:text-base transition-all shadow-md hover:shadow-lg"
                    >
                        Add Application
                    </button>
                }
            />

            {/* Kanban Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-5 items-start">
                {statuses.map(status => {
                    const columnApps = applications.filter(a => a.status === status);
                    return (
                        <div
                            key={status}
                            className="bg-white/70 backdrop-blur-xl border border-white/70 rounded-2xl md:rounded-3xl shadow-sm p-3 md:p-4 flex flex-col max-h-[72vh] md:max-h-[68vh]"
                        >
                            {/* Column Header */}
                            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${getStatusHeaderStyles(status)} flex items-center justify-between mb-3 md:mb-4`}>
                                <div className="flex items-center gap-2 md:gap-2.5 font-black uppercase tracking-wide text-xs md:text-sm text-slate-900">
                                    <div className={`p-1.5 rounded-lg ${getStatusAccentStyles(status)}`}>
                                        {getStatusIcon(status)}
                                    </div>
                                    {statusLabels[status]}
                                </div>
                                <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-md md:rounded-lg text-xs md:text-sm font-black ${getStatusAccentStyles(status)}`}>
                                    {columnApps.length}
                                </span>
                            </div>

                            <div className="space-y-2 md:space-y-3 overflow-y-auto pr-1 flex-1">
                                {columnApps.map(app => (
                                    <div
                                        key={app.id}
                                        className={`p-3 md:p-4 rounded-xl md:rounded-2xl group relative transition-all border ${
                                            status === 'pending'
                                                ? 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-md'
                                                : status === 'accepted'
                                                    ? 'bg-emerald-50/70 border-emerald-200'
                                                    : 'bg-red-50/70 border-red-200'
                                        }`}
                                    >
                                        <button
                                            onClick={() => openConfirmDialog(app.id, status === 'pending')}
                                            className="absolute top-3 right-3 z-20 text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
                                            title={status === 'pending' ? 'Cancel Application' : 'Remove'}
                                        >
                                            <X size={15} />
                                        </button>

                                        <div className="pr-7">
                                            {status === 'pending' ? (
                                                <h3
                                                    onClick={() => navigate(`/student/program/${app.program_id}`)}
                                                    className="font-black text-slate-800 text-base leading-tight mb-1.5 hover:text-indigo-700 cursor-pointer transition-colors"
                                                >
                                                    {app.program_name || app.program}
                                                </h3>
                                            ) : (
                                                <h3 className="font-black text-slate-800 text-base leading-tight mb-1.5">
                                                    {app.program_name || app.program}
                                                </h3>
                                            )}

                                            <p className="text-sm text-slate-600 font-bold">
                                                {app.university || app.country || 'Program application'}
                                            </p>
                                        </div>

                                        {status === 'pending' && (
                                            <div className="mt-3 flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-1.5 text-[11px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-2 rounded-lg border border-indigo-100">
                                                    <Clock size={13} className="text-indigo-500" />
                                                    <span>{formatDate(app.deadline)}</span>
                                                </div>

                                                <div className="flex gap-1.5">
                                                    <button
                                                        onClick={() => moveApplication(app, 'accepted')}
                                                        className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition-all border border-emerald-100"
                                                        title="Accept"
                                                    >
                                                        <CheckCircle size={16} strokeWidth={2.5} />
                                                    </button>
                                                    <button
                                                        onClick={() => moveApplication(app, 'rejected')}
                                                        className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-all border border-red-100"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} strokeWidth={2.5} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {columnApps.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-white/30 text-slate-400 text-sm font-semibold flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Plus className="text-slate-300" size={22} />
                                        </div>
                                        <p>No applications in this stage</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ isOpen: false, appId: null, isPending: false })}
                onConfirm={handleConfirmedAction}
                title={confirmDialog.isPending ? 'Cancel Application' : 'Remove Application'}
                message={confirmDialog.isPending
                    ? 'Are you sure you want to cancel this application? This action cannot be undone.'
                    : 'Are you sure you want to remove this application from this stage?'
                }
                confirmText={confirmDialog.isPending ? 'Cancel Application' : 'Remove'}
            />
        </div>
    );
};

export default Tracker;
