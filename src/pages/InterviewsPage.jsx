import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { JobModal } from '../components/jobs/JobModal';
import { Calendar, Clock, MapPin, Edit, Trash2, ArrowLeft, Video, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const InterviewsPage = () => {
  const { user } = useAuthStore();
  const { jobs, loading, fetchJobs, deleteJob } = useJobStore();

  const [selectedJob, setSelectedJob] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (user?.uid) {
      fetchJobs(user.uid);
    }
  }, [user?.uid, fetchJobs]);

  const interviewJobs = jobs.filter((job) =>
    ['hr round', 'technical', 'assignment', 'final'].includes(job.status?.toLowerCase())
  );

  const handleDelete = async (e, job) => {
    e.stopPropagation();
    if (window.confirm(`Delete the interview for ${job.company}?`)) {
      try {
        await deleteJob(job.id);
        setToast({ type: 'success', message: `Interview for ${job.company} deleted successfully.` });
      } catch (err) {
        console.error('Failed to delete job:', err);
        setToast({ type: 'error', message: err.message || 'Failed to delete interview.' });
      }
    }
  };

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full flex flex-col gap-6 transition-colors duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-brand-600 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Interview Schedules
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Track and manage your upcoming HR rounds, technical evaluations, and final reviews.
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => {
            setJobToEdit(null);
            setIsModalOpen(true);
          }}
          className="cursor-pointer"
        >
          Add Interview Role
        </Button>
      </div>

      {/* Main content table */}
      {loading && jobs.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-7 w-7 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Loading interviews...</span>
          </div>
        </div>
      ) : interviewJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-500 dark:text-slate-400 shadow-2xs flex flex-col items-center gap-2">
          <Calendar className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">No scheduled interviews</span>
          <span className="text-xs text-slate-450 dark:text-slate-500 max-w-xs leading-normal">Applications marked as "HR Round", "Technical", "Assignment", or "Final" will appear in this timeline.</span>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left text-sm">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-955/45 text-xs font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Stage</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5">Time</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5 max-w-[200px] truncate">Notes</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                {interviewJobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => {
                      setSelectedJob(job);
                      setIsDetailsOpen(true);
                    }}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-850/20 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{job.company}</td>
                    <td className="px-6 py-4 text-slate-700 dark:text-slate-300">{job.position}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300">
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-medium">
                      {job.interviewDate ? new Date(job.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450 font-mono text-xs">
                      {job.interviewTime || '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-450">
                      {job.interviewType ? (
                        <span className="flex items-center gap-1">
                          {job.interviewType.toLowerCase() === 'online' ? (
                            <Video className="h-3.5 w-3.5 text-slate-400" />
                          ) : (
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          {job.interviewType}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-slate-450 dark:text-slate-500 truncate max-w-[200px]">
                      {job.notes || '—'}
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleEditClick(job)}
                          className="text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit Interview"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, job)}
                          className="text-slate-400 hover:text-red-650 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete Interview"
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
      )}

      {/* Modals */}
      <JobModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setJobToEdit(null);
        }}
        jobToEdit={jobToEdit}
      />

      <JobDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedJob(null);
        }}
        job={selectedJob}
        onEdit={handleEditClick}
        onDeleteSuccess={(company) => setToast({ type: 'success', message: `Interview for ${company} deleted successfully.` })}
        onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete interview.' })}
      />

      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-5 right-5 flex items-center gap-2.5 px-4 py-3 rounded-lg border shadow-lg z-50 animate-in slide-in-from-bottom-5 duration-350
            ${toast.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-955/90 dark:text-emerald-350 border-emerald-200 dark:border-emerald-900/50' 
              : 'bg-red-50 dark:bg-red-955/90 text-red-800 dark:text-red-350 border-red-200 dark:border-red-900/50'
            }`}
        >
          {toast.type === 'success' ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white font-bold text-xs">!</div>
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

    </div>
  );
};
