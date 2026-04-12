import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Book, Globe, MapPin, Check, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import AuthService from '../../services/AuthService';
import api from '../../services/api';

const steps = [
    { number: 1, title: 'Personal Info', icon: User },
    { number: 2, title: 'Academic Background', icon: Book },
    { number: 3, title: 'Study Preferences', icon: Globe },
    { number: 4, title: 'Goals & Budget', icon: MapPin },
];

const ProfileSetup = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [showPhoneError, setShowPhoneError] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        degree: 'Bachelors',
        major: '',
        gpa: '',
        englishTest: 'IELTS',
        englishScore: '',
        targetCountries: [],
        intakeSeason: 'Fall',
        intakeYear: '2026',
        intake: 'Fall 2026',
        budget: '',
        careerGoal: ''
    });

    const [availableCountries, setAvailableCountries] = useState([]);

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                ...currentUser,
                // Ensure array is initialized
                targetCountries: currentUser.targetCountries || []
            }));
        } else {
            // No user logged in, redirect to login
            navigate('/login/student');
        }
    }, [navigate]);

    useEffect(() => {
        api.get('/programs/filters')
            .then(data => setAvailableCountries(data?.countries || []))
            .catch(() => setAvailableCountries([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'phone' && value) setShowPhoneError(false);
    };

    const handleCountryToggle = (country) => {
        setFormData(prev => {
            const countries = prev.targetCountries.includes(country)
                ? prev.targetCountries.filter(c => c !== country)
                : [...prev.targetCountries, country];
            return { ...prev, targetCountries: countries };
        });
    };

    const handleNext = async () => {
        if (currentStep === 1 && !formData.phone) {
            setShowPhoneError(true);
            return;
        }

        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            // Finish & Save
            try {
                await AuthService.updateProfile(formData);
                navigate('/student/dashboard');
            } catch (error) {
                console.error("Failed to save profile:", error);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleSkip = async () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        } else {
            await AuthService.updateProfile(formData);
            navigate('/student/dashboard');
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all font-medium text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Mobile Number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`block w-full px-4 py-2 border-2 rounded-xl transition-all font-medium text-sm ${showPhoneError
                                        ? 'bg-red-50 border-red-200 focus:ring-red-100 focus:border-red-400'
                                        : 'bg-white border-indigo-50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900'
                                        }`}
                                    placeholder="+1 (555) 123-4567"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="block w-full px-4 py-2 bg-slate-50 border-2 border-slate-50 rounded-xl text-slate-500 font-medium cursor-not-allowed text-sm"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-3 md:space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Latest Degree</label>
                            <select
                                name="degree"
                                value={formData.degree}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                            >
                                <option>Bachelors</option>
                                <option>Masters</option>
                                <option>PhD</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Field of Study</label>
                                <input
                                    type="text"
                                    name="major"
                                    value={formData.major}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all font-medium text-sm"
                                    placeholder="Computer Science"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">GPA</label>
                                <input
                                    type="text"
                                    name="gpa"
                                    value={formData.gpa}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all font-medium text-sm"
                                    placeholder="3.8 / 4.0"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">English Proficiency</label>
                                <select
                                    name="englishTest"
                                    value={formData.englishTest}
                                    onChange={handleChange}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                                >
                                    <option>IELTS</option>
                                    <option>TOEFL</option>
                                    <option>PTE</option>
                                    <option>Duolingo</option>
                                    <option>None</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Score</label>
                                <input
                                    type="text"
                                    name="englishScore"
                                    value={formData.englishScore}
                                    onChange={handleChange}
                                    disabled={formData.englishTest === 'None'}
                                    className={`block w-full px-4 py-2 border-2 rounded-xl transition-all font-medium text-sm ${formData.englishTest === 'None'
                                        ? 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-white border-indigo-50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900'
                                        }`}
                                    placeholder={formData.englishTest === 'IELTS' ? 'e.g. 7.5' : 'Score'}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Target Country</label>
                            <select
                                name="targetCountries"
                                value={formData.targetCountries[0] || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, targetCountries: [e.target.value] }))}
                                className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                            >
                                <option value="">Select target country</option>
                                {availableCountries.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Preferred Season</label>
                                <select
                                    name="intakeSeason"
                                    value={formData.intakeSeason}
                                    onChange={(e) => {
                                        const season = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            intakeSeason: season,
                                            intake: `${season} ${prev.intakeYear}`
                                        }));
                                    }}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                                >
                                    <option>Fall</option>
                                    <option>Spring</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Preferred Year</label>
                                <select
                                    name="intakeYear"
                                    value={formData.intakeYear}
                                    onChange={(e) => {
                                        const year = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            intakeYear: year,
                                            intake: `${prev.intakeSeason} ${year}`
                                        }));
                                    }}
                                    className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                                >
                                    {[new Date().getFullYear(), new Date().getFullYear() + 1, new Date().getFullYear() + 2, new Date().getFullYear() + 3].map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4 md:space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Estimated Annual Budget</label>
                            <select
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium cursor-pointer text-sm"
                            >
                                <option value="">Select budget range</option>
                                <option value="<10k">Less than $10,000</option>
                                <option value="10k-20k">$10,000 - $20,000</option>
                                <option value="20k-40k">$20,000 - $40,000</option>
                                <option value="40k+">More than $40,000</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Career Goal</label>
                            <textarea
                                name="careerGoal"
                                value={formData.careerGoal}
                                onChange={handleChange}
                                rows={2}
                                className="block w-full px-4 py-2 bg-white border-2 border-indigo-50 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 placeholder-slate-400 transition-all resize-none font-medium text-sm"
                                placeholder="I want to specialize in AI..."
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="relative w-full flex justify-center pt-0 pb-6 md:pb-10">
            {/* Full Screen Background Image & Overlay */}
            <div className="fixed inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop"
                    alt="University Library"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]"></div>
            </div>

            <div className="max-w-xl w-full mx-auto relative z-10 animate-in fade-in zoom-in duration-500 p-3 md:p-4">
                <div className="bg-white/95 backdrop-blur-2xl rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative ring-1 ring-black/5">

                    {/* Progress Bar */}
                    <div className="bg-indigo-50/50 border-b border-indigo-100/50 px-4 py-3 md:px-6 md:py-4 backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-3 md:mb-4 gap-2">
                            <div className="min-w-0">
                                <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Profile Setup</h2>
                                <p className="text-slate-500 mt-0.5 text-[10px] md:text-xs font-medium leading-snug">Complete these steps to personalize your experience.</p>
                            </div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">Stage {currentStep}/4</span>
                        </div>
                        <div className="relative mx-2">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-indigo-50 rounded-full -translate-y-1/2 z-0"></div>
                            <div className="relative z-10 flex justify-between">
                                {steps.map((step) => {
                                    const Icon = step.icon;
                                    const isActive = step.number === currentStep;
                                    const isCompleted = step.number < currentStep;
                                    return (
                                        <div key={step.number} className="flex flex-col items-center group cursor-default">
                                            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isActive ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100 scale-105' :
                                                isCompleted ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-400 border-indigo-50'
                                                }`}>
                                                {isCompleted ? <Check size={14} /> : <Icon size={14} />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3 md:px-6 md:py-4 min-h-[180px] md:min-h-[200px]">
                        <div
                            key={currentStep}
                            className="animate-in fade-in slide-in-from-right-4 duration-300"
                        >
                            {renderStepContent()}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-white/50 px-4 py-2.5 md:px-6 md:py-3 border-t border-indigo-50 flex justify-between items-center gap-2 backdrop-blur-md">
                        {currentStep > 1 ? (
                            <button
                                onClick={handleSkip}
                                className="text-slate-500 hover:text-indigo-600 font-bold px-2 md:px-4 transition-colors text-xs md:text-sm shrink-0"
                            >
                                Skip
                            </button>
                        ) : (
                            <div></div>
                        )}
                        <div className="flex gap-2 md:gap-3 shrink-0">
                            {currentStep > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-3 py-1.5 md:px-5 md:py-2 border border-indigo-100 rounded-lg md:rounded-xl text-slate-500 font-bold hover:bg-white hover:text-indigo-600 transition-colors bg-white/50 text-xs md:text-sm"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className="px-4 py-1.5 md:px-6 md:py-2 bg-indigo-600 text-white rounded-lg md:rounded-xl font-bold hover:bg-indigo-700 transition flex items-center gap-1.5 md:gap-2 shadow-lg shadow-indigo-200 hover:shadow-xl group text-xs md:text-sm"
                            >
                                {currentStep === 4 ? 'Finish Setup' : 'Continue'}
                                {currentStep === 4 ? <Save size={16} /> : <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSetup;