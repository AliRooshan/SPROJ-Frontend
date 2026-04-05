import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Filter, MoreHorizontal, BookOpen, MapPin, X, Edit2, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ManagePrograms = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [localPrograms, setLocalPrograms] = useState([]);
    const [allPrograms, setAllPrograms] = useState([]);

    useEffect(() => {
        api.get('/programs')
            .then(data => {
                const mapped = data.map(item => ({
                    id: item.id,
                    name: item.program,
                    universityName: item.university,
                    location: item.country,
                    uniImage: item.logo || item.image,
                    fees: `${item.currency}${Number(item.tuition).toLocaleString()}`,
                    duration: item.duration || '2 Years'
                }));
                setAllPrograms(mapped);
                setLocalPrograms(mapped);
            })
            .catch(console.error);
    }, []);

    const [filterCountry, setFilterCountry] = useState('All');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);

    // Check for URL action
    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSearchParams({}); // Clear query params
    };

    const handleAddProgram = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newProgram = {
            id: Math.random(), // Temporary ID
            name: formData.get('programName'),
            universityName: formData.get('university'),
            location: formData.get('country'),
            uniImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f', // Placeholder
            fees: `$${formData.get('tuition')}`,
            duration: '2 Years'
        };

        setLocalPrograms([newProgram, ...localPrograms]);
        handleCloseModal();
    };

    const handleEditProgram = (prog) => {
        setEditingProgram(prog);
        setIsEditModalOpen(true);
        setOpenMenuId(null);
    };

    const handleUpdateProgram = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedPrograms = localPrograms.map(p =>
            p.id === editingProgram.id ? {
                ...p,
                name: formData.get('programName'),
                universityName: formData.get('university'),
                location: formData.get('country'),
                fees: `$${formData.get('tuition')}`
            } : p
        );
        setLocalPrograms(updatedPrograms);
        setIsEditModalOpen(false);
        setEditingProgram(null);
    };

    const handleDeleteProgram = (id) => {
        setLocalPrograms(localPrograms.filter(p => p.id !== id));
        setDeleteConfirmId(null);
        setOpenMenuId(null);
    };

    const countries = ['All', ...new Set(allPrograms.map(p => p.location))];

    const filteredPrograms = localPrograms.filter(prog => {
        const matchesSearch = prog.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            prog.universityName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCountry = filterCountry === 'All' || prog.location === filterCountry;
        return matchesSearch && matchesCountry;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Programs</h1>
                    <p className="text-zinc-400 font-medium">Manage university programs and details.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={18} />
                    <span>Add Program</span>
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-[#18181b] p-4 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search programs, universities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all"
                    />
                </div>
                <div className="flex gap-2 relative">
                    <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-zinc-300 font-bold hover:bg-zinc-800 flex items-center gap-2"
                    >
                        <Filter size={18} />
                        <span>Filter</span>
                        {filterCountry !== 'All' && (
                            <span className="ml-1 px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full">1</span>
                        )}
                    </button>

                    {/* Filter Dropdown */}
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-14 w-56 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                            <div className="p-3 border-b border-zinc-800">
                                <h4 className="font-bold text-white text-sm">Filter by Country</h4>
                            </div>
                            <div className="p-2 max-h-64 overflow-y-auto">
                                {countries.map(country => (
                                    <button
                                        key={country}
                                        onClick={() => {
                                            setFilterCountry(country);
                                            setShowFilterDropdown(false);
                                        }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterCountry === country
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                                            }`}
                                    >
                                        {country}
                                    </button>
                                ))}
                            </div>
                            {filterCountry !== 'All' && (
                                <div className="p-2 border-t border-zinc-800">
                                    <button
                                        onClick={() => {
                                            setFilterCountry('All');
                                            setShowFilterDropdown(false);
                                        }}
                                        className="w-full px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        Clear Filter
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content List as Cards */}
            <div className="grid grid-cols-1 gap-4">
                {filteredPrograms.map((prog, idx) => (
                    <div key={idx} className="group bg-[#18181b] p-6 rounded-2xl border border-zinc-800 hover:border-amber-500/30 hover:bg-zinc-800/80 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-start gap-5">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">{prog.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-400 font-medium">
                                    <span className="flex items-center gap-1.5 ">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                                        {prog.universityName}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={14} /> {prog.location}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                            <div className="text-right">
                                <span className="block text-white font-bold text-lg">{prog.fees}</span>
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{prog.duration}</span>
                            </div>
                            <div className="flex gap-2 relative">
                                <button
                                    onClick={() => setOpenMenuId(openMenuId === prog.id ? null : prog.id)}
                                    className="p-2 hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
                                >
                                    <MoreHorizontal size={20} />
                                </button>

                                {/* Three-dot Menu */}
                                {openMenuId === prog.id && (
                                    <div className="absolute right-0 top-10 w-48 bg-[#18181b] border border-zinc-800 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-2 duration-200">
                                        <div className="p-2">
                                            <button
                                                onClick={() => handleEditProgram(prog)}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                                Edit Program
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDeleteConfirmId(prog.id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                Delete Program
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredPrograms.length === 0 && (
                    <div className="p-12 text-center text-zinc-500">
                        No programs found matching your search.
                    </div>
                )}
            </div>

            {/* Add Program Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Add New Program</h2>
                            <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddProgram} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">Program Name</label>
                                <input name="programName" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. MSc Computer Science" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">University</label>
                                <input name="university" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Stanford University" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Country</label>
                                    <input name="country" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. USA" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Tuition (USD)</label>
                                    <input name="tuition" required type="number" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="50000" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">Create Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Program Modal */}
            {isEditModalOpen && editingProgram && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Edit Program</h2>
                            <button onClick={() => {
                                setIsEditModalOpen(false);
                                setEditingProgram(null);
                            }} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateProgram} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">Program Name</label>
                                <input
                                    name="programName"
                                    required
                                    type="text"
                                    defaultValue={editingProgram.name}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">University</label>
                                <input
                                    name="university"
                                    required
                                    type="text"
                                    defaultValue={editingProgram.universityName}
                                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Country</label>
                                    <input
                                        name="country"
                                        required
                                        type="text"
                                        defaultValue={editingProgram.location}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Tuition (USD)</label>
                                    <input
                                        name="tuition"
                                        required
                                        type="number"
                                        defaultValue={editingProgram.fees.replace(/[^0-9]/g, '')}
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setEditingProgram(null);
                                    }}
                                    className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">
                                    Update Program
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800">
                            <h2 className="text-xl font-black text-white">Delete Program?</h2>
                            <p className="text-sm text-zinc-400 mt-2">This action cannot be undone. The program will be permanently removed.</p>
                        </div>
                        <div className="p-6 flex gap-3">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDeleteProgram(deleteConfirmId)}
                                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagePrograms;
