import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { Button } from '../components/common/Button';
import { ProfileHeader } from '../components/profile/ProfileHeader';
import { PersonalInfoCard } from '../components/profile/PersonalInfoCard';
import { CareerCard } from '../components/profile/CareerCard';
import { SkillsCard } from '../components/profile/SkillsCard';
import { SocialLinksCard } from '../components/profile/SocialLinksCard';
import { ResumeCard } from '../components/profile/ResumeCard';
import { ProfileCompletionCard } from '../components/profile/ProfileCompletionCard';
import { Save, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const profileValidationSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().refine(val => !val || /^[+]?[0-9\s-()]{7,20}$/.test(val), {
    message: 'Invalid phone number format'
  }).optional().or(z.literal('')),
  location: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
  headline: z.string().optional().or(z.literal('')),
  aboutMe: z.string().optional().or(z.literal('')),

  currentRole: z.string().optional().or(z.literal('')),
  yearsOfExperience: z.union([
    z.number().min(0, 'Experience cannot be negative').max(80, 'Experience cannot exceed 80 years'),
    z.nan(),
    z.literal('')
  ]).optional(),
  preferredJobRole: z.string().optional().or(z.literal('')),
  preferredLocation: z.string().optional().or(z.literal('')),
  expectedSalary: z.string().optional().or(z.literal('')),
  employmentType: z.string().optional().or(z.literal('')),
  workPreference: z.string().optional().or(z.literal('')),

  linkedin: z.string().refine(val => !val || /^https:\/\/(www\.)?linkedin\.com\/.*/.test(val), {
    message: 'Must be a valid LinkedIn URL (https://linkedin.com/...)'
  }).optional().or(z.literal('')),
  github: z.string().refine(val => !val || /^https:\/\/(www\.)?github\.com\/.*/.test(val), {
    message: 'Must be a valid GitHub URL (https://github.com/...)'
  }).optional().or(z.literal('')),
  portfolio: z.string().refine(val => !val || /^https?:\/\/.*/.test(val), {
    message: 'Must be a valid URL starting with http:// or https://'
  }).optional().or(z.literal('')),
  twitter: z.string().refine(val => !val || /^https:\/\/(www\.)?(twitter\.com|x\.com)\/.*/.test(val), {
    message: 'Must be a valid Twitter/X URL (https://x.com/...)'
  }).optional().or(z.literal('')),
  
  photoURL: z.string().optional().or(z.literal('')),
  skills: z.array(z.string()).optional(),
  resume: z.object({
    url: z.string().optional().or(z.literal('')),
    name: z.string().optional().or(z.literal('')),
    lastUpdated: z.string().optional().or(z.literal('')),
  }).optional(),
});

export const Profile = () => {
  const { user } = useAuthStore();
  const { profile, loading, saving, error, fetchProfile, updateProfile, uploadResume, deleteResume, clearError } = useProfileStore();
  
  const [toast, setToast] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { register, handleSubmit, watch, setValue, resetField, reset, formState: { errors, isDirty } } = useForm({
    resolver: zodResolver(profileValidationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      location: '',
      dob: '',
      gender: '',
      headline: '',
      aboutMe: '',
      currentRole: '',
      yearsOfExperience: 0,
      preferredJobRole: '',
      preferredLocation: '',
      expectedSalary: '',
      employmentType: '',
      workPreference: '',
      skills: [],
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: '',
      photoURL: '',
      resume: { url: '', name: '', lastUpdated: '' }
    }
  });

  // Fetch profile when user UID loads
  useEffect(() => {
    if (user?.uid) {
      fetchProfile(user.uid);
    }
  }, [user?.uid, fetchProfile]);

  // Sync loaded profile details back into form defaultValues (only on initial load)
  useEffect(() => {
    if (profile && !isInitialized) {
      reset({
        fullName: profile.fullName || '',
        email: profile.email || '',
        phoneNumber: profile.phoneNumber || '',
        location: profile.location || '',
        dob: profile.dob || '',
        gender: profile.gender || '',
        headline: profile.headline || '',
        aboutMe: profile.aboutMe || '',
        currentRole: profile.currentRole || '',
        yearsOfExperience: isNaN(Number(profile.yearsOfExperience)) ? '' : Number(profile.yearsOfExperience),
        preferredJobRole: profile.preferredJobRole || '',
        preferredLocation: profile.preferredLocation || '',
        expectedSalary: profile.expectedSalary || '',
        employmentType: profile.employmentType || '',
        workPreference: profile.workPreference || '',
        skills: profile.skills || [],
        linkedin: profile.socialLinks?.linkedin || '',
        github: profile.socialLinks?.github || '',
        portfolio: profile.socialLinks?.portfolio || '',
        twitter: profile.socialLinks?.twitter || '',
        photoURL: profile.photoURL || '',
        resume: profile.resume || { url: '', name: '', lastUpdated: '' }
      });
      setIsInitialized(true);
    }
  }, [profile, isInitialized, reset]);

  // Sync photoURL and resume values in form if updated in store directly
  const storePhotoURL = profile?.photoURL;
  const storeResume = profile?.resume;
  
  useEffect(() => {
    if (storePhotoURL !== undefined) {
      setValue('photoURL', storePhotoURL);
      if (typeof resetField === 'function') {
        resetField('photoURL', { defaultValue: storePhotoURL });
      }
    }
  }, [storePhotoURL, setValue, resetField]);

  useEffect(() => {
    if (storeResume !== undefined) {
      setValue('resume', storeResume);
      if (typeof resetField === 'function') {
        resetField('resume', { defaultValue: storeResume });
      }
    }
  }, [storeResume, setValue, resetField]);

  // Close toast automatically
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onSubmit = async (data) => {
    if (!user?.uid) return;
    clearError();
    
    // Map separate flat fields back into socialLinks format
    const formattedData = {
      fullName: data.fullName,
      phoneNumber: data.phoneNumber || '',
      location: data.location || '',
      dob: data.dob || '',
      gender: data.gender || '',
      headline: data.headline || '',
      aboutMe: data.aboutMe || '',
      currentRole: data.currentRole || '',
      yearsOfExperience: isNaN(Number(data.yearsOfExperience)) ? 0 : Number(data.yearsOfExperience),
      preferredJobRole: data.preferredJobRole || '',
      preferredLocation: data.preferredLocation || '',
      expectedSalary: data.expectedSalary || '',
      employmentType: data.employmentType || '',
      workPreference: data.workPreference || '',
      skills: data.skills || [],
      socialLinks: {
        linkedin: data.linkedin || '',
        github: data.github || '',
        portfolio: data.portfolio || '',
        twitter: data.twitter || ''
      }
    };

    try {
      await updateProfile(user.uid, formattedData);
      setToast({ type: 'success', message: 'Profile updated successfully!' });
      // Reset form defaultValues so isDirty becomes false
      reset(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update profile.' });
    }
  };

  // Render skeleton loading components
  if (loading && !profile) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 w-full animate-pulse flex flex-col gap-8">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="h-60 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full relative transition-colors duration-200">
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 animate-in fade-in slide-in-from-top-4
            ${toast.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-955/90 text-emerald-800 dark:text-emerald-305 border-emerald-200 dark:border-emerald-900/50' 
              : 'bg-red-50 dark:bg-red-955/90 text-red-800 dark:text-red-305 border-red-200 dark:border-red-900/50'
            }`}
          role="alert"
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4.5 w-4.5 text-emerald-505 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-4.5 w-4.5 text-red-505 dark:text-red-400" />
          )}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Main Form container */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Profile Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
              Keep your profile credentials, career targets, and resume updated for automated job matching.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              disabled={saving || !isDirty}
              className="px-5 shadow-sm cursor-pointer"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="rounded-md bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <span className="font-semibold block mb-0.5">Firebase/Firestore Error</span>
              <span>{error}</span>
            </div>
            <button 
              type="button" 
              onClick={clearError}
              className="text-red-450 hover:text-red-650 cursor-pointer bg-transparent border-none text-base"
            >
              &times;
            </button>
          </div>
        )}

        {/* Main Header banner & avatar */}
        <ProfileHeader profile={profile} uid={user?.uid} />

        {/* Details columns grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form details section */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <PersonalInfoCard register={register} errors={errors} />
            <CareerCard register={register} errors={errors} watch={watch} setValue={setValue} />
            <SkillsCard watch={watch} setValue={setValue} />
            <SocialLinksCard register={register} errors={errors} />
          </div>

          {/* Sidebar calculations & resume */}
          <div className="flex flex-col gap-8 sticky top-24">
            <ProfileCompletionCard watch={watch} />
            <ResumeCard 
              profile={profile} 
              uid={user?.uid} 
              uploadResume={uploadResume} 
              deleteResume={deleteResume} 
              onDeleteSuccess={() => setToast({ type: 'success', message: 'Resume deleted successfully.' })}
              onDeleteError={(err) => setToast({ type: 'error', message: err.message || 'Failed to delete resume.' })}
            />
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex justify-end p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
          <Button
            type="submit"
            variant="primary"
            disabled={saving || !isDirty}
            className="w-full sm:w-auto px-6 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            ) : (
              <Save className="h-4 w-4 mr-1.5" />
            )}
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </Button>
        </div>

      </form>
    </div>
  );
};
