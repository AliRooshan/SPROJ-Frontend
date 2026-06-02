/**
 * AuthService.js — All auth and user-data operations via the backend API.
 * JWT is stored in localStorage under 'edvoyage_token'.
 * User object (without password) is cached under 'edvoyage_session'.
 */
import api from './api';

const TOKEN_KEY   = 'edvoyage_token';
const SESSION_KEY = 'edvoyage_session';

// ── Helpers ────────────────────────────────────────────────────────────────────

const parseBudgetRange = (budget) => {
  if (!budget) return { budget_min: null, budget_max: null };
  if (typeof budget === 'number') return { budget_min: budget, budget_max: budget };
  if (budget === '<10k') return { budget_min: 0, budget_max: 10000 };
  if (budget === '10k-20k') return { budget_min: 10000, budget_max: 20000 };
  if (budget === '20k-40k') return { budget_min: 20000, budget_max: 40000 };
  if (budget === '40k+') return { budget_min: 40000, budget_max: null };
  return { budget_min: null, budget_max: null };
};

const formatBudgetRange = (min, max) => {
  if (min == null && max == null) return '';
  if (min === 0 && max === 10000) return '<10k';
  if (min === 10000 && max === 20000) return '10k-20k';
  if (min === 20000 && max === 40000) return '20k-40k';
  if (min === 40000 && max == null) return '40k+';
  if (min != null && max != null) return `${min}-${max}`;
  return '';
};

const toNullableNumber = (value) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
};

/** Map DB snake_case user fields → frontend camelCase */
const normaliseUser = (u) => ({
  id:              u.id,
  email:           u.email,
  fullName:        u.full_name   ?? u.fullName   ?? '',
  phone:           u.phone       ?? '',
  degree:          u.degree_level ?? u.degree ?? '',
  major:           u.major       ?? '',
  gpa:             u.gpa         ?? '',
  englishTest:     u.english_test  ?? u.englishTest  ?? '',
  englishScore:    u.english_score ?? u.englishScore ?? '',
  targetCountries: u.target_countries ?? u.targetCountries ?? [],
  intake:          u.intake_term ?? u.intake ?? '',
  budget:          formatBudgetRange(u.budget_min, u.budget_max) || u.budget || '',
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

const register = async ({ fullName, email, password }) => {
  const data = await api.post('/auth/register', {
    full_name: fullName,
    email,
    password,
  });
  saveSession(data.token, data.user);
  return normaliseUser(data.user);
};

const login = async (email, password) => {
  const data = await api.post('/auth/login', { email, password });
  saveSession(data.token, data.user);
  return normaliseUser(data.user);
};

const getUserProfile = async (userId) => {
  const data = await api.get(`/users/${userId}/profile`);
  updateSession(data);
  return normaliseUser(data);
};

const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
};

const getCurrentUser = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const user = JSON.parse(raw);
  // Guard: if id is missing the session is corrupt — clear it so the user re-logs in
  if (!user?.id) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return user;
};

const getToken = () => localStorage.getItem(TOKEN_KEY);

const isAuthenticated = () => !!getToken();

// ── Profile ────────────────────────────────────────────────────────────────────

const updateProfile = async (formData) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { budget_min, budget_max } = parseBudgetRange(formData.budget);
  const payload = {
    full_name:        formData.fullName,
    phone:            formData.phone,
    degree_level:     formData.degree,
    major:            formData.major,
    gpa:              toNullableNumber(formData.gpa),
    english_test:     formData.englishTest,
    english_score:    toNullableNumber(formData.englishScore),
    target_countries: formData.targetCountries,
    intake_term:      formData.intake,
    budget_min,
    budget_max,
    budget_currency:  'USD',
    career_goal:      formData.careerGoal,
  };

  const response = await api.put(`/users/${user.id}/profile`, payload);
  // Backend returns { message, user: {...} } — extract the user object
  const updatedUser = response.user ?? response;
  // Merge with existing session so fields the backend doesn't echo back (like id) are preserved
  updateSession({ ...user, ...updatedUser, id: user.id });
  return updatedUser;
};

const updateAccountBasics = async ({ fullName, phone }) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  const response = await api.put('/auth/me', {
    full_name: fullName,
    phone: phone ?? null
  });
  const updatedUser = response.user ?? response;
  updateSession({ ...user, ...updatedUser, id: user.id });
  return updatedUser;
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
    await api.post(`/users/${user.id}/saved-programs/${program.id}`);
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
    await api.post(`/users/${user.id}/saved-scholarships/${scholarship.id}`);
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
    status:       application.status ?? 'pending',
  };

  return api.post(`/users/${user.id}/applications`, payload);
};

const updateApplicationStatus = async (app, status) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return api.put(`/users/${user.id}/applications/${app.id}`, { status });
};

const deleteApplication = async (applicationId) => {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return api.delete(`/users/${user.id}/applications/${applicationId}`);
};

const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  return api.put('/auth/change-password', {
    current_password: currentPassword,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
};

const forgotPassword = async (email) => {
  return api.post('/auth/forgot-password', { email });
};

const resetPassword = async (token, password) => {
  return api.post('/auth/reset-password', { token, password });
};

// ── Export ─────────────────────────────────────────────────────────────────────

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  isAuthenticated,
  getUserProfile,
  updateProfile,
  updateAccountBasics,
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
  deleteApplication,
  changePassword,
  forgotPassword,
  resetPassword,
};

export default AuthService;
