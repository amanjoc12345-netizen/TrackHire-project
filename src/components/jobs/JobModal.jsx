import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, AlertCircle } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useJobStore } from '../../store/jobStore';
import { useAuthStore } from '../../store/authStore';

const jobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position title is required'),
  salary: z.string().optional(),
  location: z.enum(['Remote', 'Hybrid', 'On-site']),
  jobUrl: z.string().optional(),
  appliedDate: z.string().min(1, 'Applied date is required'),
  status: z.enum(['Wishlist', 'Applied', 'HR Round', 'Technical', 'Assignment', 'Final', 'Offer', 'Rejected']),
  notes: z.string().optional(),
  resumeVersion: z.string().optional(),
  // Conditional interview fields (simple string checking to prevent strict URL validation blockages)
  interviewDate: z.string().optional(),
  interviewTime: z.string().optional(),
  interviewType: z.enum(['Online', 'Offline']).optional(),
  meetingLink: z.string().optional(),
  interviewerName: z.string().optional()
});

export const JobModal = ({ isOpen, onClose, jobToEdit }) => {
  const { user } = useAuthStore();
  const { addJob, updateJob, loading } = useJobStore();
  const [submitError, setSubmitError] = useState(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      company: '',
      position: '',
      salary: '',
      location: 'Remote',
      jobUrl: '',
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      notes: '',
      resumeVersion: '',
      interviewDate: '',
      interviewTime: '',
      interviewType: 'Online',
      meetingLink: '',
      interviewerName: ''
    }
  });

  const selectedStatus = watch('status');
  const showInterviewFields = ['HR Round', 'Technical', 'Final'].includes(selectedStatus);

  useEffect(() => {
    setSubmitError(null);
    if (jobToEdit) {
      reset({
        company: jobToEdit.company || '',
        position: jobToEdit.position || '',
        salary: jobToEdit.salary || '',
        location: jobToEdit.location || 'Remote',
        jobUrl: jobToEdit.jobUrl || '',
        appliedDate: jobToEdit.appliedDate || '',
        status: jobToEdit.status || 'Applied',
        notes: jobToEdit.notes || '',
        resumeVersion: jobToEdit.resumeVersion || '',
        interviewDate: jobToEdit.interviewDate || '',
        interviewTime: jobToEdit.interviewTime || '',
        interviewType: jobToEdit.interviewType || 'Online',
        meetingLink: jobToEdit.meetingLink || '',
        interviewerName: jobToEdit.interviewerName || ''
      });
    } else {
      reset({
        company: '',
        position: '',
        salary: '',
        location: 'Remote',
        jobUrl: '',
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Applied',
        notes: '',
        resumeVersion: '',
        interviewDate: '',
        interviewTime: '',
        interviewType: 'Online',
        meetingLink: '',
        interviewerName: ''
      });
    }
  }, [jobToEdit, reset, isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    if (!user) return;
    setSubmitError(null);
    try {
      const jobData = {
        ...data,
        userId: user.uid,
        updatedAt: new Date().toISOString()
      };

      // Clean up interview fields if status is not an interview state
      if (!showInterviewFields) {
        delete jobData.interviewDate;
        delete jobData.interviewTime;
        delete jobData.interviewType;
        delete jobData.meetingLink;
        delete jobData.interviewerName;
      } else {
        // Validation check for active interviews
        if (!data.interviewDate) {
          setSubmitError('Interview Date is required for active interview stages.');
          return;
        }
      }

      if (jobToEdit) {
        await updateJob(jobToEdit.id, jobData);
      } else {
        await addJob({
          ...jobData,
          createdAt: new Date().toISOString()
        });
      }
      onClose();
    } catch (err) {
      console.error('Failed to submit job:', err);
      setSubmitError(err.message || 'Failed to save application to Firestore.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 lg:p-6">
        <div className="relative w-full max-w-lg sm:max-w-2xl lg:max-w-3xl rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 lg:p-8 shadow-xl transition-all duration-200 animate-in fade-in zoom-in-95 duration-150 max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-105 dark:border-slate-800 mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {jobToEdit ? 'Edit Job Application' : 'Add New Job'}
            </h3>
            <button 
              type="button"
              onClick={onClose} 
              className="text-slate-450 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer flex-shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Submit Error alert */}
          {submitError && (
            <div className="mb-4 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
              <span className="min-w-0">{submitError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Name *"
                type="text"
                error={errors.company?.message}
                placeholder="Google, Stripe, etc."
                {...register('company')}
              />
              <Input
                label="Position Title *"
                type="text"
                error={errors.position?.message}
                placeholder="Frontend Engineer"
                {...register('position')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Salary Range (Optional)"
                type="text"
                error={errors.salary?.message}
                placeholder="$120k - $150k"
                {...register('salary')}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Job Location *
                </label>
                <select
                  className="w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
                  {...register('location')}
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                </select>
                {errors.location && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Applied Date *"
                type="date"
                error={errors.appliedDate?.message}
                {...register('appliedDate')}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Application Status *
                </label>
                <select
                  className="w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
                  {...register('status')}
                >
                  <option value="Wishlist">Wishlist</option>
                  <option value="Applied">Applied</option>
                  <option value="HR Round">HR Round</option>
                  <option value="Technical">Technical</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Final">Final Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-xs text-red-500 font-medium">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Conditional Interview Fields */}
            {showInterviewFields && (
              <div className="border border-slate-200 dark:border-slate-800/80 rounded-lg p-4 bg-slate-50/50 dark:bg-slate-955/25 space-y-4">
                <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                  Interview Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Interview Date *"
                    type="date"
                    required
                    error={errors.interviewDate?.message}
                    {...register('interviewDate')}
                  />
                  <Input
                    label="Interview Time (Optional)"
                    type="time"
                    error={errors.interviewTime?.message}
                    {...register('interviewTime')}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                      Interview Type *
                    </label>
                    <select
                      className="w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors cursor-pointer"
                      {...register('interviewType')}
                    >
                      <option value="Online">Online</option>
                      <option value="Offline">Offline</option>
                    </select>
                  </div>
                  <Input
                    label="Interviewer Name (Optional)"
                    type="text"
                    error={errors.interviewerName?.message}
                    placeholder="Jane Doe"
                    {...register('interviewerName')}
                  />
                </div>

                <Input
                  label="Meeting Link / Location (Optional)"
                  type="text"
                  error={errors.meetingLink?.message}
                  placeholder="zoom.us/j/12345 or Office address"
                  {...register('meetingLink')}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Job Post URL (Optional)"
                type="text"
                error={errors.jobUrl?.message}
                placeholder="linkedin.com/jobs/..."
                {...register('jobUrl')}
              />
              <Input
                label="Resume Version (Optional)"
                type="text"
                error={errors.resumeVersion?.message}
                placeholder="V2 - Fullstack"
                {...register('resumeVersion')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Notes & Description (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full rounded-md border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors resize-none placeholder-slate-400 dark:placeholder-slate-500"
                placeholder="Interview questions, response logs, etc."
                {...register('notes')}
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-105 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                className="w-full sm:w-auto cursor-pointer"
              >
                {jobToEdit ? 'Save Changes' : 'Add Job'}
              </Button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
