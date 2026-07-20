import React from 'react';
import { Sun, Moon, Monitor, ShieldAlert } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { useTheme } from '../../hooks/useTheme';

export const PreferenceSettings = ({ uid }) => {
  const { settings, updateSettings, error } = useSettingsStore();
  const { setTheme } = useTheme();
  
  const preferences = settings.preferences;

  const handleToggle = async (key, currentValue) => {
    try {
      await updateSettings(uid, 'preferences', { [key]: !currentValue });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = async (key, value) => {
    try {
      await updateSettings(uid, 'preferences', { [key]: value });
      if (key === 'theme') {
        setTheme(value); // Synchronize local theme hook state immediately
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h3 className="text-base font-bold text-slate-855 dark:text-white">App Preferences</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize UI aesthetics, fonts, and automation rules.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-800 rounded-lg text-xs font-semibold">
          <ShieldAlert className="h-4 w-4" />
          <span>Error saving preferences: {error}</span>
        </div>
      )}

      {/* Theme Cards Selection */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
          Appearance Theme
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Monitor }
          ].map((item) => {
            const isSelected = preferences.theme === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleChange('theme', item.id)}
                className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all cursor-pointer select-none text-center shadow-3xs hover:shadow-2xs
                  ${isSelected 
                    ? 'border-brand-500 bg-brand-50/20 text-brand-700 dark:border-brand-400 dark:bg-brand-950/20 dark:text-brand-405' 
                    : 'border-slate-205 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-550 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[11px] font-bold uppercase tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Details settings dropdowns */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl p-5 space-y-4">
        
        {/* Language select */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Default Language</span>
            <span className="text-2xs text-slate-450 dark:text-slate-500 block">Language displayed inside tools.</span>
          </div>
          <select
            value={preferences.language || 'en'}
            disabled
            className="px-3 py-1.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-lg focus:outline-hidden"
          >
            <option value="en">English (US)</option>
          </select>
        </div>

        {/* Font size select */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 dark:border-slate-850 pt-4">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Default Font Size</span>
            <span className="text-2xs text-slate-450 dark:text-slate-500 block">Set default text sizes for workspace notes.</span>
          </div>
          <select
            value={preferences.fontSize || 'base'}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="px-3 py-1.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="sm">Small (12px)</option>
            <option value="base">Regular (14px)</option>
            <option value="lg">Large (16px)</option>
          </select>
        </div>

        {/* Font family select */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-slate-100 dark:border-slate-850 pt-4">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Default Font Family</span>
            <span className="text-2xs text-slate-450 dark:text-slate-500 block">Select standard typography families for workspace notes.</span>
          </div>
          <select
            value={preferences.fontFamily || 'sans'}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="px-3 py-1.5 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 cursor-pointer"
          >
            <option value="sans">Sans-Serif (Inter/Roboto)</option>
            <option value="serif">Serif (Times/Georgia)</option>
            <option value="mono">Monospace (Fira Code/Courier)</option>
          </select>
        </div>
      </div>

      {/* Boolean settings toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-805 rounded-xl divide-y divide-slate-100 dark:divide-slate-850">
        {[
          { key: 'enableAnimations', title: 'Enable Interface Animations', desc: 'Render hover movements and transition effects.' },
          { key: 'compactMode', title: 'Compact Mode View', desc: 'Saves spacing in grids and tables.' },
          { key: 'autoSaveDrafts', title: 'Auto Save Resume Drafts', desc: 'Automatically backup edits locally during design sessions.' }
        ].map((item) => {
          const isChecked = !!preferences[item.key];
          return (
            <div key={item.key} className="p-4 flex items-center justify-between gap-6">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{item.title}</span>
                <span className="text-2xs text-slate-550 dark:text-slate-500 block leading-normal">{item.desc}</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() => handleToggle(item.key, isChecked)}
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
