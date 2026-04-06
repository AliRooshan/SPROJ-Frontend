import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Star, Bookmark, GraduationCap } from 'lucide-react';

const ProgramCard = ({ program, isGuest = false, isSaved = false, onToggleSave }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);

    const handleDetailsClick = () => {
        if (isGuest) {
            navigate('/login');
        } else {
            navigate(`/student/program/${program.id}`);
        }
    };

    const handleSaveClick = (e) => {
        e.stopPropagation(); // Prevent card click
        if (isGuest) {
            navigate('/login');
            return;
        }
        if (onToggleSave) onToggleSave(program);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        if (dateString.includes('T')) {
            return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }
        return dateString;
    };

    return (
        <div className="rounded-2xl overflow-hidden group flex flex-col h-full card-hover relative transition-all duration-300 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100 shadow-md hover:shadow-xl">
            <div className="relative h-48 overflow-hidden bg-slate-100">
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/80 via-transparent to-transparent z-10"></div>
                {!imageError ? (
                    <img
                        src={program.image}
                        alt={program.name}
                        onError={() => setImageError(true)}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 group-hover:bg-indigo-200 transition-colors">
                        <GraduationCap size={48} className="text-indigo-300" />
                    </div>
                )}

                {!isGuest && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-900 shadow-lg flex items-center gap-1 z-20 border-2 border-amber-200">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {program.matchScore}% Match
                    </div>
                )}

                {!isGuest && (
                    <button
                        onClick={handleSaveClick}
                        className={`absolute top-3 left-3 p-2 backdrop-blur-md rounded-full transition z-20 border-2 shadow-md ${isSaved ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white/95 text-slate-600 hover:bg-indigo-600 hover:text-white border-indigo-200 hover:border-indigo-600'}`}
                    >
                        <Bookmark size={16} className={isSaved ? "fill-current" : ""} />
                    </button>
                )}
            </div>

            <div className="p-5 flex-grow flex flex-col relative z-20">
                <div className="mb-4">
                    <h3 className="font-display font-bold text-lg text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                        {program.program}
                    </h3>
                    <p className="text-slate-700 text-sm font-semibold flex items-center gap-2">
                        <GraduationCap size={14} className="text-indigo-600" />
                        {program.university}
                    </p>
                </div>

                <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-indigo-600" />
                        <span className="text-slate-800 font-medium">{program.city ? `${program.city}, ` : ''}{program.country}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-indigo-600" />
                        <span className="text-slate-800 font-medium">{program.currency} {program.tuition.toLocaleString()} / year</span>
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t-2 border-indigo-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider">
                        <Calendar size={14} />
                        <span>{formatDate(program.deadline)}</span>
                    </div>
                    <button
                        onClick={handleDetailsClick}
                        className="px-4 py-2 bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 text-slate-700 hover:text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg border-2 border-indigo-200 hover:border-transparent"
                    >
                        {isGuest ? 'Login to View' : 'Details'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProgramCard;
