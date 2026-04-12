import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
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
        confirmPassword: '',
        fullName: ''
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
                if (formData.password !== formData.confirmPassword) {
                    setError('Passwords do not match');
                    setIsLoading(false);
                    return;
                }
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
        setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
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
        <div className="min-h-screen relative flex items-center justify-center p-3 sm:p-4 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop"
                    alt="University Campus"
                    className="w-full h-full object-cover brightness-110"
                />
            </div>

            {/* Auth Container */}
            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
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
                            className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border-2 border-indigo-100 p-5 md:p-8"
                        >
                            {/* Header */}
                            <div className="mb-4 md:mb-6">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2 flex items-center gap-2">
                                    {isSignUp ? (
                                        <>
                                            Create Account
                                        </>
                                    ) : (
                                        <>
                                            Welcome Back
                                        </>
                                    )}
                                </h2>
                                <p className="text-slate-600 text-sm md:text-base">
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
                            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
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
                                                className="w-full pl-12 pr-4 py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400"
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
                                            className="w-full pl-12 pr-4 py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400"
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
                                            type={(!isSignUp && showPassword) ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            className={`w-full pl-12 ${!isSignUp ? 'pr-12' : 'pr-4'} py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400`}
                                            placeholder="••••••••"
                                        />
                                        {!isSignUp && (
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>

                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label className="block text-sm font-bold text-slate-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required={isSignUp}
                                                className="w-full pl-12 pr-4 py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400"
                                                placeholder="Confirm your password"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full mt-4 md:mt-6 py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
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
                            <div className="mt-4 md:mt-6 text-center">
                                <p className="text-slate-600 text-sm md:text-base">
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
                    className="text-center text-slate-500 text-xs md:text-sm mt-6 md:mt-8"
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
