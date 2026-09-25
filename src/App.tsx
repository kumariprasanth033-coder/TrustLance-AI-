/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AIChatbot } from './components/AIChatbot';

// Pages
import { LandingPage } from './pages/LandingPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { ServicesPage } from './pages/ServicesPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { FreelancerDirectoryPage } from './pages/FreelancerDirectoryPage';
import { FreelancerProfilePage } from './pages/FreelancerProfilePage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { ProjectCreationWizard } from './pages/ProjectCreationWizard';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { FreelancerDashboardPage } from './pages/FreelancerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { FAQPage } from './pages/FAQPage';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('trustlance_theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('trustlance_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('trustlance_theme', 'light');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1">
          <Routes>
            {/* Public Marketplace & Landing */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<RoleSelectionPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />
            <Route path="/freelancers" element={<FreelancerDirectoryPage />} />
            <Route path="/freelancers/:id" element={<FreelancerProfilePage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/faq" element={<FAQPage />} />

            {/* Customer Operations */}
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/customer/projects/create" element={<ProjectCreationWizard />} />
            <Route path="/customer/projects/:id" element={<ProjectWorkspacePage />} />

            {/* Freelancer Operations */}
            <Route path="/freelancer/dashboard" element={<FreelancerDashboardPage />} />
            <Route path="/freelancer/projects/:id" element={<ProjectWorkspacePage />} />

            {/* General Project Workspace route */}
            <Route path="/projects/:id" element={<ProjectWorkspacePage />} />

            {/* Administrative Operations */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <AIChatbot />
      </div>
    </BrowserRouter>
  );
}
