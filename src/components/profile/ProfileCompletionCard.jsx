import React from 'react';
import { Award, CheckCircle2, Circle } from 'lucide-react';

export const ProfileCompletionCard = ({ watch }) => {
  // Watch all the form fields to compute completion in real-time
  const formValues = watch();

  // Define components for calculation
  const personalFields = [
    formValues?.fullName,
    formValues?.photoURL,
    formValues?.phoneNumber,
    formValues?.location,
    formValues?.dob,
    formValues?.gender,
    formValues?.headline,
    formValues?.aboutMe
  ];

  const careerFields = [
    formValues?.currentRole,
    (formValues?.yearsOfExperience !== undefined && formValues?.yearsOfExperience !== null && formValues?.yearsOfExperience !== '') ? 'yes' : '',
    formValues?.preferredJobRole,
    formValues?.preferredLocation,
    formValues?.expectedSalary,
    formValues?.employmentType,
    formValues?.workPreference
  ];

  const skillsFields = [
    (formValues?.skills && formValues?.skills.length > 0) ? 'yes' : ''
  ];

  const socialFields = [
    formValues?.linkedin,
    formValues?.github,
    formValues?.portfolio,
    formValues?.twitter
  ];

  const resumeFields = [
    (formValues?.resume && formValues?.resume?.url) ? 'yes' : ''
  ];

  // Helper count
  const countCompleted = (arr) => arr.filter(f => f && String(f).trim() !== '').length;

  const personalDone = countCompleted(personalFields);
  const careerDone = countCompleted(careerFields);
  const skillsDone = countCompleted(skillsFields);
  const socialDone = countCompleted(socialFields);
  const resumeDone = countCompleted(resumeFields);

  const totalFields = personalFields.length + careerFields.length + skillsFields.length + socialFields.length + resumeFields.length;
  const totalDone = personalDone + careerDone + skillsDone + socialDone + resumeDone;

  const percentage = Math.round((totalDone / totalFields) * 100);

  // Group sections for display checklist
  const sections = [
    { name: 'Personal Details', done: personalDone, total: personalFields.length },
    { name: 'Career Preferences', done: careerDone, total: careerFields.length },
    { name: 'Key Skills', done: skillsDone, total: skillsFields.length },
    { name: 'Social Connections', done: socialDone, total: socialFields.length },
    { name: 'Resume Upload', done: resumeDone, total: resumeFields.length }
  ];

  // Pick color based on completion
  const getColorClass = (pct) => {
    if (pct < 35) return 'text-rose-600 dark:text-rose-455 bg-rose-50 dark:bg-rose-950/20';
    if (pct < 70) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
    return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20';
  };

  const getProgressColorClass = (pct) => {
    if (pct < 35) return 'bg-rose-500';
    if (pct < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Profile Completion</h3>
        <Award className="h-4.5 w-4.5 text-slate-400" />
      </div>

      {/* Circle percentage show */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          {/* Custom circular style representation using Tailwind SVG */}
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="6"
              className={`transition-all duration-300 ${
                percentage < 35 ? 'text-rose-500' : percentage < 70 ? 'text-amber-500' : 'text-emerald-500'
              }`}
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 * (1 - percentage / 100)}
              fill="transparent"
            />
          </svg>
          <span className="absolute text-xl font-bold text-slate-900 dark:text-white">
            {percentage}%
          </span>
        </div>
        
        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold ${getColorClass(percentage)}`}>
          {percentage === 100 
            ? 'Profile Completed' 
            : percentage >= 70 
              ? 'Almost completed' 
              : 'Add more details'
          }
        </div>
      </div>

      {/* Progress Bars and Checklist */}
      <div className="space-y-3.5">
        <p className="text-2xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Completion Breakdown
        </p>

        <div className="space-y-3">
          {sections.map((sec) => {
            const secPct = sec.total > 0 ? (sec.done / sec.total) * 100 : 0;
            const isFinished = sec.done === sec.total;
            
            return (
              <div key={sec.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-350">
                    {isFinished ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-slate-300 dark:text-slate-700 flex-shrink-0" />
                    )}
                    {sec.name}
                  </span>
                  <span className="text-slate-450 dark:text-slate-500 font-semibold">
                    {sec.done}/{sec.total}
                  </span>
                </div>
                
                {/* Visual Progress bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${getProgressColorClass(secPct)}`}
                    style={{ width: `${secPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
