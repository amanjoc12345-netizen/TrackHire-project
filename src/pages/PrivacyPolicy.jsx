import React from 'react';
import { ShieldAlert, Eye, Lock, RefreshCw, FileText } from 'lucide-react';

export const PrivacyPolicy = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-brand-950/30 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
            Legal Statement
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last Updated: July 20, 2026
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Eye className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              1. Information We Collect
            </h2>
            <p>
              TrackHire is built with user privacy as a foundational pillar. We only collect the data necessary to provide and support our job tracking services:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 dark:text-slate-400">
              <li><strong>Account Credentials:</strong> Basic auth data (email address, displayName, and profile photo URL) provided via Firebase Authentication.</li>
              <li><strong>Application & Resume Logs:</strong> Company metadata, salary bounds, statuses, resume details, and interview calendar notes that you log on your dashboard.</li>
              <li><strong>Local Storage:</strong> Temporary session parameters (such as saved job descriptions and preference profiles) to keep interactions snappy.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              2. Data Security & Storage
            </h2>
            <p>
              Your data is secured directly using Firebase's security rules and authentication parameters. Resumes uploaded for extraction are parsed on our backend and the resulting data remains protected in the database schema.
            </p>
            <p>
              We do not sell, trade, or share your personal database data or uploaded files with third parties. No background monitoring or automated profiling of your job logs takes place.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RefreshCw className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              3. Data Portability & Rights
            </h2>
            <p>
              You maintain full ownership of your data at all times. TrackHire provides tools in the settings menu allowing you to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 dark:text-slate-400">
              <li><strong>Export Data:</strong> Compile and download all your profile data, job logs, resumes, and analysis histories in a standard JSON format.</li>
              <li><strong>Delete Account:</strong> Permanently erase your profile settings and databases from the Firebase store, terminating all current access.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              4. Cookies
            </h2>
            <p>
              We use standard, non-invasive cookies and browser local storage strictly to cache your active authentication state and visual settings (such as dark/light mode toggles). We do not run any ad-tracking or analytics-tracking pixels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              5. Contact Us
            </h2>
            <p>
              For questions concerning this Privacy Policy, your records, or system storage, please contact us at <a href="mailto:support@trackhire.com" className="text-brand-600 dark:text-brand-400 hover:underline">support@trackhire.com</a> or open a ticket through our contact form.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
