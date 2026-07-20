import React from 'react';
import { Sparkles, Calendar, Trash2, ChevronRight, FileText } from 'lucide-react';

export const HistoryCard = ({ history, onSelect, onDelete }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs">
      <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-1.5">
        <Sparkles className="h-4 w-4 text-brand-600" />
        Analysis History
      </h3>

      {history.length === 0 ? (
        <div className="text-center py-6 text-slate-500 dark:text-slate-400 text-xs">
          No previous analysis records found.
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {history.map((record) => (
            <div
              key={record.id}
              onClick={() => onSelect(record)}
              className="group flex justify-between items-center p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-brand-500 hover:bg-slate-50/50 dark:hover:bg-slate-850/40 cursor-pointer transition-all duration-150"
            >
              <div className="flex items-start gap-3 min-w-0">
                <FileText className="h-5 w-5 text-slate-400 group-hover:text-brand-500 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {record.company} — {record.jobTitle}
                  </h4>
                  <p className="text-[10px] text-slate-450 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                <div className="text-right">
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 font-mono">
                    Match: {record.matchScore}%
                  </div>
                  <div className="text-[9px] text-slate-450 dark:text-slate-500">
                    ATS: {record.atsScore}%
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => onDelete(record.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                  title="Delete Analysis"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <ChevronRight className="h-4 w-4 text-slate-350 dark:text-slate-650 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
