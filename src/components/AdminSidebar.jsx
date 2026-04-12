import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GraduationCap, DollarSign, Settings, LogOut, ShieldCheck } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import AuthService from '../services/AuthService';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/programs', icon: BookOpen, label: 'Programs' },
        { path: '/admin/scholarships', icon: GraduationCap, label: 'Scholarships' },
        { path: '/admin/costs', icon: DollarSign, label: 'Costs' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-zinc-900/35 backdrop-blur-sm z-40 md:hidden animate-fade-in"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 
                bg-zinc-100/95 md:bg-zinc-100/90 backdrop-blur-xl 
                border-r border-zinc-200/90 flex flex-col 
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
            `}>
                {/* Logo Area */}
                <div className="p-6 md:p-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20 shrink-0">
                            <ShieldCheck className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-zinc-900 tracking-tight leading-none">Admin<span className="text-amber-600">.</span></h1>
                            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mt-1">Control Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => onClose?.()}
                            className={({ isActive }) => `
                                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative
                                ${isActive
                                    ? 'bg-white text-zinc-900 shadow-md border border-zinc-200/90'
                                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={`shrink-0 transition-colors ${isActive ? 'text-amber-600' : 'text-zinc-500 group-hover:text-zinc-700'}`} />
                                    <span className="font-bold text-sm tracking-wide">{item.label}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.35)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Area */}
                <div className="p-6 border-t border-zinc-200/80 bg-zinc-200/40">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-600 hover:text-red-600 hover:bg-red-50 transition-all group font-bold text-sm"
                    >
                        <LogOut size={20} className="shrink-0" />
                        <span>Sign Out</span>
                    </button>
                </div>

                <ConfirmDialog
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={confirmLogout}
                    title="Sign Out"
                    message="Are you sure you want to sign out from the admin panel?"
                    confirmText="Sign Out"
                    cancelText="Cancel"
                />
            </aside>
        </>
    );
};

export default AdminSidebar;
