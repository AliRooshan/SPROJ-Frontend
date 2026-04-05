import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ChevronLeft, Search, DollarSign, Clock, Building2, MapPin } from 'lucide-react';
import AuthService from '../../services/AuthService';

const SavedScholarships = () => {
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Back Button */}
            <button
                onClick={() => navigate('/student/dashboard')}
                className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-white/50"
            >
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-emerald-100 transition-colors shadow-sm">
                    <ChevronLeft size={18} />
                </div>
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1621600411688-4be93cd68504?q=80&w=2070&auto=format&fit=crop"
                        alt="Scholarship Funding"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-900/80 to-green-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                        <Award size={12} className="text-emerald-300" />
                        Your Collection
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                        Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 to-white">Scholarships</span>
                    </h1>
                    <p className="text-emerald-100/90 text-lg font-medium max-w-xl leading-relaxed">
                        You have <span className="text-white font-bold">{savedScholarships.length} scholarships</span> saved to your collection.
                    </p>
                </div>
            </div>

            {/* Scholarships Grid */}
            {savedScholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedScholarships.map(scholarship => (
                        <div
                            key={scholarship.id}
                            className="group relative bg-white/70 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-400 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-black text-xl text-slate-800 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                            {scholarship.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-3">
                                            <Building2 size={16} className="text-emerald-500" />
                                            <span className="line-clamp-1">{scholarship.provider}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${scholarship.status === 'Eligible' ? 'bg-emerald-100 text-emerald-700' :
                                        scholarship.status === 'Not Eligible' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>
                                        {scholarship.status}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <DollarSign size={18} className="text-emerald-600" />
                                            <span className="text-sm font-bold text-slate-600">Award Value</span>
                                        </div>
                                        <span className="text-lg font-black text-emerald-700">{scholarship.amount}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Clock size={18} className="text-slate-500" />
                                            <span className="text-sm font-bold text-slate-600">Deadline</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{scholarship.deadline}</span>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5">
                                            <MapPin size={14} />
                                            {scholarship.country}
                                        </span>
                                        <span className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600">
                                            {scholarship.type}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-3 border-t border-slate-100">
                                    <button
                                        onClick={() => navigate(`/student/scholarships/${scholarship.id}`)}
                                        className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg hover:shadow-emerald-200"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleToggleSave(scholarship)}
                                        className="px-4 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-200"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white/60 backdrop-blur-xl border-2 border-dashed border-emerald-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Search className="text-emerald-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-3">No saved scholarships yet</h3>
                    <p className="text-slate-500 mb-8 max-w-md">Discover funding opportunities to support your studies abroad.</p>
                    <button
                        onClick={() => navigate('/student/scholarships')}
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all"
                    >
                        Explore Scholarships
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedScholarships;
