/**
 * AuthService.js — All auth and user-data operations via the backend API.
 * JWT is stored in localStorage under 'edvoyage_token'.
 * User object (without password) is cached under 'edvoyage_session'.
 */
import api from './api';

const TOKEN_KEY   = 'edvoyage_token';
const SESSION_KEY = 'edvoyage_session';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Map DB snake_case user fields → frontend camelCase */
const normaliseUser = (u) => ({
  id:              u.id,
  email:           u.email,
  fullName:        u.full_name   ?? u.fullName   ?? '',
  phone:           u.phone       ?? '',
  degree:          u.degree      ?? '',
  major:           u.major       ?? '',
  gpa:             u.gpa         ?? '',
  englishTest:     u.english_test  ?? u.englishTest  ?? '',
  englishScore:    u.english_score ?? u.englishScore ?? '',
  targetCountries: u.target_countries ?? u.targetCountries ?? [],
  intake:          u.intake      ?? '',
  budget:          u.budget      ?? '',
  careerGoal:      u.career_goal ?? u.careerGoal ?? '',
  isAdmin:         u.is_admin    ?? false,
  savedPrograms:      u.savedPrograms      ?? [],
  savedScholarships:  u.savedScholarships  ?? [],
  notifications:   u.notifications ?? { email: true, push: false, deadlines: true },
  privacy:         u.privacy      ?? { publicProfile: false, shareData: true },
});

const saveSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(normaliseUser(user)));
};

const updateSession = (user) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(normaliseUser(user)));
};

// ── Auth ───────────────────────────────────────────────────────────────────────

const register = async ({ fullName, phone, email, password }) => {
  const data = await api.post('/auth/register', {
    full_name: fullName,
    phone,
    email,
    password,
  });
  saveSession(data.token, data.user);
  return data.user;
};

const login = async (email, password) => {
  const data = await api.post('/auth/login', { email, password });
  saveSession(data.token, data.user);
  return data.user;
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
};

const getCurrentUser = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isAuthenticated = () => !!getToken();

// ── Profile ────────────────────────────────────────────────────────────────────

const updateProfile = async (formData) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    full_name:        formData.fullName,
    phone:            formData.phone,
    degree:           formData.degree,
    major:            formData.major,
    gpa:              formData.gpa,
    english_test:     formData.englishTest,
    english_score:    formData.englishScore,
    target_countries: formData.targetCountries,
    intake:           formData.intake,
    budget:           formData.budget,
    career_goal:      formData.careerGoal,
  };

  const updated = await api.put(`/users/${user.id}/profile`, payload);
  updateSession(updated);
  return updated;
};

// ── Saved Programs ─────────────────────────────────────────────────────────────

const getSavedPrograms = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  const data = await api.get(`/users/${user.id}/saved-programs`);
  // Refresh the cached saved list
  const updated = { ...user, savedPrograms: data };
  updateSession(updated);
  return data;
};

const isProgramSaved = (programId) => {
  const user = getCurrentUser();
  if (!user) return false;
  return (user.savedPrograms ?? []).some(p =>
    (p.program_id ?? p.id) === programId
  );
};

/**
 * Toggles a saved program.
 * Returns true if now saved, false if now unsaved.
 */
const toggleSavedProgram = async (program) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const alreadySaved = isProgramSaved(program.id);

  if (alreadySaved) {
    await api.delete(`/users/${user.id}/saved-programs/${program.id}`);
    const updated = {
      ...user,
      savedPrograms: (user.savedPrograms ?? []).filter(
        p => (p.program_id ?? p.id) !== program.id
      ),
    };
    updateSession(updated);
    return false;
  } else {
    await api.post(`/users/${user.id}/saved-programs`, { program_id: program.id });
    const updated = {
      ...user,
      savedPrograms: [...(user.savedPrograms ?? []), { program_id: program.id, ...program }],
    };
    updateSession(updated);
    return true;
  }
};

// ── Saved Scholarships ─────────────────────────────────────────────────────────

const getSavedScholarships = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  const data = await api.get(`/users/${user.id}/saved-scholarships`);
  const updated = { ...user, savedScholarships: data };
  updateSession(updated);
  return data;
};

const isScholarshipSaved = (scholarshipId) => {
  const user = getCurrentUser();
  if (!user) return false;
  return (user.savedScholarships ?? []).some(s =>
    (s.scholarship_id ?? s.id) === scholarshipId
  );
};

const toggleSavedScholarship = async (scholarship) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const alreadySaved = isScholarshipSaved(scholarship.id);

  if (alreadySaved) {
    await api.delete(`/users/${user.id}/saved-scholarships/${scholarship.id}`);
    const updated = {
      ...user,
      savedScholarships: (user.savedScholarships ?? []).filter(
        s => (s.scholarship_id ?? s.id) !== scholarship.id
      ),
    };
    updateSession(updated);
    return false;
  } else {
    await api.post(`/users/${user.id}/saved-scholarships`, { scholarship_id: scholarship.id });
    const updated = {
      ...user,
      savedScholarships: [...(user.savedScholarships ?? []), { scholarship_id: scholarship.id, ...scholarship }],
    };
    updateSession(updated);
    return true;
  }
};

// ── Applications ───────────────────────────────────────────────────────────────

const getApplications = async () => {
  const user = getCurrentUser();
  if (!user) return [];
  return api.get(`/users/${user.id}/applications`);
};

const addApplication = async (application) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const payload = {
    program_id:   application.programId,
    university:   application.university,
    program_name: application.program,
    country:      application.country,
    deadline:     application.deadline,
    status:       application.status ?? 'pending',
  };

  return api.post(`/users/${user.id}/applications`, payload);
};

const updateApplicationStatus = async (applicationId, status) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return api.put(`/users/${user.id}/applications/${applicationId}`, { status });
};

// ── Export ─────────────────────────────────────────────────────────────────────

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  updateProfile,
  // Programs
  getSavedPrograms,
  isProgramSaved,
  toggleSavedProgram,
  // Scholarships
  getSavedScholarships,
  isScholarshipSaved,
  toggleSavedScholarship,
  // Applications
  getApplications,
  addApplication,
  updateApplicationStatus,
};

export default AuthService;
