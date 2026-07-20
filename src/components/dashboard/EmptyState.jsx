import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus } from 'lucide-react';
import { Button } from '../common/Button';

export const EmptyState = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-10 shadow-2xs text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4 border border-slate-200/60 dark:border-slate-700">
        <Briefcase className="h-5 w-5" />
      </div>
      
      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
        No logged applications
      </h3>
      
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        Your active dashboard is empty. Add the roles you are applying to so you can track interviews, store draft document details, and organize status cards in one workspace.
      </p>

      <Link to="/jobs">
        <Button variant="primary" className="gap-1.5 shadow-sm cursor-pointer">
          <Plus className="h-4 w-4" />
          Add First Job
        </Button>
      </Link>
    </div>
  );
};
