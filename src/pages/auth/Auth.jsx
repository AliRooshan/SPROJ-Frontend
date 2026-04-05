import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Phone, GraduationCap, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import AuthService from '../../services/AuthService';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSignUp, setIsSignUp] = useState(location.state?.isSignUp || false);

    // Update state when location changes (e.g. clicking header links)
    React.useEffect(() => {
        setIsSignUp(location.state?.isSignUp || false);
    }, [location.state]);

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await AuthService.register(formData);
                navigate('/student/profile-setup');
            } else {
                const user = await AuthService.login(formData.email, formData.password);
                if (user.isAdmin) {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/student/dashboard');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };


    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setFormData({ email: '', password: '', fullName: '', phone: '' });
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: [0.43, 0.13, 0.23, 0.96]
            }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.3 }
        }
    };

    const formVariants = {
        enter: (direction) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
            scale: 0.8
        }),
        center: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            transition: {
                rotateY: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
            }
        },
        exit: (direction) => ({
            rotateY: direction < 0 ? 90 : -90,
            opacity: 0,
            scale: 0.8,
            transition: {
                rotateY: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.4 },
                scale: { duration: 0.4 }
            }
        })
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop"
                    alt="University Campus"
                    className="w-full h-full object-cover brightness-110"
                />
                {/* Very Light Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-indigo-50/70 to-purple-50/60"></div>
                {/* Subtle Pattern Overlay */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
            </div>

            {/* Animated Background Blobs */}
            <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.5, 0.3, 0.5],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
            />

            {/* Auth Container */}
            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Logo/Brand */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="inline-flex items-center gap-2 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <GraduationCap className="text-white" size={24} />
                        </div>
                        <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            EdVoyage
                        </h1>
                    </div>
                    <p className="text-slate-700 font-semibold">Your journey to global education</p>
                </motion.div>

                {/* Auth Card */}
                <div className="relative" style={{ perspective: '1000px' }}>
                    <AnimatePresence mode="wait" custom={isSignUp ? 1 : -1}>
                        <motion.div
                            key={isSignUp ? 'signup' : 'signin'}
                            custom={isSignUp ? 1 : -1}
                            variants={formVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-indigo-100 p-8"
                        >
                            {/* Header */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-2">
                                    {isSignUp ? (
                                        <>
                                            <Sparkles className="text-indigo-600" size={28} />
                                            Create Account
                                        </>
                                    ) : (
                                        <>
                                            Welcome Back
                                        </>
                                    )}
                                </h2>
                                <p className="text-slate-600">
                                    {isSignUp
                                        ? 'Start your educational journey today'
                                        : 'Continue your journey to success'}
                                </p>
                            </div>

                            {/* Error Message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600 text-sm font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required={isSignUp}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 font-medium placeholder-slate-400"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.15 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 font-medium placeholder-slate-400"
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: isSignUp ? 0.2 : 0.1 }}
                                >
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 font-medium placeholder-slate-400"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: isSignUp ? 0.25 : 0.15 }}
                                >
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full pl-12 pr-12 py-3.5 bg-white border-2 border-indigo-100 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-900 font-medium placeholder-slate-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {isSignUp ? 'Create Account' : 'Sign In'}
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Toggle Mode */}
                            <div className="mt-6 text-center">
                                <p className="text-slate-600">
                                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                                    {' '}
                                    <button
                                        type="button"
                                        onClick={toggleMode}
                                        className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline"
                                    >
                                        {isSignUp ? 'Sign In' : 'Sign Up'}
                                    </button>
                                </p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <motion.p
                    className="text-center text-slate-500 text-sm mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    By continuing, you agree to our Terms & Privacy Policy
                </motion.p>
            </motion.div>
        </div>
    );
};

export default Auth;
