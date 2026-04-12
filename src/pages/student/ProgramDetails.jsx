import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle, Bookmark, PlusCircle, ChevronLeft,
    GraduationCap, Globe, ExternalLink, XCircle, X
} from 'lucide-react';
import AuthService from '../../services/AuthService';
import PageHeader from '../../components/PageHeader';
import ConfirmDialog from '../../components/ConfirmDialog';
import api from '../../services/api';

const ProgramDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [program, setProgram] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const [existingApplication, setExistingApplication] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [user, setUser] = useState(null);
    const eligibilityList = Array.isArray(program?.eligibility)
        ? program.eligibility
        : typeof program?.eligibility === 'string'
            ? program.eligibility.split('\n').filter(Boolean)
            : [];

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);

        api.get(`/programs/${id}`)
            .then(data => {
                setProgram(data);
                if (currentUser) {
                    setIsSaved(AuthService.isProgramSaved(data.id));
                    AuthService.getApplications().then(apps => {
                        const app = apps.find(a => String(a.program_id) === String(data.id));
                        setExistingApplication(app || null);
                    });
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
            if (existingApplication) {
                setShowConfirm(true);
            } else {
                const newApp = await AuthService.addApplication({
                    programId: program.id,
                    university: program.university,
                    program: program.program,
                    deadline: program.deadline,
                    country: program.country,
                    status: 'pending',
                });
                setExistingApplication(newApp);
            }
        } catch (err) {
            console.error('Failed to modify application:', err.message);
        }
    };

    const handleConfirmCancel = async () => {
        try {
            await AuthService.deleteApplication(existingApplication.id);
            setExistingApplication(null);
        } catch (err) {
            console.error('Failed to cancel application:', err.message);
            throw err;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (!program) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading program details...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <PageHeader
                title={program.program}
                subtitle={`${program.university} · ${program.city}, ${program.country}`}
                icon={GraduationCap}
                forceRow={true}
                actions={
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-4 md:!py-2 bg-indigo-50/95 hover:bg-white text-indigo-900 font-bold rounded-xl transition-all border border-white/50 backdrop-blur-md shadow-sm shrink-0"
                    >
                        <ChevronLeft size={18} />
                        <span className="hidden md:inline">Back</span>
                    </button>
                }
            />

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => {
                        if (existingApplication) {
                            if (existingApplication.status === 'accepted' || existingApplication.status === 'rejected') {
                                navigate('/student/tracker');
                            } else {
                                handleAddToTracker();
                            }
                        } else {
                            handleAddToTracker();
                        }
                    }}
                    className={`flex items-center justify-center gap-2.5 px-5 py-2.5 md:px-7 md:py-3 font-bold rounded-xl transition-all shadow-lg text-[13px] md:text-sm shrink-0 ${existingApplication
                        ? existingApplication.status === 'accepted'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 shadow-emerald-50'
                            : existingApplication.status === 'rejected'
                                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-red-50'
                                : 'bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100 hover:border-orange-300 shadow-orange-50'
                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white hover:shadow-xl hover:shadow-purple-200 hover:-translate-y-0.5'
                        }`}
                >
                    <div className="hidden md:flex items-center">
                        {existingApplication
                            ? (existingApplication.status === 'accepted' ? <CheckCircle size={18} /> : existingApplication.status === 'rejected' ? <XCircle size={18} /> : <Bookmark fill="currentColor" size={18} />)
                            : <PlusCircle size={18} />}
                    </div>
                    <span className="md:hidden tracking-wide">
                        {existingApplication
                            ? (existingApplication.status === 'accepted' ? 'Accepted' : existingApplication.status === 'rejected' ? 'Rejected' : 'Cancel')
                            : 'Apply'}
                    </span>
                    <span className="hidden md:inline">
                        {existingApplication
                            ? (existingApplication.status === 'accepted' ? 'Accepted' : existingApplication.status === 'rejected' ? 'Rejected' : 'Cancel Application')
                            : 'Start Application'}
                    </span>
                </button>
                <button
                    onClick={() => { window.open(program.website || program.url || '#', '_blank'); }}
                    className="flex items-center justify-center gap-2 w-11 h-11 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-3 bg-transparent text-indigo-600 font-bold rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm shrink-0"
                >
                    <ExternalLink size={16} />
                    <span className="hidden md:inline">Visit Website</span>
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleSave}
                    className={`flex items-center justify-center gap-2 w-11 h-11 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-3 font-bold rounded-xl transition-all text-sm border-2 shadow-sm shrink-0 ${isSaved
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-red-50'
                        : 'bg-white border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 shadow-slate-100'
                        }`}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    <span className="hidden md:inline">{isSaved ? 'Unsave Program' : 'Save Program'}</span>
                </button>
            </div>

            {/* Program Overview + Eligibility — two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                {/* Program Overview */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4 md:p-7 md:space-y-6 h-full">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                            <Globe size={22} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Program Overview</h2>
                    </div>

                    {/* Compact stat chips — above description */}
                    <div className="flex items-stretch gap-2 md:gap-2.5 w-full">
                        <div className="flex flex-col px-2.5 py-2 md:px-3.5 bg-slate-50 border border-slate-100 rounded-lg flex-1 min-w-0 overflow-hidden">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide md:tracking-widest mb-0.5 truncate">Duration</span>
                            <span className="text-xs md:text-sm font-black text-slate-800 truncate">{program.duration || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-2 md:px-3.5 bg-slate-50 border border-slate-100 rounded-lg flex-1 min-w-0 overflow-hidden">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide md:tracking-widest mb-0.5 truncate">Intake</span>
                            <span className="text-xs md:text-sm font-black text-slate-800 truncate">{formatDate(program.deadline)}</span>
                        </div>
                        <div className="flex flex-col px-2.5 py-2 md:px-3.5 bg-slate-50 border border-slate-100 rounded-lg flex-1 min-w-0 overflow-hidden">
                            <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wide md:tracking-widest mb-0.5 truncate">Tuition</span>
                            <span className="text-xs md:text-sm font-black text-slate-800 truncate">
                                {program.tuition != null ? `$${Number(program.tuition).toLocaleString()}` : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <p className="text-slate-600 text-medium leading-relaxed">
                        {program.description || 'No description available.'}
                    </p>
                </div>

                {/* Eligibility Criteria */}
                {eligibilityList.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 md:p-7 md:space-y-5 h-full">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <CheckCircle size={22} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Eligibility Criteria</h2>
                        </div>
                        <ul className="space-y-2.5">
                            {eligibilityList.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3 py-2.5 px-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors">
                                    <span className="text-slate-700 text-sm font-medium leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-7 h-full flex items-center justify-center">
                        <p className="text-slate-400 text-sm font-medium italic">No eligibility criteria specified.</p>
                    </div>
                )}
            </div>

            <ConfirmDialog
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Application"
                message="Are you sure you want to cancel this application? It will be removed from your tracker and this action cannot be undone."
                confirmText="Cancel Application"
                cancelText="Keep Application"
            />
        </div>
    );
};

export default ProgramDetails;
