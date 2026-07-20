import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const RecentApplications = ({ jobs }) => {
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50';
      case 'interviewing':
        return 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50';
      case 'offer':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50';
      case 'rejected':
        return 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-955/30 border-rose-200 dark:border-rose-900/50';
      default:
        return 'text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700';
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Show at most 5 recent applications
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/20">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Applications</h3>
        <Link to="/jobs" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 flex items-center gap-0.5">
          View all <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/40 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3">Company</th>
              <th className="px-6 py-3">Role</th>
              <th className="px-6 py-3">Salary</th>
              <th className="px-6 py-3">Applied</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {recentJobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors">
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{job.company}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-355">{job.position}</td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-mono text-xs">
                  {job.salary ? `$${job.salary}` : '—'}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450">
                  {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyle(job.status)}`}>
                    {capitalize(job.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
