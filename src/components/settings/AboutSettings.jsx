import React from 'react';
import { Link } from 'react-router-dom';
import { Info, Github, LifeBuoy, FileText, Globe } from 'lucide-react';
import { Logo } from '../common/Logo';

export const AboutSettings = () => {
  const envMode = import.meta.env.MODE || 'production';
  const displayEnv = envMode.charAt(0).toUpperCase() + envMode.slice(1);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">About TrackHire</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Technical specifications and developer attributes of the application.
        </p>
      </div>

      {/* Specifications Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-5 space-y-4">
        <div className="flex gap-3 items-center">
          <Logo className="h-5 w-5 text-slate-800 dark:text-white flex-shrink-0" />
          <div>
            <span className="text-[10px] font-bold text-slate-405 uppercase tracking-wider block">Application Name</span>
            <span className="text-xs text-slate-800 dark:text-slate-200 font-bold">TrackHire</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-850 pt-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Version</span>
            <span className="text-xs text-slate-800 dark:text-slate-250 font-semibold">v1.2.0</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Environment</span>
            <span className="text-xs text-slate-805 dark:text-slate-250 font-semibold">{displayEnv}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Developer</span>
            <span className="text-xs text-slate-805 dark:text-slate-255 font-semibold">aman.joshi</span>
          </div>
        </div>
      </div>

      {/* Resource links */}
      <div className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3.5">
        <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1">
          <Info className="h-3.5 w-3.5" />
          Resources & Support Links
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1.5">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
          >
            <Github className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <span>GitHub Repository</span>
          </a>
          <Link
            to="/contact"
            className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
          >
            <LifeBuoy className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <span>Contact Support</span>
          </Link>
          <Link
            to="/privacy"
            className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
          >
            <FileText className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <span>Privacy Policy</span>
          </Link>
          <Link
            to="/terms"
            className="flex items-center gap-2.5 text-xs text-slate-650 hover:text-brand-600 dark:text-slate-350 dark:hover:text-brand-405 group transition-colors"
          >
            <Globe className="h-4 w-4 text-slate-400 group-hover:text-brand-500 transition-colors" />
            <span>Terms of Service</span>
          </Link>
        </div>
      </div>

    </div>
  );
};
