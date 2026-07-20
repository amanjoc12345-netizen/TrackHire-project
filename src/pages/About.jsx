import React from 'react';
import { Shield, Sparkles, Zap, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const About = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 sm:py-24 transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-widest bg-brand-50 dark:bg-brand-950/30 px-3 py-1 rounded-full border border-brand-100 dark:border-brand-900/50">
            About TrackHire
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mt-4">
            A centralized hub for your job search.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            TrackHire was built to remove the administrative chaos from applying to jobs. We design software centered around speed, privacy, and utility.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 hover:border-brand-500 transition-custom">
            <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Simplicity & Speed</h3>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
              We drop the slow dashboards, spammy animations, and excessive clutter. TrackHire supplies a sleek, performant application focused strictly on core value.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 hover:border-brand-500 transition-custom">
            <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Contextual Utilities</h3>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
              Use language models to compare resumes against job descriptions, locate keyword gaps, and generate role-specific prep material.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 hover:border-brand-500 transition-custom">
            <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Secure & Private</h3>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
              Your data belongs solely to you. All resumes, credentials, and tracked positions are fully secured under Firebase protocol rules.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 hover:border-brand-500 transition-custom">
            <div className="h-10 w-10 rounded-md bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-5">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">Developer-Built Quality</h3>
            <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
              Engineered using the best practices in React and responsive design. Made for job seekers who value precision and design clarity.
            </p>
          </div>
        </div>

        {/* Detailed Description */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-2xl p-8 sm:p-10 space-y-6 mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Why we built this</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            Tracking active applications should not feel like administrative overhead. We grew tired of messy spreadsheets, fragmented document folders, and slow legacy platforms. TrackHire is a clean, single-purpose home for organizing candidate files.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
            By connecting a Kanban board, a parser to spot keyword mismatches, and helper drafting tools, we want to help candidates structure their search with less friction.
          </p>
        </div>

        {/* Call to action */}
        <div className="text-center bg-brand-600 dark:bg-white rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col items-center gap-4">
          <h2 className="text-xl sm:text-3xl font-bold text-white dark:text-slate-950">
            Start organizing your search.
          </h2>
          <p className="text-xs sm:text-sm text-brand-100 dark:text-slate-600 max-w-md">
            Centralize your logs, analyze match gaps, and prepare drafts in a clean working space.
          </p>
          <Link to="/register" className="mt-4">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-slate-50 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900 border-none font-bold shadow-md flex items-center gap-1">
              Create Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
