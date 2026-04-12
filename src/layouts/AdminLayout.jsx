import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen relative flex selection:bg-amber-300 selection:text-zinc-900 overflow-hidden bg-zinc-200 font-sans text-zinc-800">
            {/* Soft warm light shell (not pure white) */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-stone-100 to-zinc-200"></div>
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-200/25 blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-orange-200/20 blur-[120px] pointer-events-none"></div>
            </div>

            <AdminSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 ml-0 md:ml-64 flex flex-col min-w-0 relative min-h-0 h-screen overflow-hidden transition-all duration-300">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center p-4 border-b border-zinc-200/90 bg-zinc-100/90 backdrop-blur-xl sticky top-0 z-40">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 -ml-2 text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-200/80 transition-colors"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="ml-3 font-bold text-lg text-zinc-900">Admin Panel</span>
                </div>

                <main className="flex-1 overflow-y-auto p-3 pb-16 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300/70 hover:scrollbar-thumb-zinc-400/90 md:p-10 md:pb-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
