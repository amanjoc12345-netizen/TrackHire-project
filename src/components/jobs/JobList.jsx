import React from 'react';
import { Calendar, MapPin, DollarSign, Edit, Trash2, ExternalLink } from 'lucide-react';
import { useJobStore } from '../../store/jobStore';

export const JobList = ({ jobs, onCardClick, onEditClick, onDeleteSuccess, onDeleteError }) => {
  const { deleteJob, loading } = useJobStore();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'wishlist':
        return 'text-purple-755 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50';
      case 'applied':
        return 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-955/30 border-amber-200 dark:border-amber-900/50';
      case 'hr round':
      case 'technical':
      case 'assignment':
      case 'final':
        return 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-955/30 border-blue-200 dark:border-blue-900/50';
      case 'offer':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-955/30 border-emerald-200 dark:border-emerald-900/50';
      case 'rejected':
        return 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-955/30 border-rose-200 dark:border-rose-900/50';
      default:
        return 'text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700';
    }
  };

  const handleDelete = async (e, job) => {
    e.stopPropagation();
    if (window.confirm(`Delete application for ${job.company}?`)) {
      try {
        await deleteJob(job.id);
        if (typeof onDeleteSuccess === 'function') {
          onDeleteSuccess(job.company);
        }
      } catch (err) {
        console.error('Failed to delete job:', err);
        if (typeof onDeleteError === 'function') {
          onDeleteError(err);
        }
      }
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-10 text-center text-sm text-slate-500 dark:text-slate-400">
        No job applications match your filters.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-950/40 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-3.5">Company</th>
              <th className="px-6 py-3.5">Position</th>
              <th className="px-6 py-3.5">Location</th>
              <th className="px-6 py-3.5">Applied Date</th>
              <th className="px-6 py-3.5">Salary</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
            {jobs.map((job) => (
              <tr 
                key={job.id} 
                onClick={() => onCardClick(job)}
                className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200 truncate max-w-[150px]">
                  {job.company}
                </td>
                <td className="px-6 py-4 text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                  {job.position}
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    {job.location}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                    {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-mono text-xs">
                  {job.salary ? (
                    <span className="flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                      {job.salary}
                    </span>
                  ) : '—'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-end gap-1.5">
                    {job.jobUrl && (
                      <a 
                        href={job.jobUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-md hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors"
                        title="Visit Job Listing"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => onEditClick(job)}
                      className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 p-1.5 rounded-md hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit Application"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, job)}
                      disabled={loading}
                      className="text-slate-400 hover:text-red-650 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-slate-105 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Delete Application"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
