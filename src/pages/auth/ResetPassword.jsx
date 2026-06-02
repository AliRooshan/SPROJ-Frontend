import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, ArrowRight, Eye, EyeOff, CheckCircle } from 'lucide-react';
import AuthService from '../../services/AuthService';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!token) {
            setError('Reset token is missing from the URL.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await AuthService.resetPassword(token, formData.password);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setIsLoading(false);
        }
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
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' }
        }
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

            {/* Container */}
            <motion.div
                className="w-full max-w-md relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={cardVariants}
                    className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border-2 border-indigo-100 p-5 md:p-8"
                >
                    {!token ? (
                        <div className="text-center py-6">
                            <h2 className="text-2xl font-black text-red-600 mb-2">Invalid Link</h2>
                            <p className="text-slate-600 mb-6 text-sm md:text-base">
                                The password reset token is missing or invalid. Please request a new reset link.
                            </p>
                            <Link
                                to="/login"
                                className="inline-block py-3 px-6 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg md:rounded-xl shadow-lg transition-all"
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    ) : success ? (
                        <div className="text-center py-6">
                            <div className="flex justify-center mb-4 text-emerald-500">
                                <CheckCircle size={64} className="animate-bounce" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">Success!</h2>
                            <p className="text-slate-600 mb-6 text-sm md:text-base">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                            <Link
                                to="/login"
                                className="w-full py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-lg md:rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                            >
                                Go to Sign In
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="mb-4 md:mb-6">
                                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-1 md:mb-2">
                                    Reset Password
                                </h2>
                                <p className="text-slate-600 text-sm md:text-base">
                                    Please enter your new password below.
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
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                            minLength={6}
                                            className="w-full pl-12 pr-12 py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400"
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

                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            required
                                            minLength={6}
                                            className="w-full pl-12 pr-12 py-2.5 md:py-3.5 bg-white border-2 border-indigo-100 rounded-lg md:rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm md:text-base text-slate-900 font-medium placeholder-slate-400"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </motion.div>

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
                                            Reset Password
                                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                                        </>
                                    )}
                                </motion.button>
                            </form>

                            {/* Back to Login */}
                            <div className="mt-4 md:mt-6 text-center">
                                <Link
                                    to="/login"
                                    className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors underline text-sm md:text-base"
                                >
                                    Back to Sign In
                                </Link>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
