import React from 'react';
import { Bell } from 'lucide-react';

export const Notifications = ({ jobs }) => {
  const interviewJobs = jobs.filter(job => ['hr round', 'technical', 'assignment', 'final'].includes(job.status.toLowerCase()));
  const offerJobs = jobs.filter(job => job.status.toLowerCase() === 'offer');
  
  const notifications = [];
  
  if (interviewJobs.length > 0) {
    notifications.push({
      text: `Active interview round scheduled with ${interviewJobs[0].company}`,
      priority: 'high'
    });
  }

  if (offerJobs.length > 0) {
    notifications.push({
      text: `Congratulations! Offer received from ${offerJobs[0].company}`,
      priority: 'high'
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Notifications</h3>
        <Bell className="h-4 w-4 text-slate-400" />
      </div>
      
      {notifications.length === 0 ? (
        <p className="text-xs text-slate-405 dark:text-slate-500 py-1 text-center">
          No notifications.
        </p>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif, index) => (
            <div key={index} className="flex gap-2.5 items-start">
              <span className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                notif.priority === 'high' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">{notif.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
