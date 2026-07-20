import React from 'react';
import { Gavel, Globe, CheckCircle, AlertTriangle, LifeBuoy } from 'lucide-react';

export const TermsOfService = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-brand-950/30 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
            Legal Statement
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Last Updated: July 20, 2026
          </p>
        </div>

        {/* Content card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-8 sm:p-10 space-y-8 text-xs sm:text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-sans">
          
          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gavel className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By creating an account or accessing the TrackHire application, you agree to comply with and be bound by these Terms of Service. If you do not agree, you must immediately terminate use of the service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              2. Description of Service
            </h2>
            <p>
              TrackHire is a web-based productivity and tracking system that assists users in managing their job searches. The platform offers tools for logging applications, organizing interviews, constructing resumes, and parsing job specifications using artificial intelligence.
            </p>
            <p>
              We reserve the right to modify, suspend, or terminate the application features, structures, or API routes at any time without notice or liability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              3. User Obligations & Conduct
            </h2>
            <p>
              You agree to use TrackHire in compliance with all applicable local, national, and international laws. When using the application, you must not:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-500 dark:text-slate-400">
              <li>Upload malicious code, viruses, or spam payloads via interview workspace tools or details forms.</li>
              <li>Attempt to scrape, reverse engineer, or disable database layers, API servers, or layouts.</li>
              <li>Create duplicate or robotic accounts to abuse backend parser services.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              4. Disclaimer of Warranties
            </h2>
            <p>
              TrackHire is provided "as is" and "as available" without warranty of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the application will be uninterrupted, error-free, secure, or that the AI resume analyzer will guarantee interviews or employment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LifeBuoy className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
              5. Governing Law
            </h2>
            <p>
              These Terms of Service shall be governed by and construed in accordance with the laws applicable to consumer software operations, without giving effect to conflict of laws principles. Any dispute arising under these Terms shall be resolved in appropriate local forums.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
