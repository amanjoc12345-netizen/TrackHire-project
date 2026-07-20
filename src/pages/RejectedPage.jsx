import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useJobStore } from '../store/jobStore';
import { JobList } from '../components/jobs/JobList';
import { JobModal } from '../components/jobs/JobModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { ArrowLeft, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RejectedPage = () => {
  const { user } = useAuthStore();
  const { jobs, loading, fetchJobs } = useJobStore();

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

  const rejectedJobs = jobs.filter((job) =>
    job.status?.toLowerCase() === 'rejected'
  );

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };

  const handleEditClick = (job) => {
    setJobToEdit(job);
    setIsModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full flex flex-col gap-6 transition-colors duration-200">
      
      {/* Header */}
      <div>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-405 hover:text-brand-600 mb-2 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Closed Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          Review and check closed job listings and rejection updates.
        </p>
      </div>

      {/* Main List Table */}
      {loading && jobs.length === 0 ? (
        <div className="flex-grow flex items-center justify-center min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-7 w-7 text-brand-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xs text-slate-505 dark:text-slate-400 font-semibold">Loading applications...</span>
          </div>
        </div>
      ) : rejectedJobs.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-12 text-center text-slate-500 dark:text-slate-400 shadow-2xs flex flex-col items-center gap-2">
          <XCircle className="h-8 w-8 text-slate-300 dark:text-slate-700" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">No archived applications</span>
          <span className="text-xs text-slate-450 dark:text-slate-500 max-w-xs leading-normal">Applications updated to the "Rejected" status are compiled here as an archive.</span>
        </div>
      ) : (
        <JobList 
          jobs={rejectedJobs} 
          onCardClick={handleCardClick} 
          onEditClick={handleEditClick} 
          onDeleteSuccess={(company) => setToast({ type: 'success', message: `Application for ${company} deleted successfully.` })}
          onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete application.' })}
        />
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
        onDeleteSuccess={(company) => setToast({ type: 'success', message: `Application for ${company} deleted successfully.` })}
        onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete application.' })}
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
