import React, { useState, useEffect } from 'react';
import { User, Bell, Shield, Save, Check, Settings, Globe, MapPin, GraduationCap } from 'lucide-react';
import AuthService from '../../services/AuthService';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('personal');
    const [formData, setFormData] = useState({
        // Personal
        fullName: '',
        email: '',
        phone: '',
        bio: '',

        // Academic
        degree: 'Bachelors',
        major: '',
        gpa: '',
        englishTest: 'IELTS',
        englishScore: '',

        // Preferences
        targetCountries: [],
        intake: 'Fall 2024',

        // Goals
        budget: '',
        careerGoal: '',

        // Settings
        notifications: {
            email: true,
            push: false,
            deadlines: true
        },
        privacy: {
            publicProfile: false,
            shareData: true
        }
    });

    useEffect(() => {
        const currentUser = AuthService.getCurrentUser();
        if (currentUser) {
            setFormData(prev => ({
                ...prev,
                ...currentUser,
                // Ensure nested objects/arrays preserve defaults if missing
                notifications: { ...prev.notifications, ...(currentUser.notifications || {}) },
                privacy: { ...prev.privacy, ...(currentUser.privacy || {}) },
                targetCountries: currentUser.targetCountries || []
            }));
        }
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

    const handleToggle = (section, key) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: !prev[section][key]
            }
        }));
    };

    const handleSave = () => {
        try {
            AuthService.updateProfile(formData);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert("Failed to save profile.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Hero Section - Image Based */}
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group min-h-[300px] flex items-end">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=2070&auto=format&fit=crop"
                        alt="Profile Settings"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-indigo-900/80 to-slate-900/70 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 p-10 md:p-14 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-xs font-black uppercase tracking-widest shadow-lg mb-4">
                                <Settings size={12} className="text-indigo-300" />
                                Account Settings
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-none mb-4 drop-shadow-xl">
                                Edit <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">Profile</span>
                            </h1>
                            <p className="text-indigo-100/90 text-lg font-medium max-w-xl leading-relaxed">
                                Customize your academic profile, preferences, and account settings.
                            </p>
                        </div>
                        <button
                            onClick={handleSave}
                            className="px-8 py-3.5 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-indigo-900/40 hover:-translate-y-1"
                        >
                            <Save size={20} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white/70 glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/50 shadow-xl backdrop-blur-2xl">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-80 bg-white/40 border-b md:border-b-0 md:border-r border-indigo-50/50 flex flex-row md:flex-col gap-2 p-6 overflow-x-auto backdrop-blur-sm">
                    {[
                        { id: 'personal', label: 'Personal Info', icon: User },
                        { id: 'academic', label: 'Academic', icon: GraduationCap },
                        { id: 'preferences', label: 'Preferences', icon: Globe },
                        { id: 'goals', label: 'Goals & Budget', icon: MapPin },
                        { id: 'settings', label: 'Settings', icon: Bell },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-left font-bold transition-all whitespace-nowrap group ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-md'
                                }`}
                        >
                            <div className={`p-2 rounded-xl transition-colors ${activeTab === tab.id ? 'bg-white/20' : 'bg-indigo-50 group-hover:bg-indigo-100 text-indigo-400'}`}>
                                <tab.icon size={20} />
                            </div>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 md:p-12 bg-white/40 backdrop-blur-sm">

                    {/* PERSONAL INFO TAB */}
                    {activeTab === 'personal' && (
                        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-b border-indigo-50/50 pb-6 mb-6">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Personal Information</h2>
                                <p className="text-slate-500 mt-2 font-medium">Update your personal details.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold text-lg outline-none hover:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="block w-full px-5 py-4 bg-slate-100/50 border-2 border-slate-100 rounded-2xl text-slate-400 cursor-not-allowed font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold outline-none hover:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium resize-none outline-none hover:bg-white"
                                        placeholder="Tell us a bit about yourself..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ACADEMIC BACKGROUND TAB */}
                    {activeTab === 'academic' && (
                        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-b border-indigo-50/50 pb-6 mb-6">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Academic Background</h2>
                                <p className="text-slate-500 mt-2 font-medium">Your educational qualifications.</p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Current/Latest Degree</label>
                                    <div className="relative">
                                        <select
                                            name="degree"
                                            value={formData.degree}
                                            onChange={handleChange}
                                            className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold text-lg outline-none cursor-pointer hover:bg-white appearance-none"
                                        >
                                            <option>High School</option>
                                            <option>Bachelors</option>
                                            <option>Masters</option>
                                            <option>PhD</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400">
                                            <GraduationCap size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Field of Study (Major)</label>
                                    <input
                                        type="text"
                                        name="major"
                                        value={formData.major}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold outline-none hover:bg-white"
                                        placeholder="e.g. Computer Science"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">GPA / Percentage</label>
                                    <input
                                        type="text"
                                        name="gpa"
                                        value={formData.gpa}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold outline-none hover:bg-white"
                                        placeholder="e.g. 3.8/4.0 or 85%"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">English Test</label>
                                    <div className="relative">
                                        <select
                                            name="englishTest"
                                            value={formData.englishTest}
                                            onChange={handleChange}
                                            className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold text-lg outline-none cursor-pointer hover:bg-white appearance-none"
                                        >
                                            <option>IELTS</option>
                                            <option>TOEFL</option>
                                            <option>PTE</option>
                                            <option>Duolingo</option>
                                            <option>None</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Score</label>
                                    <input
                                        type="text"
                                        name="englishScore"
                                        value={formData.englishScore}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold outline-none hover:bg-white"
                                        placeholder="Score"
                                    />
                                </div>
                            </div>
                        </div>

                    )}

                    {/* STUDY PREFERENCES TAB */}
                    {activeTab === 'preferences' && (
                        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-b border-indigo-50/50 pb-6 mb-6">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Study Preferences</h2>
                                <p className="text-slate-500 mt-2 font-medium">Where and when do you want to study?</p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-3 uppercase tracking-wider">Target Countries</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        {['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Switzerland'].map(country => (
                                            <button
                                                key={country}
                                                type="button"
                                                onClick={() => handleCountryToggle(country)}
                                                className={`p-5 border-2 rounded-2xl flex items-center justify-between transition-all duration-300 group ${formData.targetCountries.includes(country)
                                                    ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-105'
                                                    : 'border-indigo-50 bg-white/50 text-slate-500 hover:border-indigo-200 hover:bg-white'
                                                    }`}
                                            >
                                                <span className="font-bold">{country}</span>
                                                {formData.targetCountries.includes(country) && <Check size={20} className="text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Preferred Intake</label>
                                    <select
                                        name="intake"
                                        value={formData.intake}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold text-lg outline-none cursor-pointer hover:bg-white"
                                    >
                                        <option>Fall 2024</option>
                                        <option>Spring 2025</option>
                                        <option>Fall 2025</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* GOALS & BUDGET TAB */}
                    {activeTab === 'goals' && (
                        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-b border-indigo-50/50 pb-6 mb-6">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Goals & Budget</h2>
                                <p className="text-slate-500 mt-2 font-medium">Your financial plan and career aspirations.</p>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Estimated Annual Budget</label>
                                    <select
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-bold text-lg outline-none cursor-pointer hover:bg-white"
                                    >
                                        <option value="">Select budget range</option>
                                        <option value="<10k">Less than $10,000</option>
                                        <option value="10k-20k">$10,000 - $20,000</option>
                                        <option value="20k-40k">$20,000 - $40,000</option>
                                        <option value="40k+">More than $40,000</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-indigo-500 mb-2 uppercase tracking-wider">Career Goal</label>
                                    <textarea
                                        name="careerGoal"
                                        value={formData.careerGoal}
                                        onChange={handleChange}
                                        rows={4}
                                        className="block w-full px-5 py-4 bg-white/60 border-2 border-indigo-50 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 text-slate-900 transition-all font-medium resize-none outline-none hover:bg-white"
                                        placeholder="I want to specialize in AI..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="border-b border-indigo-50/50 pb-6 mb-6">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Settings</h2>
                                <p className="text-slate-500 mt-2 font-medium">Notifications and Privacy control.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between group p-6 bg-white/50 border border-indigo-50 rounded-[2rem] hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all">
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">Email Notifications</p>
                                        <p className="text-sm text-slate-500 mt-1 font-medium">Receive weekly updates and digests.</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('notifications', 'email')}
                                        className={`w-16 h-9 rounded-full transition-all relative shadow-inner ${formData.notifications?.email ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-7 h-7 rounded-full bg-white transition-all shadow-md ${formData.notifications?.email ? 'left-8' : 'left-1'}`}></div>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between group p-6 bg-white/50 border border-indigo-50 rounded-[2rem] hover:bg-white hover:border-indigo-100 hover:shadow-lg transition-all">
                                    <div>
                                        <p className="font-bold text-slate-900 text-lg">Make Profile Public</p>
                                        <p className="text-sm text-slate-500 mt-1 font-medium">Allow universities to find you.</p>
                                    </div>
                                    <button
                                        onClick={() => handleToggle('privacy', 'publicProfile')}
                                        className={`w-16 h-9 rounded-full transition-all relative shadow-inner ${formData.privacy?.publicProfile ? 'bg-indigo-500' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-7 h-7 rounded-full bg-white transition-all shadow-md ${formData.privacy?.publicProfile ? 'left-8' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] text-indigo-800 text-sm flex gap-4 items-start shadow-sm mt-4">
                                    <Shield className="shrink-0 mt-0.5 text-indigo-600" size={24} />
                                    <p className="leading-relaxed font-medium text-base">
                                        <span className="font-black block mb-1 text-indigo-900">Data Privacy</span>
                                        All your data is currently stored locally in your browser for demonstration purposes. We do not share your data with third parties without consent.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div >
    );
};

export default Profile;
