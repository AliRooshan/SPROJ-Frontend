import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, ChevronLeft, Search } from 'lucide-react';
import ProgramCard from '../../components/ProgramCard';
import AuthService from '../../services/AuthService';

const SavedPrograms = () => {
    const navigate = useNavigate();
    const [savedPrograms, setSavedPrograms] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            AuthService.getSavedPrograms()
                .then(setSavedPrograms)
                .catch(console.error);
        } else {
            navigate('/login/student');
        }
    }, [navigate]);

    const handleToggleSave = async (program) => {
        try {
            await AuthService.toggleSavedProgram(program);
            const updated = await AuthService.getSavedPrograms();
            setSavedPrograms(updated);
        } catch (err) {
            console.error('Save failed:', err.message);
        }
    };


    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            {/* Back Button */}
            <button
                onClick={() => navigate('/student/dashboard')}
                className="group flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all px-4 py-2 rounded-xl hover:bg-white/50"
            >
                <div className="p-1.5 bg-white rounded-lg group-hover:bg-indigo-100 transition-colors shadow-sm">
                    <ChevronLeft size={18} />
                </div>
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                        alt="University Campus"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-900/90 via-rose-900/80 to-indigo-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 p-10 md:p-14">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-pink-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                        <BookmarkCheck size={12} className="text-pink-300" />
                        Your Collection
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                        Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-200 to-white">Programs</span>
                    </h1>
                    <p className="text-pink-100/90 text-lg font-medium max-w-xl leading-relaxed">
                        You have <span className="text-white font-bold">{savedPrograms.length} programs</span> saved to your collection.
                    </p>
                </div>
            </div>

            {/* Programs Grid */}
            {savedPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPrograms.map(program => (
                        <ProgramCard
                            key={program.id}
                            program={program}
                            isSaved={true}
                            onToggleSave={handleToggleSave}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white/60 backdrop-blur-xl border-2 border-dashed border-pink-200 rounded-3xl p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Search className="text-pink-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-3">No saved programs yet</h3>
                    <p className="text-slate-500 mb-8 max-w-md">Start exploring universities to build your dream list.</p>
                    <button
                        onClick={() => navigate('/student/explore')}
                        className="px-8 py-3 bg-pink-600 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all"
                    >
                        Explore Programs
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedPrograms;
