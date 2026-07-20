import React, { useRef, useState } from 'react';
import { FileText, Upload, Calendar, Download, Trash2, Loader2, AlertCircle, FileCheck } from 'lucide-react';

export const ResumeCard = ({ profile, uid, uploadResume, deleteResume, onDeleteSuccess, onDeleteError }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const currentResume = profile?.resume;
  const hasResume = currentResume && currentResume.url && currentResume.name;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5MB limit.');
      return;
    }

    // Validate extension
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      setError('Invalid file type. Only PDF and DOCX files are supported.');
      return;
    }

    setUploading(true);
    setError('');
    try {
      await uploadResume(uid, file);
    } catch (err) {
      setError(err.message || 'Failed to upload resume.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Remove your current resume?')) {
      setError('');
      try {
        await deleteResume(uid);
        if (typeof onDeleteSuccess === 'function') {
          onDeleteSuccess();
        }
      } catch (err) {
        setError(err.message || 'Failed to remove resume.');
        if (typeof onDeleteError === 'function') {
          onDeleteError(err);
        }
      }
    }
  };

  const handleDownload = () => {
    if (hasResume) {
      window.open(currentResume.url, '_blank', 'noopener,noreferrer');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs transition-colors duration-200 space-y-5">
      <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <FileText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        <h3 className="font-semibold text-slate-900 dark:text-white text-base">Resume Section</h3>
      </div>

      {hasResume ? (
        /* Document details view */
        <div className="space-y-4">
          <div className="flex items-start justify-between border border-slate-200 dark:border-slate-800 rounded-lg p-4 bg-slate-50 dark:bg-slate-950/20">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {currentResume.name}
                </p>
                {currentResume.lastUpdated && (
                  <p className="text-2xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Last updated: {new Date(currentResume.lastUpdated).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={handleDownload}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              <Download className="h-4 w-4 mr-1.5 text-slate-500" />
              Download Resume
            </button>
            
            <button
              type="button"
              onClick={triggerFileSelect}
              className="flex-1 min-w-[120px] inline-flex items-center justify-center px-4 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-750 dark:text-slate-355 rounded-md text-xs font-semibold cursor-pointer transition-colors"
            >
              <Upload className="h-4 w-4 mr-1.5 text-slate-500" />
              Replace Resume
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center p-2 border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-500 hover:text-red-650 dark:hover:text-red-400 rounded-md transition-colors cursor-pointer"
              title="Delete Resume"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload State */
        <div
          onClick={triggerFileSelect}
          className="border-2 border-dashed border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-lg p-6 text-center cursor-pointer transition-colors min-h-[140px] flex flex-col items-center justify-center bg-slate-50/20 dark:bg-slate-900/10"
        >
          <Upload className="h-8 w-8 text-slate-400 mb-2.5" />
          <p className="text-sm font-semibold text-slate-705 dark:text-slate-300">
            Upload new resume
          </p>
          <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">
            Supports PDF and DOCX files up to 5MB
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.docx"
        className="hidden"
      />

      {/* Uploading Progress Overlay */}
      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-brand-650" />
          <span>Uploading file to Storage...</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-955/20 border border-red-100 dark:border-red-900/50 p-3.5 flex items-start gap-2 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 text-red-505 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
