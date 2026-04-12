import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';

const PublicLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Header - Enhanced */}
            <header className="border-b border-indigo-100 sticky top-0 bg-white/90 backdrop-blur-md z-50 shadow-sm relative">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 md:gap-3 group min-w-0">
                        <div className="w-9 h-9 md:w-11 md:h-11 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:shadow-glow transition-all group-hover:scale-110 shadow-md shrink-0">
                            <Compass className="text-white w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                        </div>
                        <span className="font-display font-black text-lg md:text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight truncate">EdVoyage</span>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center gap-3">
                        <Link to="/explore" className="px-4 py-2 text-sm font-bold text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all">
                            Explore Programs
                        </Link>
                        <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all">
                            Sign In
                        </Link>
                        <Link to="/login" state={{ isSignUp: true }} className="group relative px-5 py-2 text-sm font-black text-white rounded-xl overflow-hidden shadow-glow transition-transform hover:scale-105">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative">Sign Up</span>
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMobileMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-b border-indigo-100 shadow-2xl animate-in slide-in-from-top-5 duration-200">
                        <div className="py-2 px-3 space-y-1">
                            <Link
                                to="/explore"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            >
                                Explore Programs
                            </Link>
                            <Link
                                to="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/login"
                                state={{ isSignUp: true }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md mt-1"
                            >
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default PublicLayout;
