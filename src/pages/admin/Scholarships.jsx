import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Award, Calendar, Globe, X, Edit2 } from 'lucide-react';
import scholarshipsData from '../../data/scholarships.json';

const ManageScholarships = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState(null);
    const [localScholarships, setLocalScholarships] = useState(scholarshipsData);

    // Check for URL action
    useEffect(() => {
        if (searchParams.get('action') === 'add') {
            setIsModalOpen(true);
        }
    }, [searchParams]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSearchParams({});
    };

    const handleAddScholarship = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newScholarship = {
            id: Math.random(),
            name: formData.get('title'),
            amount: `${formData.get('currency')} ${formData.get('amount')}`,
            country: formData.get('country'),
            deadline: formData.get('deadline'),
            tags: ["Merit-based", "International"] // Default tags
        };

        setLocalScholarships([newScholarship, ...localScholarships]);
        handleCloseModal();
    };

    const handleEditScholarship = (scholarship) => {
        setEditingScholarship(scholarship);
        setIsEditModalOpen(true);
    };

    const handleUpdateScholarship = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedScholarships = localScholarships.map(s =>
            s.id === editingScholarship.id ? {
                ...s,
                name: formData.get('title'),
                amount: `${formData.get('currency')} ${formData.get('amount')}`,
                country: formData.get('country'),
                deadline: formData.get('deadline')
            } : s
        );
        setLocalScholarships(updatedScholarships);
        setIsEditModalOpen(false);
        setEditingScholarship(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Scholarships</h1>
                    <p className="text-zinc-400 font-medium">Manage and post new scholarship opportunities.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl shadow-lg shadow-amber-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <Plus size={18} />
                    <span>Post Scholarship</span>
                </button>
            </div>

            {/* Grid Layout for Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localScholarships.map((sch, index) => (
                    <div key={sch.id || index} className="bg-[#18181b] p-6 rounded-[2rem] border border-zinc-800 hover:border-amber-500/30 hover:-translate-y-1 transition-all shadow-sm group relative overflow-hidden flex flex-col h-full">
                        {/* Decorative Top Gradient */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-600"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-zinc-800 rounded-2xl text-amber-500 group-hover:scale-110 transition-transform">
                                <Award size={24} />
                            </div>
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-bold text-zinc-400 flex items-center gap-1 line-clamp-1 max-w-[50%]">
                                <Globe size={12} className="shrink-0" /> {sch.country || 'Global'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-amber-400 transition-colors line-clamp-2">{sch.name}</h3>

                        <div className="space-y-4 mt-auto pt-6">
                            <div className="flex justify-between items-center text-sm border-b border-zinc-800 pb-3">
                                <span className="text-zinc-500 font-bold shrink-0">Value</span>
                                <span className="text-white font-mono font-bold text-right truncate ml-2">{sch.amount}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-zinc-500 font-bold">Deadline</span>
                                <span className="text-zinc-300 font-bold flex items-center gap-1">
                                    <Calendar size={14} className="text-amber-500" /> {sch.deadline}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => handleEditScholarship(sch)}
                                className="w-full py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 hover:text-white transition-all flex items-center justify-center gap-2 group-hover/btn"
                            >
                                Edit Details
                                <Edit2 size={16} className="text-amber-500" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder Card */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="border-2 border-dashed border-zinc-800 rounded-[2rem] p-6 flex flex-col items-center justify-center text-center gap-3 hover:border-amber-500/30 hover:bg-zinc-900/30 transition-all cursor-pointer group min-h-[350px] w-full"
                >
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-amber-500 transition-colors">
                        <Plus size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-400 group-hover:text-zinc-200">Create New</h3>
                </button>
            </div>

            {/* Add Scholarship Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Post Scholarship</h2>
                            <button onClick={handleCloseModal} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddScholarship} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">Scholarship Title</label>
                                <input name="title" required type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="e.g. Global Excellence Award" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Amount</label>
                                    <input name="amount" required type="number" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="10000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Currency</label>
                                    <select name="currency" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors">
                                        <option value="$">$ USD</option>
                                        <option value="£">£ GBP</option>
                                        <option value="€">€ EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Country</label>
                                    <input name="country" type="text" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" placeholder="Global" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Deadline</label>
                                    <input name="deadline" required type="date" className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={handleCloseModal} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Scholarship Modal */}
            {isEditModalOpen && editingScholarship && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                            <h2 className="text-xl font-black text-white">Edit Scholarship</h2>
                            <button onClick={() => {
                                setIsEditModalOpen(false);
                                setEditingScholarship(null);
                            }} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateScholarship} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-zinc-400 mb-1.5">Scholarship Title</label>
                                <input name="title" required type="text" defaultValue={editingScholarship.name} className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Amount</label>
                                    <input name="amount" required type="number" defaultValue={editingScholarship.amount.replace(/[^0-9]/g, '')} className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Currency</label>
                                    <select name="currency" defaultValue={editingScholarship.amount.charAt(0)} className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors">
                                        <option value="$">$ USD</option>
                                        <option value="£">£ GBP</option>
                                        <option value="€">€ EUR</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Country</label>
                                    <input name="country" type="text" defaultValue={editingScholarship.country} className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-zinc-400 mb-1.5">Deadline</label>
                                    <input name="deadline" required type="date" defaultValue={editingScholarship.deadline} className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-amber-500 transition-colors" />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => {
                                    setIsEditModalOpen(false);
                                    setEditingScholarship(null);
                                }} className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-bold hover:bg-zinc-700 transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageScholarships;
