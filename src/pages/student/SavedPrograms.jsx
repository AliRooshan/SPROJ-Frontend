import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, ChevronLeft, Search } from 'lucide-react';
import ProgramCard from '../../components/ProgramCard';
import PageHeader from '../../components/PageHeader';
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
        <div className="space-y-4 md:space-y-8 animate-in fade-in duration-500 pb-6 md:pb-12">
            <PageHeader
                title="Saved Programs"
                subtitle={`You have ${savedPrograms.length} programs saved to your collection.`}
                icon={BookmarkCheck}
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

            {/* Programs Grid */}
            {savedPrograms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
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
                <div className="bg-white/60 backdrop-blur-xl border-2 border-dashed border-pink-200 rounded-2xl p-8 md:rounded-3xl md:p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="text-pink-400" size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-700 mb-3">No saved programs yet</h3>
                    <p className="text-slate-500 mb-4 md:mb-8 text-sm md:text-base max-w-md">Start exploring universities to build your dream list.</p>
                    <button
                        onClick={() => navigate('/student/explore')}
                        className="px-5 py-2.5 md:px-8 md:py-3 text-sm md:text-base bg-pink-600 text-white rounded-lg md:rounded-xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all"
                    >
                        Explore Programs
                    </button>
                </div>
            )}
        </div>
    );
};

export default SavedPrograms;
