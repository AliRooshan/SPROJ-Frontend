import React, { useState, useEffect } from 'react';
import { User, Save, Check, Globe, MapPin, GraduationCap, Loader2 } from 'lucide-react';
import AuthService from '../../services/AuthService';
import PageHeader from '../../components/PageHeader';
import api from '../../services/api';

const inputCls = "block w-full px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-lg md:rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 text-slate-900 text-sm font-semibold outline-none hover:border-indigo-200 transition-all";
const selectCls = inputCls + " appearance-none cursor-pointer";
const labelCls = "block text-[10px] font-black text-indigo-500 mb-1.5 uppercase tracking-widest";

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [saveStatus, setSaveStatus] = useState(''); // '' | 'saving' | 'success' | 'error'
    const [isLoading, setIsLoading] = useState(true);

    const [availableCountries, setAvailableCountries] = useState([]);

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
        intake: 'Fall 2025',
        budget: '',
        careerGoal: '',
    });

    // Load from backend on mount
    useEffect(() => {
        const fetchProfile = async () => {
            const user = AuthService.getCurrentUser();
            if (user) {
                try {
                    const latestUser = await AuthService.getUserProfile(user.id);
                    setFormData({
                        fullName:        latestUser.fullName        || '',
                        email:           latestUser.email           || '',
                        phone:           latestUser.phone           || '',
                        degree:          latestUser.degree          || 'Bachelors',
                        major:           latestUser.major           || '',
                        gpa:             latestUser.gpa             || '',
                        englishTest:     latestUser.englishTest      || 'IELTS',
                        englishScore:    latestUser.englishScore     || '',
                        targetCountries: latestUser.targetCountries  || [],
                        intake:          latestUser.intake          || 'Fall 2025',
                        budget:          latestUser.budget          || '',
                        careerGoal:      latestUser.careerGoal      || '',
                    });
                } catch (err) {
                    console.error('Failed to fetch latest profile:', err);
                    // Fallback to local session if fetch fails
                    setFormData(prev => ({ ...prev, ...user }));
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    useEffect(() => {
        api.get('/programs/filters')
            .then(data => setAvailableCountries(data?.countries || []))
            .catch(() => setAvailableCountries([]));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCountryToggle = (country) => {
        setFormData(prev => {
            const countries = prev.targetCountries.includes(country)
                ? prev.targetCountries.filter(c => c !== country)
                : [...prev.targetCountries, country];
            return { ...prev, targetCountries: countries };
        });
    };

    const handleSave = async () => {
        setSaveStatus('saving');
        try {
            await AuthService.updateProfile(formData);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (err) {
            console.error('Failed to save profile:', err);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const SaveButton = (
        <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`flex items-center justify-center gap-1.5 md:gap-2 w-10 h-10 md:w-auto md:h-auto !p-0 md:!px-5 md:!py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed shrink-0
                ${saveStatus === 'success' ? 'bg-emerald-500 text-white' :
                  saveStatus === 'error'   ? 'bg-red-500 text-white' :
                  'bg-white text-indigo-700 hover:bg-indigo-50 border border-white/50'}`}
        >
            <div className="flex shrink-0">
                {saveStatus === 'saving'  ? <Loader2 size={18} className="animate-spin" /> :
                 saveStatus === 'success' ? <Check size={18} /> :
                 <Save size={18} />}
            </div>
            <span className="hidden md:inline">
                {saveStatus === 'saving'  ? 'Saving...' :
                 saveStatus === 'success' ? 'Saved!' :
                 saveStatus === 'error'   ? 'Error!' :
                 'Save Changes'}
            </span>
        </button>
    );

    const tabs = [
        { id: 'personal',     label: 'Personal Info',   icon: User },
        { id: 'academic',     label: 'Academic',        icon: GraduationCap },
        { id: 'preferences',  label: 'Preferences',     icon: Globe },
        { id: 'goals',        label: 'Goals & Budget',  icon: MapPin },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-4 pb-6 md:space-y-6 md:pb-12 animate-in fade-in duration-500">
            <PageHeader
                title="Edit Profile"
                subtitle="Update your academic profile and study preferences"
                icon={User}
                forceRow={true}
                actions={SaveButton}
            />

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row">

                {/* ── Sidebar Tabs ── */}
                <div className="w-full md:w-56 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 grid grid-cols-2 md:flex md:flex-col gap-1.5 md:gap-1 p-2.5 md:p-4 shrink-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center md:justify-start gap-1.5 md:gap-3 px-2 py-2.5 md:px-4 md:py-2.5 rounded-lg md:rounded-xl text-left text-xs md:text-sm font-bold transition-all
                                ${activeTab === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-500 bg-white md:bg-transparent border border-slate-100 md:border-transparent hover:bg-white hover:text-indigo-600 hover:border-slate-200'}`}
                        >
                            <tab.icon size={16} className="shrink-0" />
                            <span className="truncate">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* ── Content Area ── */}
                <div className="flex-1 p-4 md:p-8 bg-white">

                    {/* LOADING SKELETON */}
                    {isLoading && (
                        <div className="space-y-5 max-w-xl animate-pulse">
                            <div className="h-6 w-48 bg-slate-200 rounded-lg" />
                            <div className="h-px bg-slate-100" />
                            {[1, 2, 3].map(i => (
                                <div key={i} className="space-y-2">
                                    <div className="h-3 w-24 bg-slate-200 rounded" />
                                    <div className="h-10 w-full bg-slate-100 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* PERSONAL INFO */}
                    {!isLoading && activeTab === 'personal' && (
                        <div className="space-y-4 md:space-y-5 max-w-xl animate-in fade-in duration-200">
                            <h2 className="text-base md:text-lg font-black text-slate-800 border-b border-slate-100 pb-2 md:pb-3 mb-3 md:mb-4">Personal Information</h2>
                            <div>
                                <label className={labelCls}>Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className={inputCls} placeholder="Your full name" />
                            </div>
                            <div>
                                <label className={labelCls}>Email</label>
                                <input type="email" value={formData.email} disabled className="block w-full px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl text-slate-400 cursor-not-allowed text-sm font-semibold" />
                            </div>
                            <div>
                                <label className={labelCls}>Mobile Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+1 234 567 890" />
                            </div>
                        </div>
                    )}

                    {/* ACADEMIC */}
                    {!isLoading && activeTab === 'academic' && (
                        <div className="space-y-4 md:space-y-5 max-w-xl animate-in fade-in duration-200">
                            <h2 className="text-base md:text-lg font-black text-slate-800 border-b border-slate-100 pb-2 md:pb-3 mb-3 md:mb-4">Academic Background</h2>
                            <div>
                                <label className={labelCls}>Current / Latest Degree</label>
                                <select name="degree" value={formData.degree} onChange={handleChange} className={selectCls}>
                                    <option>High School</option>
                                    <option>Bachelors</option>
                                    <option>Masters</option>
                                    <option>PhD</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Field of Study (Major)</label>
                                <input type="text" name="major" value={formData.major} onChange={handleChange} className={inputCls} placeholder="e.g. Computer Science" />
                            </div>
                            <div>
                                <label className={labelCls}>GPA / Percentage</label>
                                <input type="text" name="gpa" value={formData.gpa} onChange={handleChange} className={inputCls} placeholder="e.g. 3.8/4.0 or 85%" />
                            </div>
                            <div className="grid grid-cols-2 gap-3 md:gap-4">
                                <div>
                                    <label className={labelCls}>English Test</label>
                                    <select name="englishTest" value={formData.englishTest} onChange={handleChange} className={selectCls}>
                                        <option>IELTS</option>
                                        <option>TOEFL</option>
                                        <option>PTE</option>
                                        <option>Duolingo</option>
                                        <option>None</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelCls}>Score</label>
                                    <input type="text" name="englishScore" value={formData.englishScore} onChange={handleChange} className={inputCls} placeholder="e.g. 7.5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PREFERENCES */}
                    {!isLoading && activeTab === 'preferences' && (
                        <div className="space-y-4 md:space-y-5 max-w-xl animate-in fade-in duration-200">
                            <h2 className="text-base md:text-lg font-black text-slate-800 border-b border-slate-100 pb-2 md:pb-3 mb-3 md:mb-4">Study Preferences</h2>
                            <div>
                                <label className={labelCls}>Target Countries</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 md:gap-2 mt-1">
                                    {availableCountries.map(country => (
                                        <button
                                            key={country}
                                            type="button"
                                            onClick={() => handleCountryToggle(country)}
                                            className={`py-2 md:py-2.5 px-2 md:px-3 border rounded-lg md:rounded-xl text-xs md:text-sm font-bold flex items-center justify-between transition-all
                                                ${formData.targetCountries.includes(country)
                                                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                                                    : 'border-slate-200 bg-white text-slate-500 hover:border-indigo-200 hover:text-indigo-600'}`}
                                        >
                                            {country}
                                            {formData.targetCountries.includes(country) && <Check size={14} className="text-indigo-600" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Preferred Intake</label>
                                <select name="intake" value={formData.intake} onChange={handleChange} className={selectCls}>
                                    <option>Fall 2024</option>
                                    <option>Spring 2025</option>
                                    <option>Fall 2025</option>
                                    <option>Spring 2026</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* GOALS & BUDGET */}
                    {!isLoading && activeTab === 'goals' && (
                        <div className="space-y-4 md:space-y-5 max-w-xl animate-in fade-in duration-200">
                            <h2 className="text-base md:text-lg font-black text-slate-800 border-b border-slate-100 pb-2 md:pb-3 mb-3 md:mb-4">Goals & Budget</h2>
                            <div>
                                <label className={labelCls}>Estimated Annual Budget</label>
                                <select name="budget" value={formData.budget} onChange={handleChange} className={selectCls}>
                                    <option value="">Select budget range</option>
                                    <option value="<10k">Less than $10,000</option>
                                    <option value="10k-20k">$10,000 – $20,000</option>
                                    <option value="20k-40k">$20,000 – $40,000</option>
                                    <option value="40k+">More than $40,000</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Career Goal</label>
                                <textarea
                                    name="careerGoal"
                                    value={formData.careerGoal}
                                    onChange={handleChange}
                                    rows={4}
                                    className={inputCls + " resize-none"}
                                    placeholder="I want to specialize in AI and machine learning..."
                                />
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Profile;
