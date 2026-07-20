import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedLayout } from '../components/common/ProtectedLayout';
import { GuestLayout } from '../components/common/GuestLayout';

// Lazy loaded page components
const Landing = lazy(() => import('../pages/Landing').then(m => ({ default: m.Landing })));
const Login = lazy(() => import('../pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const Dashboard = lazy(() => import('../pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Jobs = lazy(() => import('../pages/Jobs').then(m => ({ default: m.Jobs })));
const ApplicationsPage = lazy(() => import('../pages/ApplicationsPage').then(m => ({ default: m.ApplicationsPage })));
const InterviewsPage = lazy(() => import('../pages/InterviewsPage').then(m => ({ default: m.InterviewsPage })));
const OffersPage = lazy(() => import('../pages/OffersPage').then(m => ({ default: m.OffersPage })));
const RejectedPage = lazy(() => import('../pages/RejectedPage').then(m => ({ default: m.RejectedPage })));
const ResumeAnalyzer = lazy(() => import('../pages/ResumeAnalyzer').then(m => ({ default: m.ResumeAnalyzer })));
const Profile = lazy(() => import('../pages/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const Contact = lazy(() => import('../pages/Contact').then(m => ({ default: m.Contact })));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('../pages/TermsOfService').then(m => ({ default: m.TermsOfService })));
const InterviewPrepWorkspace = lazy(() => import('../pages/InterviewPrepWorkspace').then(m => ({ default: m.InterviewPrepWorkspace })));



export const AppRoutes = () => {
  return (
    <Suspense fallback={
      <div className="flex-grow flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-7 w-7 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    }>
      <Routes>
        {/* Guest only routes */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/applications" element={<ApplicationsPage />} />
          <Route path="/jobs/interviews" element={<InterviewsPage />} />
          <Route path="/jobs/offers" element={<OffersPage />} />
          <Route path="/jobs/rejected" element={<RejectedPage />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/interview-prep" element={<InterviewPrepWorkspace />} />
          <Route path="/interview-prep/:jobId" element={<InterviewPrepWorkspace />} />
        </Route>

        {/* Public static info pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

