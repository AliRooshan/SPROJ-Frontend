import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Target, Shield, Rocket, Star, Globe, Compass } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen text-slate-900 overflow-hidden selection:bg-primary selection:text-white relative">

            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 bg-pattern">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-amber-50 to-pink-50"></div>
                <div className="blob-glow bg-indigo-400 w-[500px] h-[500px] top-0 left-0 -translate-x-1/2 -translate-y-1/2"></div>
                <div className="blob-glow bg-pink-400 w-[400px] h-[400px] bottom-0 right-0 translate-x-1/3 translate-y-1/3"></div>
                <div className="blob-glow bg-amber-400 w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-8 pb-6 px-3 sm:px-6 md:pt-15 md:pb-10 lg:px-8 max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-4 md:mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">EdVoyage</span>
                        <br />
                        <span className="text-slate-900">Study Abroad.</span>
                    </h1>

                    <p className="text-sm sm:text-base md:text-xl text-slate-600 mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Your all-in-one platform for discovering programs, managing applications, and planning your global education journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/login" state={{ isSignUp: true }} className="group relative w-full sm:w-auto text-center px-5 py-2.5 sm:px-7 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-full text-sm sm:text-base overflow-hidden transition-transform hover:scale-105 shadow-glow">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative flex items-center gap-2">
                                Start Now <ArrowRight size={18} />
                            </span>
                        </Link>
                        <Link to="/explore" className="w-full sm:w-auto text-center px-5 py-2.5 sm:px-7 sm:py-3.5 bg-white/80 border border-indigo-200 hover:bg-white hover:border-indigo-300 text-indigo-700 font-bold rounded-full text-sm sm:text-base backdrop-blur-md transition-all shadow-sm hover:shadow-md">
                            Explore Programs
                        </Link>
                    </div>
                </section>

                {/* Features Bento Grid */}
                <section className="py-8 px-3 sm:px-6 md:py-16 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-6 md:mb-10">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 leading-tight">
                            <span className="gradient-text-hero">Why Choose EdVoyage?</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-xl mx-auto px-1">Everything you need to make your study abroad dreams a reality</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5 auto-rows-[minmax(200px,auto)] md:auto-rows-[260px]">

                        {/* Large Card */}
                        <div className="md:col-span-2 glass-card rounded-2xl md:rounded-[2rem] p-5 md:p-8 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop" alt="AI Technology" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-11 h-11 rounded-2xl bg-white/90 flex items-center justify-center mb-5 text-indigo-600 border border-indigo-200 shadow-lg">
                                        <Compass size={22} />
                                    </div>
                                    <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 text-slate-900 drop-shadow-sm">AI-Driven Discovery</h3>
                                    <p className="text-slate-700 text-sm md:text-base max-w-md font-medium">Our engine analyzes thousands of programs to find your perfect match instantly based on your profile, preferences, and goals.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="md:row-span-2 glass-card rounded-2xl md:rounded-[2rem] p-5 md:p-8 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0">
                                <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop" alt="University Campus" className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-700" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent"></div>
                            <div className="relative z-20 h-full flex flex-col justify-end">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Globe size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">Global Campus</h3>
                                <p className="text-slate-800 font-medium leading-relaxed text-sm">Access universities across the globe with a single profile. From Ivy League to European excellence.</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card rounded-2xl md:rounded-[2rem] p-5 md:p-7 flex flex-col justify-center items-center text-center group card-hover relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Planning" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center mb-4 text-cyan-600 group-hover:scale-110 transition-transform mx-auto shadow-lg border border-cyan-200">
                                    <Target size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-1.5 text-slate-900">Precision Tracking</h3>
                                <p className="text-slate-700 font-medium text-sm">Kanban-style application management keeps you organized and on track.</p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="glass-card rounded-2xl md:rounded-[2rem] p-5 md:p-7 flex flex-col justify-center items-center text-center group card-hover relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" alt="Travel" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center mb-4 text-amber-600 group-hover:scale-110 transition-transform mx-auto shadow-lg border border-amber-200">
                                    <Shield size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-1.5 text-slate-900">Visa Guidance</h3>
                                <p className="text-slate-700 font-medium text-sm">Step-by-step document checklists and expert guidance for every country.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* About Section */}
                <section className="py-8 px-3 sm:px-6 md:py-14 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-6 md:mb-10">
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-2 md:mb-4 leading-tight">
                            <span className="gradient-text-hero">Your Journey to Global Education</span>
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
                            We're on a mission to make studying abroad accessible, affordable, and achievable for every student with a dream.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-3 md:gap-6">
                        <div className="glass-card rounded-xl md:rounded-2xl p-5 md:p-7 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Team collaboration" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <Rocket size={26} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Mission</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">Empower students worldwide to pursue their educational dreams by simplifying the complex process of studying abroad.</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-xl md:rounded-2xl p-5 md:p-7 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" alt="Global vision" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <Star size={26} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Vision</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">A world where every student has equal access to quality education, regardless of geographical or financial barriers.</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-xl md:rounded-2xl p-5 md:p-7 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop" alt="Trust and values" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-5 text-white shadow-lg group-hover:scale-110 transition-transform">
                                    <Shield size={26} strokeWidth={2} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Values</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">Transparency, innovation, and student success drive everything we do. Your dreams are our priority.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-indigo-100 bg-white/50 backdrop-blur-sm mt-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">

                            <div>
                                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Quick Links</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><Link to="/explore" className="text-slate-600 hover:text-indigo-600 transition-colors">Explore Programs</Link></li>
                                    <li><Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link></li>
                                    <li><Link to="/login" state={{ isSignUp: true }} className="text-slate-600 hover:text-indigo-600 transition-colors">Sign Up</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">Resources</h3>
                                <ul className="space-y-2 text-sm">
                                    {['Scholarships', 'Visa Guide', 'Cost Calculator', 'Tracker'].map(item => (
                                        <li key={item} className="text-slate-500 cursor-default">{item}</li>
                                    ))}
                                </ul>
                            </div>

                        </div>

                        <div className="pt-5 border-t border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-3">
                            <p className="text-slate-500 text-sm">© 2026 EdVoyage. All rights reserved.</p>
                            <div className="flex gap-5 text-sm">
                                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Privacy Policy</a>
                                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Terms of Service</a>
                                <a href="#" className="text-slate-500 hover:text-indigo-600 transition-colors">Contact</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>

        </div>
    );
};

export default Landing;
