/**
 * AuthService to manage local user authentication and storage.
 * Simulates a backend by storing users in localStorage under 'edvoyage_users'.
 * Manages active session in 'edvoyage_session'.
 */

import demoUserData from '../data/demoUserData';

const USERS_KEY = 'edvoyage_users';
const SESSION_KEY = 'edvoyage_session';

// Helper to get users
const getUsers = () => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
};

// Helper to save users
const saveUsers = (users) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const AuthService = {
    // Register a new user
    register: (userData) => {
        const users = getUsers();
        const existing = users.find(u => u.email === userData.email);
        if (existing) {
            throw new Error('User already exists');
        }

        const newUser = {
            id: Date.now().toString(),
            ...userData,
            fullName: userData.fullName || userData.email.split('@')[0],
            joinedDate: new Date().toISOString(),
            // Empty Data for new users - STRICT ISOLATION
            stats: { saved: 0, pending: 0, accepted: 0 },
            savedPrograms: [],
            savedScholarships: [],
            applications: [],
            deadlines: [],
            checklist: []
        };

        users.push(newUser);
        saveUsers(users);

        AuthService.login(userData.email, userData.password);
        return newUser;
    },

    // Login user
    login: (email, password) => {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            throw new Error('Invalid email or password');
        }

        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        // Sync legacy key to keep other components working
        localStorage.setItem('studentProfile', JSON.stringify(user));
        return user;
    },

    // Get current logged in user
    getCurrentUser: () => {
        const session = localStorage.getItem(SESSION_KEY);
        return session ? JSON.parse(session) : null;
    },

    // Update current user profile
    updateProfile: (updatedData) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) throw new Error('No user logged in');

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);

        if (userIndex === -1) throw new Error('User not found in database');

        // Merge updates
        const updatedUser = { ...users[userIndex], ...updatedData };
        users[userIndex] = updatedUser;
        saveUsers(users);

        // Update session
        localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
        localStorage.setItem('studentProfile', JSON.stringify(updatedUser));

        return updatedUser;
    },

    // Toggle saved program status
    toggleSavedProgram: (program) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return false;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return false;

        const user = users[userIndex];

        // Initialize if missing
        if (!user.savedPrograms) user.savedPrograms = [];
        if (!user.stats) user.stats = { saved: 0, pending: 0, accepted: 0 };

        const existingIndex = user.savedPrograms.findIndex(p => p.id === program.id);
        let isSaved = false;

        if (existingIndex > -1) {
            // Remove
            user.savedPrograms.splice(existingIndex, 1);
            user.stats.saved = Math.max(0, user.stats.saved - 1);
            isSaved = false;
        } else {
            // Add
            user.savedPrograms.push(program);
            user.stats.saved += 1;
            isSaved = true;
        }

        users[userIndex] = user;
        saveUsers(users);

        // Update session
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        localStorage.setItem('studentProfile', JSON.stringify(user));

        return isSaved;
    },

    // Check if program is saved
    isProgramSaved: (programId) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || !currentUser.savedPrograms) return false;
        return currentUser.savedPrograms.some(p => p.id === programId);
    },

    // Get saved programs
    getSavedPrograms: () => {
        const currentUser = AuthService.getCurrentUser();
        return currentUser?.savedPrograms || [];
    },

    // Add application
    addApplication: (application) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return null;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return null;

        const user = users[userIndex];
        if (!user.applications) user.applications = [];
        if (!user.deadlines) user.deadlines = [];
        if (!user.stats) user.stats = { saved: 0, pending: 0, accepted: 0 };

        const newApplication = {
            id: Date.now(),
            ...application,
            appliedDate: new Date().toISOString().split('T')[0],
            status: application.status || 'pending'
        };

        user.applications.push(newApplication);
        user.stats.pending += 1;

        // Automatically create a deadline entry for this application
        if (application.deadline) {
            const newDeadline = {
                id: Date.now() + 1, // Ensure unique ID
                university: application.university, // University name as title
                task: 'Application', // Just the type
                date: application.deadline,
                status: 'pending',
                applicationId: newApplication.id // Link to application
            };
            user.deadlines.push(newDeadline);
        }

        users[userIndex] = user;
        saveUsers(users);

        // Update session
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        localStorage.setItem('studentProfile', JSON.stringify(user));

        return newApplication;
    },

    // Update application status
    updateApplicationStatus: (applicationId, newStatus) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return false;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return false;

        const user = users[userIndex];
        if (!user.applications) return false;

        const appIndex = user.applications.findIndex(a => a.id === applicationId);
        if (appIndex === -1) return false;

        const oldStatus = user.applications[appIndex].status;
        user.applications[appIndex].status = newStatus;

        // Update stats
        if (oldStatus === 'pending') user.stats.pending = Math.max(0, user.stats.pending - 1);
        if (oldStatus === 'accepted') user.stats.accepted = Math.max(0, user.stats.accepted - 1);

        if (newStatus === 'pending') user.stats.pending += 1;
        if (newStatus === 'accepted') user.stats.accepted += 1;

        users[userIndex] = user;
        saveUsers(users);

        // Update session
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        localStorage.setItem('studentProfile', JSON.stringify(user));

        return true;
    },

    // Get applications
    getApplications: () => {
        const currentUser = AuthService.getCurrentUser();
        return currentUser?.applications || [];
    },

    // Toggle saved scholarship status
    toggleSavedScholarship: (scholarship) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return false;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return false;

        const user = users[userIndex];

        // Initialize if missing
        if (!user.savedScholarships) user.savedScholarships = [];

        const existingIndex = user.savedScholarships.findIndex(s => s.id === scholarship.id);
        let isSaved = false;

        if (existingIndex > -1) {
            // Remove
            user.savedScholarships.splice(existingIndex, 1);
            isSaved = false;
        } else {
            // Add
            user.savedScholarships.push(scholarship);
            isSaved = true;
        }

        users[userIndex] = user;
        saveUsers(users);

        // Update session
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        localStorage.setItem('studentProfile', JSON.stringify(user));

        return isSaved;
    },

    // Check if scholarship is saved
    isScholarshipSaved: (scholarshipId) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser || !currentUser.savedScholarships) return false;
        return currentUser.savedScholarships.some(s => s.id === scholarshipId);
    },

    // Get saved scholarships
    getSavedScholarships: () => {
        const currentUser = AuthService.getCurrentUser();
        return currentUser?.savedScholarships || [];
    },

    // Add deadline when application is started
    addDeadline: (deadline) => {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) return null;

        const users = getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex === -1) return null;

        const user = users[userIndex];
        if (!user.deadlines) user.deadlines = [];

        // Check if deadline already exists
        const exists = user.deadlines.some(d => d.title === deadline.title);
        if (!exists) {
            user.deadlines.push(deadline);
            users[userIndex] = user;
            saveUsers(users);

            // Update session
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            localStorage.setItem('studentProfile', JSON.stringify(user));
        }

        return deadline;
    },


    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('studentProfile');
    },

    // Initialize with specific demo user if empty or missing
    initDemoUser: () => {
        const users = getUsers();
        const demoEmail = 'alirooshan@gmail.com';
        const existingIndex = users.findIndex(u => u.email === demoEmail);

        if (existingIndex === -1) {
            // Create new demo user from scratch
            const aliUser = {
                id: 'demo-ali',
                joinedDate: new Date().toISOString(),
                ...demoUserData
            };
            users.push(aliUser);
            saveUsers(users);
        } else {
            // Update existing demo user with potentially new data from file
            // We want to update their profile info but KEEP their saved programs/applications if possible
            // OR do we want to overwrite? The user said "fill things for alirooshan".
            // Let's safe update: Overwrite profile fields from demoUserData, but maybe keep existing ID.
            const existingUser = users[existingIndex];
            const updatedUser = {
                ...existingUser,
                ...demoUserData // Overwrite with file data
            };
            users[existingIndex] = updatedUser;
            saveUsers(users);
        }
    }
};

// Auto-init
AuthService.initDemoUser();

export default AuthService;
