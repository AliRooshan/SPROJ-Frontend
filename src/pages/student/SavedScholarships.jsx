import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronLeft, Search, DollarSign, Calendar, Building2, MapPin, Bookmark } from 'lucide-react';
import PageHeader from '../../components/PageHeader';
import AuthService from '../../services/AuthService';

const SavedScholarships = () => {
    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };
    const navigate = useNavigate();
    const [savedScholarships, setSavedScholarships] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            AuthService.getSavedScholarships()
                .then(setSavedScholarships)
                .catch(console.error);
        } else {
            navigate('/login/student');
        }
    }, [navigate]);

    const handleToggleSave = async (scholarship) => {
        try {
            await AuthService.toggleSavedScholarship(scholarship);
            const updated = await AuthService.getSavedScholarships();
            setSavedScholarships(updated);
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };


    return (
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-6 md:pb-12">
            <PageHeader
                title="Saved Scholarships"
                subtitle={`You have ${savedScholarships.length} scholarships saved to your collection.`}
                icon={Award}
                forceRow={true}
                actions={
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center justify-center gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-4 md:!py-2 bg-indigo-50/95 hover:bg-white text-indigo-900 font-bold rounded-xl transition-all border border-white/50 backdrop-blur-md shadow-sm"
                    >
                        <ChevronLeft size={18} className="shrink-0" />
                        <span className="hidden md:inline">Back to Dashboard</span>
                    </button>
                }
            />

            {/* Scholarships Grid */}
            {savedScholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                    {savedScholarships.map(scholarship => (
                        <div key={scholarship.id} className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 p-4 space-y-3 group flex flex-col">
                            {/* Header: Provider & Remove(Unsave) */}
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                    <Building2 size={16} className="text-indigo-500" />
                                    <span className="line-clamp-1">{scholarship.provider}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleSave(scholarship); }}
                                    className="p-2 rounded-xl transition-all shrink-0 bg-indigo-50 text-indigo-600 hover:bg-red-50 hover:text-red-600"
                                    title="Unsave Scholarship"
                                >
                                    <Bookmark size={18} fill="currentColor" />
                                </button>
                            </div>

                            {/* Title (Clickable) */}
                            <div className="flex-grow">
                                <h3
                                    onClick={() => navigate(`/student/scholarships/${scholarship.scholarship_id ?? scholarship.id}`)}
                                    className="text-lg font-black text-slate-900 leading-tight cursor-pointer hover:text-indigo-600 transition-colors line-clamp-2"
                                >
                                    {scholarship.name}
                                </h3>
                            </div>

                            {/* Meta Info */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <MapPin size={16} className="text-slate-400" />
                                    <span className="truncate">{scholarship.country}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <Award size={16} className="text-slate-400" />
                                    <span className="truncate">{scholarship.type}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <DollarSign size={16} className="text-slate-400" />
                                    <span className="truncate">{scholarship.currency || ''} {Number(scholarship.amount ?? 0).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                                    <Calendar size={16} className="text-slate-400" />
                                    <span className="truncate">{formatDate(scholarship.deadline)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/60 backdrop-blur-xl border-2 border-dashed border-emerald-200 rounded-2xl p-8 md:rounded-3xl md:p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="text-emerald-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-3">No saved scholarships yet</h3>
                    <p className="text-slate-500 mb-4 md:mb-8 text-sm md:text-base max-w-md">Discover funding opportunities to support your studies abroad.</p>
                    <button
                        onClick={() => navigate('/student/scholarships')}
                        className="px-5 py-2.5 md:px-8 md:py-3 text-sm md:text-base bg-emerald-600 text-white rounded-lg md:rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all"
                    >
                        Explore Scholarships
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedScholarships;
