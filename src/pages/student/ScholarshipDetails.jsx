import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, ExternalLink, ChevronLeft, Award, CheckCircle } from 'lucide-react';
import AuthService from '../../services/AuthService';
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

const ScholarshipDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scholarship, setScholarship] = useState(null);
    const [isSaved, setIsSaved] = useState(false);
    const requirementsList = Array.isArray(scholarship?.requirements)
        ? scholarship.requirements
        : typeof scholarship?.requirements === 'string'
            ? scholarship.requirements.split('\n').filter(Boolean)
            : [];
    const scholarshipAmount = Number(scholarship?.amount ?? 0);

    useEffect(() => {
        api.get(`/scholarships/${id}`)
            .then(data => {
                setScholarship(data);
                setIsSaved(AuthService.isScholarshipSaved(data.id));
            })
            .catch(err => console.error('Failed to load scholarship:', err));
    }, [id]);

    const handleSave = async () => {
        try {
            const newSavedState = await AuthService.toggleSavedScholarship(scholarship);
            setIsSaved(newSavedState);
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (!scholarship) return <div className="p-12 text-center text-slate-500 font-bold animate-pulse">Loading scholarship details...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <PageHeader
                title={scholarship.name}
                subtitle={`${scholarship.provider}`}
                icon={Award}
                actions={
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50/95 hover:bg-white text-indigo-900 font-bold rounded-xl transition-all border border-white/50 backdrop-blur-md shadow-sm"
                    >
                        <ChevronLeft size={18} />
                        Back
                    </button>
                }
            />

            {/* Action Buttons Row */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => { window.open(scholarship.website || scholarship.url || '#', '_blank'); }}
                    className="flex items-center gap-2 px-5 py-3 bg-transparent text-indigo-600 font-bold rounded-xl border-2 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm"
                >
                    <ExternalLink size={16} />
                    Visit Website
                </button>
                <div className="flex-1" />
                <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-3 font-bold rounded-xl transition-all text-sm border-2 shadow-sm ${isSaved
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 shadow-red-50'
                        : 'bg-white border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 shadow-slate-100'
                        }`}
                >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    {isSaved ? 'Unsave Scholarship' : 'Save Scholarship'}
                </button>
            </div>

            {/* Scholarship Details + Requirements — two columns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-start">
                {/* Scholarship Details Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4 md:p-7 md:space-y-6 h-full">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                            <Award size={22} />
                        </div>
                        <h2 className="text-xl font-black text-slate-900">Scholarship Details</h2>
                    </div>

                    {/* Compact stat chips */}
                    <div className="flex items-stretch gap-2.5">
                        <div className="flex flex-col px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-lg flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Value</span>
                            <span className="text-sm font-black text-slate-800">
                                {scholarship.amount != null ? `${scholarship.currency || ''} ${scholarshipAmount.toLocaleString()}` : 'N/A'}
                            </span>
                        </div>
                        <div className="flex flex-col px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-lg flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Type</span>
                            <span className="text-sm font-black text-slate-800">{scholarship.type || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-lg flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Country</span>
                            <span className="text-sm font-black text-slate-800">{scholarship.country || 'N/A'}</span>
                        </div>
                        <div className="flex flex-col px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-lg flex-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Deadline</span>
                            <span className="text-sm font-black text-slate-800">{formatDate(scholarship.deadline)}</span>
                        </div>
                    </div>

                    <p className="text-slate-600 text-medium leading-relaxed">
                        {scholarship.description || <p className="text-slate-400 text-medium font-medium italic">No description available.</p>}
                    </p>
                </div>

                {/* Requirements */}
                {requirementsList.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 md:p-7 md:space-y-5 h-full">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <CheckCircle size={22} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Requirements</h2>
                        </div>
                        <ul className="space-y-2.5">
                            {requirementsList.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3 py-2.5 px-4 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-100 transition-colors">
                                    <span className="text-slate-700 text-sm font-medium leading-relaxed">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3 md:p-7 md:space-y-5 h-full">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                <CheckCircle size={22} />
                            </div>
                            <h2 className="text-xl font-black text-slate-900">Requirements</h2>
                        </div>
                        <p className="text-slate-400 text-medium font-medium italic">No requirements specified.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ScholarshipDetails;
