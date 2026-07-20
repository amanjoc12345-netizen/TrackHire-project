import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const ComingSoon = ({ title, phase }) => {
  return (
    <div className="flex-grow flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-8 shadow-2xs max-w-md w-full text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-950/30 text-brand-600 dark:text-brand-400 mb-6">
          <Sparkles className="h-6 w-6" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          {title}
        </h1>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          This feature is currently in active development and will be released in <strong className="text-brand-600 dark:text-brand-400">{phase}</strong>.
        </p>

        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6">
          <Link to="/dashboard">
            <Button variant="secondary" className="w-full cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
