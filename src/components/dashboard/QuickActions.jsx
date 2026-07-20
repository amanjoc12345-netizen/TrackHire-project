import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, FileText, Wand2 } from 'lucide-react';
import { Button } from '../common/Button';

export const QuickActions = () => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-2.5">
        <Link to="/jobs">
          <Button variant="outline" className="w-full justify-start text-left gap-2 text-slate-700 dark:text-slate-305 cursor-pointer">
            <Plus className="h-4 w-4 text-brand-650 dark:text-brand-400" />
            <span>Add Job Application</span>
          </Button>
        </Link>
        <Link to="/resume-analyzer">
          <Button variant="outline" className="w-full justify-start text-left gap-2 text-slate-700 dark:text-slate-305 cursor-pointer">
            <Sparkles className="h-4 w-4 text-brand-650 dark:text-brand-400" />
            <span>Optimize Resume</span>
          </Button>
        </Link>
        <Link to="/interview-prep">
          <Button variant="outline" className="w-full justify-start text-left gap-2 text-slate-700 dark:text-slate-305 cursor-pointer">
            <Sparkles className="h-4 w-4 text-brand-650 dark:text-brand-400" />
            <span>Interview Preparation</span>
          </Button>
        </Link>
        <Link to="/jobs">
          <Button variant="outline" className="w-full justify-start text-left gap-2 text-slate-700 dark:text-slate-305 cursor-pointer">
            <FileText className="h-4 w-4 text-brand-650 dark:text-brand-400" />
            <span>Generate Cover Letter</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};
