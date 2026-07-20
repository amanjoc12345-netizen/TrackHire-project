import React, { useState, useEffect } from 'react';
import { Save, FolderOpen, Trash2, X } from 'lucide-react';
import { Button } from '../common/Button';

const SAVED_JDS_KEY = 'trackhire_saved_jds';

export const JobDescriptionInput = ({ value, onChange, company, position, onDetailsChange }) => {
  const [savedJds, setSavedJds] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(SAVED_JDS_KEY);
    if (cached) {
      setSavedJds(JSON.parse(cached));
    }
  }, []);

  const handleSaveJd = () => {
    if (!value.trim()) return;
    const title = position || saveTitle || 'Saved Job Description';
    const comp = company || 'Unknown Company';
    
    const newJd = {
      id: `jd-${Date.now()}`,
      title: `${comp} - ${title}`,
      text: value
    };

    const updated = [newJd, ...savedJds];
    localStorage.setItem(SAVED_JDS_KEY, JSON.stringify(updated));
    setSavedJds(updated);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteJd = (e, id) => {
    e.stopPropagation();
    const updated = savedJds.filter(jd => jd.id !== id);
    localStorage.setItem(SAVED_JDS_KEY, JSON.stringify(updated));
    setSavedJds(updated);
  };

  const handleSelectJd = (text) => {
    onChange(text);
    setShowSavedList(false);
  };

  return (
    <div className="w-full flex flex-col gap-2 relative">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Job Description *
        </label>
        
        {savedJds.length > 0 && (
          <button
            type="button"
            onClick={() => setShowSavedList(!showSavedList)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
          >
            <FolderOpen className="h-3.5 w-3.5" />
            Load Saved JD ({savedJds.length})
          </button>
        )}
      </div>

      {/* Saved JDs Dropdown list modal */}
      {showSavedList && (
        <div className="absolute right-0 top-7 w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-30 p-4 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Saved Job Descriptions
            </h4>
            <button 
              type="button" 
              onClick={() => setShowSavedList(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-250 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {savedJds.map(jd => (
              <div 
                key={jd.id}
                onClick={() => handleSelectJd(jd.text)}
                className="flex items-center justify-between p-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-850/60 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
              >
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">
                  {jd.title}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDeleteJd(e, jd.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Text Area */}
      <textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-brand-500 transition-colors resize-none placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="Paste the target job description requirements here..."
      />

      {/* Actions */}
      <div className="flex justify-between items-center mt-1">
        <div className="flex gap-2 flex-wrap max-w-full">
          <input
            type="text"
            placeholder="Company Name (Optional)"
            value={company}
            onChange={(e) => onDetailsChange('company', e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 focus:outline-hidden"
          />
          <input
            type="text"
            placeholder="Role / Title (Optional)"
            value={position}
            onChange={(e) => onDetailsChange('position', e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-800 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-450 focus:outline-hidden"
          />
        </div>

        {value.trim() && (
          <button
            type="button"
            onClick={handleSaveJd}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors duration-200 ${
              saveSuccess
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400'
            }`}
            disabled={saveSuccess}
          >
            <Save className="h-4 w-4" />
            {saveSuccess ? 'Saved' : 'Save description'}
          </button>
        )}
      </div>
    </div>
  );
};
