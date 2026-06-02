import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import StudentLayout from './layouts/StudentLayout';
import AdminLayout from './layouts/AdminLayout';

// Common Pages
import Landing from './pages/Landing';
import Auth from './pages/auth/Auth';
import ResetPassword from './pages/auth/ResetPassword';


// Student Pages
import ProfileSetup from './pages/student/ProfileSetup';
import StudentDashboard from './pages/student/Dashboard';
import Explore from './pages/student/Explore';
import ProgramDetails from './pages/student/ProgramDetails';
import Tracker from './pages/student/Tracker';
import CostEstimator from './pages/student/Cost';
import VisaGuidance from './pages/student/Visa';
import StudentProfile from './pages/student/Profile';
import Scholarships from './pages/student/Scholarships';
import ScholarshipDetails from './pages/student/ScholarshipDetails';
import SavedPrograms from './pages/student/SavedPrograms';
import SavedScholarships from './pages/student/SavedScholarships';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPrograms from './pages/admin/Programs';
import AdminScholarships from './pages/admin/Scholarships';
import AdminCosts from './pages/admin/Costs';
import AdminSettings from './pages/admin/Settings';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/explore" element={<Explore isGuest={true} />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="profile-setup" element={<ProfileSetup />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="explore" element={<Explore />} />
          <Route path="program/:id" element={<ProgramDetails />} />
          <Route path="saved-programs" element={<SavedPrograms />} />
          <Route path="saved-scholarships" element={<SavedScholarships />} />
          <Route path="scholarships" element={<Scholarships />} />
          <Route path="scholarships/:id" element={<ScholarshipDetails />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="cost" element={<CostEstimator />} />
          <Route path="visa" element={<VisaGuidance />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="scholarships" element={<AdminScholarships />} />
          <Route path="costs" element={<AdminCosts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
