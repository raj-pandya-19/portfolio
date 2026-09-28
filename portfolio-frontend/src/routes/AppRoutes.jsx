import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/admin/LoginPage';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

import DashboardHome from '../pages/admin/DashboardHome';
import AboutAdmin from '../pages/admin/AboutAdmin';
import SkillsAdmin from '../pages/admin/SkillsAdmin';
import ExperiencesAdmin from '../pages/admin/ExperiencesAdmin';
import EducationAdmin from '../pages/admin/EducationAdmin';
import CertificatesAdmin from '../pages/admin/CertificatesAdmin';
import TrainingAdmin from '../pages/admin/TrainingAdmin';
import LearningAdmin from '../pages/admin/LearningAdmin';
import ProjectsAdmin from '../pages/admin/ProjectsAdmin';
import SocialLinksAdmin from '../pages/admin/SocialLinksAdmin';
import MediaLibrary from '../pages/admin/MediaLibrary';
import ContactsInbox from '../pages/admin/ContactsInbox';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Single-Page Portfolio */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout title="Overview" />}>
          <Route index element={<DashboardHome />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="experiences" element={<ExperiencesAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="certificates" element={<CertificatesAdmin />} />
          <Route path="training" element={<TrainingAdmin />} />
          <Route path="learning" element={<LearningAdmin />} />
          <Route path="projects" element={<ProjectsAdmin />} />
          <Route path="social-links" element={<SocialLinksAdmin />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="contacts" element={<ContactsInbox />} />
        </Route>
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}