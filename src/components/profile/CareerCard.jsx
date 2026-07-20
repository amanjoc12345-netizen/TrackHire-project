import React from 'react';
import { Briefcase } from 'lucide-react';
import { Input } from '../common/Input';

export const CareerCard = ({ register, errors, watch, setValue }) => {
  // Watch the workPreference field to apply active button styles
  const currentWorkPreference = watch('workPreference');

  const workPreferences = [
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'Onsite', value: 'Onsite' }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <Briefcase className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">Career Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Role */}
        <Input
          label="Current Role"
          placeholder="e.g. Senior Frontend Engineer"
          error={errors?.currentRole?.message}
          {...register('currentRole')}
        />

        {/* Years of Experience */}
        <Input
          label="Years of Experience"
          type="number"
          min="0"
          max="80"
          placeholder="e.g. 5"
          error={errors?.yearsOfExperience?.message}
          {...register('yearsOfExperience', { valueAsNumber: true })}
        />

        {/* Preferred Job Role */}
        <Input
          label="Preferred Job Role"
          placeholder="e.g. Engineering Lead or Senior React Developer"
          error={errors?.preferredJobRole?.message}
          {...register('preferredJobRole')}
        />

        {/* Preferred Location */}
        <Input
          label="Preferred Location"
          placeholder="e.g. New York, NY (or Remote)"
          error={errors?.preferredLocation?.message}
          {...register('preferredLocation')}
        />

        {/* Expected Salary */}
        <Input
          label="Expected Salary"
          placeholder="e.g. $130,000 - $150,000 / year"
          error={errors?.expectedSalary?.message}
          {...register('expectedSalary')}
        />

        {/* Employment Type */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="employmentType" className="text-sm font-medium text-slate-705 dark:text-slate-350">
            Employment Type
          </label>
          <div className="relative rounded-md shadow-xs">
            <select
              id="employmentType"
              className={`w-full px-3 py-2 border rounded-md text-sm transition-custom focus-ring bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100
                ${errors?.employmentType 
                  ? 'border-red-300 dark:border-red-800 focus-visible:ring-red-500 focus-visible:border-red-500' 
                  : 'border-slate-300 dark:border-slate-700 focus-visible:ring-brand-500 focus-visible:border-brand-500'
                }
              `}
              {...register('employmentType')}
            >
              <option value="">Select Employment Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
              <option value="Temporary">Temporary</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
          {errors?.employmentType && (
            <span className="text-xs text-red-650 dark:text-red-400 mt-0.5">{errors.employmentType.message}</span>
          )}
        </div>
      </div>

      {/* Work Preference */}
      <div className="flex flex-col gap-2.5">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Work Preference
        </label>
        
        <div className="grid grid-cols-3 gap-3">
          {workPreferences.map((option) => {
            const isSelected = currentWorkPreference === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('workPreference', option.value, { shouldDirty: true })}
                className={`py-2 px-4 rounded-md text-sm font-medium border text-center transition-custom cursor-pointer focus-ring
                  ${isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/20 text-brand-700 dark:text-brand-400 border-brand-500 dark:border-brand-700 shadow-2xs font-semibold'
                    : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }
                `}
                aria-pressed={isSelected}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        
        {/* Hidden Input to register the field with React Hook Form */}
        <input type="hidden" {...register('workPreference')} />
        
        {errors?.workPreference && (
          <span className="text-xs text-red-650 dark:text-red-400 mt-0.5">{errors.workPreference.message}</span>
        )}
      </div>
    </div>
  );
};
