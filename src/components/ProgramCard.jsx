import React from 'react';
import { MapPin, Building2, Calendar, Clock, DollarSign, Bookmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgramCard = ({ program, isGuest = false, isSaved = false, onToggleSave }) => {
    const programName = program.program ?? program.name ?? 'Program';
    const tuitionValue = Number(program.tuition ?? program.tuition_amount ?? 0);

    const navigate = useNavigate();

    const formatDate = (dateString) => {
        if (!dateString) return 'TBA';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleNavigate = () => {
        navigate(isGuest ? '/login' : `/student/program/${program.id}`);
    };

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-xl md:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 p-3 md:p-4 space-y-1.5 md:space-y-2 group">
            {/* Header: Uni & Actions */}
            <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                    <Building2 size={16} className="text-indigo-500" />
                    {program.university}
                </div>

                {!isGuest && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleSave && onToggleSave(program); }}
                        className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50 hover:text-indigo-600'}`}
                    >
                        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    </button>
                )}
            </div>

            {/* Title */}
            <div className="-mt-1">
                <h3
                    onClick={handleNavigate}
                    className="text-base md:text-lg font-black text-slate-900 leading-tight cursor-pointer hover:text-indigo-600 transition-colors"
                >
                    {programName}
                </h3>
            </div>

            {/* Meta Info Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    {program.city}, {program.country}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Clock size={16} className="text-slate-400" />
                    {program.duration}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <DollarSign size={16} className="text-slate-400" />
                    {program.currency} {tuitionValue.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    {formatDate(program.deadline)}
                </div>
            </div>
        </div>
    );
};

export default ProgramCard;