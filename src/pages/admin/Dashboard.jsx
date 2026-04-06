import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, GraduationCap, DollarSign, Calendar, Activity, Bell, X, TrendingUp } from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState([
        { label: 'Total Programs', value: '—', change: '', icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: 'Scholarships', value: '—', change: '', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
        { label: 'Cost Entries', value: '—', change: '', icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: 'System Status', value: 'Live', change: 'Stable', icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    ]);

    const quickActions = [
        { label: 'Add New Program', icon: BookOpen, path: '/admin/programs?action=add' },
        { label: 'Post Scholarship', icon: GraduationCap, path: '/admin/scholarships?action=add' },
        { label: 'Update Exchange Rates', icon: DollarSign, path: '/admin/costs' },
    ];

    useEffect(() => {
        // Fetch real counts from the database
        Promise.allSettled([
            api.get('/programs'),
            api.get('/scholarships'),
            api.get('/costs'),
        ]).then(([programs, scholarships, costs]) => {
            setStats([
                {
                    label: 'Total Programs',
                    value: programs.status === 'fulfilled' ? programs.value.length.toLocaleString() : '—',
                    change: programs.status === 'fulfilled' ? 'In DB' : 'Error',
                    icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10'
                },
                {
                    label: 'Scholarships',
                    value: scholarships.status === 'fulfilled' ? scholarships.value.length.toLocaleString() : '—',
                    change: scholarships.status === 'fulfilled' ? 'In DB' : 'Error',
                    icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10'
                },
                {
                    label: 'Cost Entries',
                    value: costs.status === 'fulfilled' ? costs.value.length.toLocaleString() : '—',
                    change: costs.status === 'fulfilled' ? 'Cities' : 'Error',
                    icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-500/10'
                },
                {
                    label: 'System Status',
                    value: 'Live', change: 'Stable',
                    icon: Activity, color: 'text-rose-400', bg: 'bg-rose-500/10'
                },
            ]);
        });
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-zinc-400 font-medium">Overview of your platform's performance.</p>
                </div>
                <div className="flex items-center gap-3 relative">

                    <div className="px-4 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center gap-2 text-sm font-bold text-zinc-300">
                        <Calendar size={16} />
                        <span>{new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#18181b] p-6 rounded-[1.5rem] border border-zinc-800 shadow-sm hover:border-zinc-700 hover:shadow-lg transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                {stat.change}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-semibold text-zinc-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Engagement Chart Placeholder */}
                <div className="lg:col-span-2 bg-[#18181b] rounded-[2rem] border border-zinc-800 p-8 shadow-sm flex flex-col justify-center items-center h-[400px]">
                    <TrendingUp size={48} className="text-zinc-800 mb-4" />
                    <h3 className="text-xl font-bold text-zinc-400">Analytics coming soon</h3>
                    <p className="text-zinc-600 text-sm mt-2 text-center">Comprehensive platform insights are under development.</p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[#18181b] rounded-[2rem] border border-zinc-800 p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(action.path)}
                                    className="w-full p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-800 transition-all group flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-amber-500 group-hover:bg-amber-500/10 transition-colors">
                                            <action.icon size={18} />
                                        </div>
                                        <span className="font-bold text-zinc-300 group-hover:text-white text-sm">{action.label}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:border-amber-500/50 group-hover:text-amber-500 text-xs font-bold bg-zinc-800">
                                        +
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
