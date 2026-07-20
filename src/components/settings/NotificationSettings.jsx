import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';

export const NotificationSettings = ({ uid }) => {
  const { settings, updateSettings, error } = useSettingsStore();
  const notifications = settings.notifications;

  const handleToggle = async (key, currentValue) => {
    try {
      await updateSettings(uid, 'notifications', { [key]: !currentValue });
    } catch (err) {
      console.error(err);
    }
  };

  const notificationOptions = [
    {
      key: 'emailNotifications',
      title: 'Email Notifications',
      description: 'Receive core transactional messages concerning your account updates.'
    },
    {
      key: 'resumeAnalysisComplete',
      title: 'Resume Analysis Complete',
      description: 'Receive alert messages when AI finishes parsing your resume.'
    },
    {
      key: 'weeklyTips',
      title: 'Weekly Career Tips',
      description: 'A curated newsletter of career optimization tactics.'
    },
    {
      key: 'newFeatures',
      title: 'New Features & Product Updates',
      description: 'Find out about new tools and design enhancements.'
    },
    {
      key: 'marketingEmails',
      title: 'Marketing & Promotional Emails',
      description: 'Receive personalized deals, surveys, and special notifications.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">Notification Preferences</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize how and when you receive emails and notifications.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-800 rounded-lg text-xs font-semibold">
          <ShieldAlert className="h-4 w-4" />
          <span>Error saving: {error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-202 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-850">
        {notificationOptions.map((opt) => {
          const isChecked = !!notifications[opt.key];
          return (
            <div key={opt.key} className="p-5 flex items-center justify-between gap-6 hover:bg-slate-50/20 dark:hover:bg-slate-900/50 transition-colors">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {opt.title}
                </span>
                <span className="text-2xs text-slate-500 dark:text-slate-450 block leading-normal max-w-md">
                  {opt.description}
                </span>
              </div>

              {/* Custom Switch Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() => handleToggle(opt.key, isChecked)}
                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500
                  ${isChecked ? 'bg-brand-600' : 'bg-slate-250 dark:bg-slate-800'}
                `}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out
                    ${isChecked ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
