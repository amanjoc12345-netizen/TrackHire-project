import React from 'react';

export const RecentActivity = ({ jobs }) => {
  // Generate activities dynamically from jobs
  const activities = jobs.slice(0, 3).map((job) => {
    const formattedDate = job.appliedDate 
      ? new Date(job.appliedDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      : 'Recently';
    return {
      text: `Logged application for ${job.company} as ${job.position}`,
      time: formattedDate
    };
  });

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-4">Recent Activity</h3>
      
      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 dark:text-slate-500 py-1 text-center">
          No activity logs to show.
        </p>
      ) : (
        <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-850">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-3 items-start relative pl-6">
              <span className="absolute left-[3px] top-[6px] h-2 w-2 rounded-full bg-slate-305 dark:bg-slate-700 ring-4 ring-white dark:ring-slate-900 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal">{activity.text}</p>
                <span className="text-[10px] text-slate-450 dark:text-slate-500 mt-1 block">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
