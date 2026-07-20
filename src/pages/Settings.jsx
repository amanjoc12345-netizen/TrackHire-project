import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '../store/authStore';
import { useProfileStore } from '../store/profileStore';
import { useSettingsStore } from '../store/settingsStore';
import { User, Shield, Bell, Settings as SettingsIcon, Lock, Info } from 'lucide-react';

// Lazy load settings sections for performance
const AccountSettings = lazy(() => import('../components/settings/AccountSettings').then(m => ({ default: m.AccountSettings })));
const SecuritySettings = lazy(() => import('../components/settings/SecuritySettings').then(m => ({ default: m.SecuritySettings })));
const NotificationSettings = lazy(() => import('../components/settings/NotificationSettings').then(m => ({ default: m.NotificationSettings })));
const PreferenceSettings = lazy(() => import('../components/settings/PreferenceSettings').then(m => ({ default: m.PreferenceSettings })));
const PrivacySettings = lazy(() => import('../components/settings/PrivacySettings').then(m => ({ default: m.PrivacySettings })));
const AboutSettings = lazy(() => import('../components/settings/AboutSettings').then(m => ({ default: m.AboutSettings })));

const SettingsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3"></div>
    <div className="space-y-4">
      <div className="h-24 bg-slate-100 dark:bg-slate-850 rounded-xl"></div>
      <div className="h-32 bg-slate-105 dark:bg-slate-850 rounded-xl"></div>
    </div>
  </div>
);

export const Settings = () => {
  const { user } = useAuthStore();
  const { profile, fetchProfile } = useProfileStore();
  const { fetchSettings } = useSettingsStore();

  const [activeSection, setActiveSection] = useState('account');

  useEffect(() => {
    if (user?.uid) {
      fetchProfile(user.uid);
      fetchSettings(user.uid);
    }
  }, [user?.uid, fetchProfile, fetchSettings]);

  const menuItems = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'privacy', label: 'Privacy & Data', icon: Lock },
    { id: 'about', label: 'About', icon: Info }
  ];

  const renderActiveSection = () => {
    if (!user) return null;
    switch (activeSection) {
      case 'account':
        return <AccountSettings profile={profile} />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings uid={user.uid} />;
      case 'preferences':
        return <PreferenceSettings uid={user.uid} />;
      case 'privacy':
        return <PrivacySettings uid={user.uid} profile={profile} />;
      case 'about':
        return <AboutSettings />;
      default:
        return <AccountSettings profile={profile} />;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow w-full font-sans transition-colors duration-200">
      
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-855 dark:text-white flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand-600 dark:text-brand-400" />
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs sm:text-sm">
          Manage your account profile, security credentials, and app preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-start">
        
        {/* Responsive Sidebar - Vertical tabs on desktop, horizontal scroll on mobile */}
        <aside className="w-full lg:w-48 xl:w-56 flex-shrink-0">
          <nav 
            className="flex flex-row lg:flex-col gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-1 lg:p-2 bg-white dark:bg-slate-900 shadow-sm overflow-x-auto lg:overflow-x-visible"
            aria-label="Settings navigation"
          >
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 whitespace-nowrap ${
                    isActive 
                      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/20 dark:text-brand-400 shadow-sm font-semibold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Pane Wrapper */}
        <div className="flex-grow w-full bg-white dark:bg-slate-905 border border-slate-200 dark:border-slate-805 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xs">
          <Suspense fallback={<SettingsSkeleton />}>
            {renderActiveSection()}
          </Suspense>
        </div>

      </div>
    </div>
  );
};
