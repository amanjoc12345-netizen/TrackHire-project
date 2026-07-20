import React from 'react';
import { X, Calendar, Clock, MapPin, DollarSign, ExternalLink, FileText, Trash2, Edit, Video, User, Link2 } from 'lucide-react';
import { Button } from '../common/Button';
import { useJobStore } from '../../store/jobStore';

const JobTimeline = ({ status }) => {
  const steps = ['Applied', 'HR Round', 'Technical', 'Final', 'Outcome'];
  
  const getActiveStep = (statusStr) => {
    const s = statusStr?.toLowerCase();
    if (s === 'wishlist' || s === 'applied') return 0;
    if (s === 'hr round') return 1;
    if (s === 'technical' || s === 'assignment') return 2;
    if (s === 'final') return 3;
    if (s === 'offer' || s === 'rejected') return 4;
    return 0;
  };
  
  const activeIndex = getActiveStep(status);
  const isOffer = status?.toLowerCase() === 'offer';
  const isRejected = status?.toLowerCase() === 'rejected';

  return (
    <div className="pt-4 pb-2 border-t border-slate-100 dark:border-slate-800">
      <span className="block text-slate-500 dark:text-slate-450 font-medium mb-3 text-xs uppercase tracking-wider">
        Status Progression
      </span>
      <div className="flex items-center justify-between relative px-2">
        {/* Connecting line */}
        <div className="absolute left-6 right-6 top-3.5 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
        
        {/* Active colored line */}
        <div 
          className={`absolute left-6 top-3.5 h-0.5 z-0 transition-all duration-300 ${
            isRejected && activeIndex === 4 
              ? 'bg-rose-500' 
              : isOffer && activeIndex === 4 
                ? 'bg-emerald-500' 
                : 'bg-brand-500'
          }`}
          style={{ width: `${(activeIndex / (steps.length - 1)) * 88}%` }}
        />

        {steps.map((step, idx) => {
          const isActive = idx <= activeIndex;
          const isCurrent = idx === activeIndex;
          
          let stepLabel = step;
          if (step === 'Outcome') {
            if (isOffer) stepLabel = 'Offer';
            else if (isRejected) stepLabel = 'Rejected';
            else stepLabel = 'Offer / Rejected';
          }

          let dotColor = 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400';
          if (isActive) {
            if (step === 'Outcome') {
              if (isOffer) dotColor = 'bg-emerald-500 border-emerald-600 text-white';
              else if (isRejected) dotColor = 'bg-rose-500 border-rose-600 text-white';
              else dotColor = 'bg-brand-500 border-brand-600 text-white';
            } else {
              dotColor = 'bg-brand-500 border-brand-600 text-white';
            }
          }

          return (
            <div key={step} className="flex flex-col items-center z-10">
              <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${dotColor} transition-all duration-300`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 ${
                isCurrent 
                  ? isOffer 
                    ? 'text-emerald-600 dark:text-emerald-450 font-bold' 
                    : isRejected 
                      ? 'text-rose-600 dark:text-rose-455 font-bold' 
                      : 'text-brand-600 dark:text-brand-400 font-bold'
                  : isActive 
                    ? 'text-slate-700 dark:text-slate-300' 
                    : 'text-slate-400 dark:text-slate-500'
              }`}>
                {stepLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const JobDetailsModal = ({ isOpen, onClose, job, onEdit, onDeleteSuccess, onDeleteError }) => {
  const { deleteJob, loading } = useJobStore();

  if (!isOpen || !job) return null;

  const handleDelete = async () => {
    if (window.confirm(`Delete application for ${job.company}?`)) {
      try {
        await deleteJob(job.id);
        if (typeof onDeleteSuccess === 'function') {
          onDeleteSuccess(job.company);
        }
        onClose();
      } catch (err) {
        console.error('Failed to delete job:', err);
        if (typeof onDeleteError === 'function') {
          onDeleteError(err);
        }
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'wishlist':
        return 'text-purple-700 bg-purple-50 dark:text-purple-300 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/50';
      case 'applied':
        return 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50';
      case 'hr round':
      case 'technical':
      case 'assignment':
      case 'final':
        return 'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50';
      case 'offer':
        return 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/50';
      case 'rejected':
        return 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-955/30 border-rose-200 dark:border-rose-900/50';
      default:
        return 'text-slate-700 bg-slate-50 dark:text-slate-300 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700';
    }
  };

  const isInterviewState = ['hr round', 'technical', 'assignment', 'final'].includes(job.status?.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="relative w-full max-w-lg sm:max-w-xl rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xl transition-all duration-200 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
            <div className="min-w-0 mr-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-tight truncate">
                {job.position}
              </h3>
              <p className="text-base text-slate-500 dark:text-slate-400 mt-1 font-semibold truncate">
                {job.company}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Details list */}
          <div className="space-y-4 text-sm mb-6">
            
            {/* Status badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Status:</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(job.status)}`}>
                {job.status}
              </span>
            </div>

            {/* Location */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Location:</span>
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                {job.location}
              </span>
            </div>

            {/* Salary */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Salary:</span>
              <span className="flex items-center gap-0.5 text-slate-800 dark:text-slate-200 font-mono">
                <DollarSign className="h-4 w-4 text-slate-450 flex-shrink-0" />
                {job.salary || '\u2014'}
              </span>
            </div>

            {/* Applied Date */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Applied On:</span>
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                {job.appliedDate ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : '\u2014'}
              </span>
            </div>

            {/* Resume version */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Resume:</span>
              <span className="flex items-center gap-1 text-slate-800 dark:text-slate-200">
                <FileText className="h-4 w-4 text-slate-400 flex-shrink-0" />
                {job.resumeVersion || '\u2014'}
              </span>
            </div>

            {/* Job URL */}
            {job.jobUrl && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-slate-500 dark:text-slate-400 w-full sm:w-20 flex-shrink-0">Listing URL:</span>
                <a 
                  href={job.jobUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:underline cursor-pointer truncate"
                >
                  Visit Job Post
                  <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                </a>
              </div>
            )}

            {/* Conditional Interview Schedule block */}
            {isInterviewState && job.interviewDate && (
              <div className="border border-slate-200 dark:border-slate-800/80 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3">
                <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Scheduled Interview
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(job.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  {job.interviewTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300 font-mono">{job.interviewTime}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    {job.interviewType?.toLowerCase() === 'online' ? (
                      <Video className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    ) : (
                      <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-slate-700 dark:text-slate-300">{job.interviewType || 'Online'}</span>
                  </div>
                  {job.interviewerName && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-slate-300">{job.interviewerName}</span>
                    </div>
                  )}
                </div>

                {job.meetingLink && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-850 flex items-center gap-2 text-xs">
                    <Link2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    <a 
                      href={job.meetingLink.startsWith('http') ? job.meetingLink : `https://${job.meetingLink}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-brand-605 dark:text-brand-400 hover:underline truncate"
                    >
                      {job.meetingLink}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Stepper Status Progression Timeline */}
            <JobTimeline status={job.status} />

            {/* Notes */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="block text-slate-500 dark:text-slate-455 font-medium mb-1.5">Notes:</span>
              <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-md border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-300 whitespace-pre-wrap min-h-[80px]">
                {job.notes || 'No description or notes added yet.'}
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="w-full sm:w-auto text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 cursor-pointer"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto cursor-pointer"
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onEdit(job);
                  onClose();
                }}
                className="w-full sm:w-auto cursor-pointer"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Job
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
