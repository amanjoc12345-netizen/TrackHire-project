import React from 'react';
import { User } from 'lucide-react';
import { Input } from '../common/Input';

export const PersonalInfoCard = ({ register, errors }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <User className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">Personal Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          required
          placeholder="John Doe"
          error={errors?.fullName?.message}
          {...register('fullName')}
        />

        {/* Email - Read-only */}
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Email Address
          </label>
          <div className="relative rounded-md shadow-xs bg-slate-50 dark:bg-slate-950">
            <input
              type="email"
              readOnly
              disabled
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-sm cursor-not-allowed bg-slate-50 dark:bg-slate-950"
              {...register('email')}
            />
          </div>
          <span className="text-2xs text-slate-400 dark:text-slate-500">Email address cannot be changed.</span>
        </div>

        {/* Phone Number */}
        <Input
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          error={errors?.phoneNumber?.message}
          {...register('phoneNumber')}
        />

        {/* Location */}
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          error={errors?.location?.message}
          {...register('location')}
        />

        {/* Date of Birth */}
        <Input
          label="Date of Birth"
          type="date"
          error={errors?.dob?.message}
          {...register('dob')}
        />

        {/* Gender */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="gender" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Gender
          </label>
          <div className="relative rounded-md shadow-xs">
            <select
              id="gender"
              className={`w-full px-3 py-2 border rounded-md text-sm transition-custom focus-ring bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
                ${errors?.gender 
                  ? 'border-red-300 dark:border-red-800 focus-visible:ring-red-500 focus-visible:border-red-500' 
                  : 'border-slate-300 dark:border-slate-700 focus-visible:ring-brand-500 focus-visible:border-brand-500'
                }
              `}
              {...register('gender')}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          {errors?.gender && (
            <span className="text-xs text-red-600 dark:text-red-400 mt-0.5">{errors.gender.message}</span>
          )}
        </div>
      </div>

      {/* Professional Headline */}
      <Input
        label="Professional Headline"
        placeholder="e.g. Senior Full Stack Engineer | React & Node.js Specialist"
        error={errors?.headline?.message}
        {...register('headline')}
      />

      {/* About Me */}
      <div className="flex flex-col gap-1.5 w-full">
        <label htmlFor="aboutMe" className="text-sm font-medium text-slate-700 dark:text-slate-300">
          About Me
        </label>
        <div className="relative rounded-md shadow-xs">
          <textarea
            id="aboutMe"
            rows="4"
            placeholder="Tell us about yourself, your goals, and what you specialize in..."
            className={`w-full px-3 py-2 border rounded-md text-sm transition-custom focus-ring bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
              ${errors?.aboutMe 
                ? 'border-red-300 dark:border-red-800 focus-visible:ring-red-500 focus-visible:border-red-500' 
                : 'border-slate-300 dark:border-slate-700 focus-visible:ring-brand-500 focus-visible:border-brand-500'
              }
            `}
            {...register('aboutMe')}
          />
        </div>
        {errors?.aboutMe && (
          <span className="text-xs text-red-600 dark:text-red-400 mt-0.5">{errors.aboutMe.message}</span>
        )}
      </div>
    </div>
  );
};
