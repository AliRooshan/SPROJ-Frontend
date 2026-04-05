import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Globe, Star, Youtube, Twitter, Instagram, ArrowRight, Zap, Target, Shield, Rocket } from 'lucide-react';

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

            {/* Navbar Placeholder (Handled by Layout but visually consistent) */}

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-indigo-200 bg-white/60 backdrop-blur-md text-sm font-medium text-indigo-700 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 hover:bg-white/80 transition-colors cursor-default shadow-sm">
                        <Zap size={14} className="text-amber-500" fill="currentColor" />
                        <span className="tracking-wide uppercase text-xs font-bold">The Future of EdTech</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">EdVoyage</span>
                        <br />
                        <span className="text-slate-900">Study</span> <span className="gradient-text-hero text-glow">Abroad.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Don't settle for basic. EdVoyage brings you the <span className="text-indigo-700 font-bold">premium experience</span> for managing your global education journey.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link to="/login" state={{ isSignUp: true }} className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-full text-lg overflow-hidden transition-transform hover:scale-105 shadow-glow">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="relative flex items-center gap-2">
                                Start Now <ArrowRight size={20} />
                            </span>
                        </Link>
                        <Link to="/explore" className="px-8 py-4 bg-white/80 border border-indigo-200 hover:bg-white hover:border-indigo-300 text-indigo-700 font-bold rounded-full text-lg backdrop-blur-md transition-all shadow-sm hover:shadow-md">
                            Explore Programs
                        </Link>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: '50+', label: 'Countries' },
                            { number: '1000+', label: 'Universities' },
                            { number: '10K+', label: 'Students' },
                            { number: '95%', label: 'Success Rate' }
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl md:text-5xl font-black gradient-text-hero mb-2">{stat.number}</div>
                                <div className="text-slate-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bento Grid Features */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-black text-slate-900 mb-4">Why Choose EdVoyage?</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Everything you need to make your study abroad dreams a reality</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

                        {/* Large Card - AI Discovery with Image */}
                        <div className="md:col-span-2 glass-card rounded-[2rem] p-10 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop" alt="AI Technology" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center mb-6 text-indigo-600 border border-indigo-200 shadow-lg">
                                        <Compass size={24} />
                                    </div>
                                    <h3 className="text-4xl font-bold mb-4 text-slate-900 drop-shadow-sm">AI-Driven Discovery</h3>
                                    <p className="text-slate-700 text-lg max-w-md font-medium">Our neural engine analyzes thousands of programs to find your perfect match instantly. Get personalized recommendations based on your profile, preferences, and goals.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card - Global Campus with Visible Image */}
                        <div className="md:row-span-2 glass-card rounded-[2rem] p-10 relative overflow-hidden group card-hover">
                            {/* Background Image - Visible */}
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                                    alt="University Campus"
                                    className="w-full h-full object-cover opacity-50 group-hover:opacity-60 transition-all duration-700"
                                />
                            </div>
                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/60 to-transparent"></div>
                            <div className="relative z-20 h-full flex flex-col justify-end">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-4 text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Globe size={32} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-3xl font-bold mb-3 text-slate-900">Global Campus</h3>
                                <p className="text-slate-800 font-medium leading-relaxed">Access universities across 50+ countries with a single profile. From Ivy League to European excellence, explore the world's best institutions.</p>
                            </div>
                        </div>

                        {/* Card 3 - Tracking with Icon */}
                        <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group card-hover relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop" alt="Planning" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-6 text-cyan-600 group-hover:scale-110 transition-transform mx-auto shadow-lg border border-cyan-200">
                                    <Target size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">Precision Tracking</h3>
                                <p className="text-slate-700 font-medium">Kanban-style application management keeps you organized and on track.</p>
                            </div>
                        </div>

                        {/* Card 4 - Visa with Icon */}
                        <div className="glass-card rounded-[2rem] p-8 flex flex-col justify-center items-center text-center group card-hover relative overflow-hidden">
                            <div className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" alt="Travel" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-6 text-amber-600 group-hover:scale-110 transition-transform mx-auto shadow-lg border border-amber-200">
                                    <Shield size={32} />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">Visa Guidance</h3>
                                <p className="text-slate-700 font-medium">Step-by-step document verification and expert guidance.</p>
                            </div>
                        </div>

                    </div>
                </section>

                {/* About Section - Redesigned */}
                <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    {/* Hero About */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-indigo-200 bg-white/60 backdrop-blur-md text-sm font-medium text-indigo-700 mb-6 shadow-sm">
                            <Star size={14} className="text-amber-500" fill="currentColor" />
                            <span className="tracking-wide uppercase text-xs font-bold">About EdVoyage</span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                            Your Journey to <br />
                            <span className="gradient-text-hero">Global Education</span>
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            We're on a mission to make studying abroad accessible, affordable, and achievable for every student with a dream.
                        </p>
                    </div>

                    {/* Mission, Vision, Values - Enhanced Cards */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop" alt="Team collaboration" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Rocket size={36} strokeWidth={2} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">Empower students worldwide to pursue their educational dreams by simplifying the complex process of studying abroad.</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" alt="Global vision" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Star size={36} strokeWidth={2} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Vision</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">A world where every student has equal access to quality education, regardless of geographical or financial barriers.</p>
                            </div>
                        </div>

                        <div className="glass-card rounded-3xl p-8 relative overflow-hidden group card-hover">
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-15 transition-opacity">
                                <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070&auto=format&fit=crop" alt="Trust and values" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10"></div>
                            <div className="relative z-10">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-6 text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Shield size={36} strokeWidth={2} />
                                </div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h3>
                                <p className="text-slate-600 leading-relaxed text-lg">Transparency, innovation, and student success drive everything we do. Your dreams are our priority.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA Section - More Visual */}
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
                        <div className="absolute inset-0 opacity-20">
                            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop" alt="Students" className="w-full h-full object-cover" />
                        </div>
                        <div className="relative z-10 p-12 md:p-16">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h3 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Join 10,000+ Successful Students</h3>
                                    <p className="text-white/90 text-xl mb-8 leading-relaxed">From application to arrival, we're with you every step of the way. Our platform combines cutting-edge AI technology with personalized support to ensure your success.</p>

                                    {/* Trust Indicators */}
                                    <div className="flex items-center gap-8 text-white/80">
                                        <div>
                                            <div className="text-3xl font-black text-white">95%</div>
                                            <div className="text-sm">Success Rate</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black text-white">24/7</div>
                                            <div className="text-sm">Support</div>
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black text-white">50+</div>
                                            <div className="text-sm">Countries</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden md:block">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-white/10 rounded-3xl backdrop-blur-xl"></div>
                                        <div className="relative p-8 space-y-6">
                                            {/* Testimonial-style quote */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                                    S
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium mb-2">"EdVoyage made my dream of studying at Oxford a reality. The process was seamless!"</p>
                                                    <p className="text-white/60 text-sm">Sarah M., Oxford University</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                                    J
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium mb-2">"The AI recommendations were spot-on. Found my perfect program in minutes!"</p>
                                                    <p className="text-white/60 text-sm">James K., MIT</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                                    A
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium mb-2">"Best decision ever! The support team guided me through everything."</p>
                                                    <p className="text-white/60 text-sm">Aisha R., Cambridge</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Social Proof / Trust */}
                <section className="py-20 border-t border-indigo-100">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 mb-10">Trusted by students from</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-60 hover:opacity-100 transition-all duration-500">
                            {['Harvard', 'Stanford', 'MIT', 'Oxford', 'Cambridge'].map((uni) => (
                                <span key={uni} className="text-2xl font-playback font-bold text-slate-700">{uni}</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-indigo-100 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                            {/* Company Info */}
                            <div className="col-span-1 md:col-span-2">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                                        <Compass className="text-white" size={22} strokeWidth={2.5} />
                                    </div>
                                    <span className="font-display font-black text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">EdVoyage</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 max-w-md">
                                    Your trusted partner in global education. We help students discover, apply, and succeed in their dream universities worldwide.
                                </p>
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-600 transition-colors">
                                        <Twitter size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-600 transition-colors">
                                        <Instagram size={18} />
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-indigo-100 hover:bg-indigo-200 flex items-center justify-center text-indigo-600 transition-colors">
                                        <Youtube size={18} />
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
                                <ul className="space-y-3">
                                    <li><Link to="/explore" className="text-slate-600 hover:text-indigo-600 transition-colors">Explore Programs</Link></li>
                                    <li><Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Sign In</Link></li>
                                    <li><Link to="/login" state={{ isSignUp: true }} className="text-slate-600 hover:text-indigo-600 transition-colors">Sign Up</Link></li>
                                    <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">About Us</a></li>
                                </ul>
                            </div>

                            {/* Resources */}
                            <div>
                                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Resources</h3>
                                <ul className="space-y-3">
                                    <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Scholarships</a></li>
                                    <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Visa Guide</a></li>
                                    <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Cost Calculator</a></li>
                                    <li><a href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Blog</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Bottom Bar */}
                        <div className="pt-8 border-t border-indigo-100 flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-slate-500 text-sm">
                                © 2025 EdVoyage. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-sm">
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
