import React from 'react';
import { Tag, ShieldAlert, ShieldCheck } from 'lucide-react';

export const KeywordCard = ({ skillsFound, missingSkills, keywordMatch }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-2xs space-y-6">
      
      {/* Skills Found */}
      <div>
        <h4 className="text-xs font-bold text-slate-505 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" />
          Matched Skills / Keywords
        </h4>
        {skillsFound && skillsFound.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skillsFound.map((skill, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/50"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-450 italic">No matching keywords found in resume.</p>
        )}
      </div>

      {/* Missing Skills */}
      <div>
        <h4 className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldAlert className="h-4.5 w-4.5 text-amber-500" />
          Missing Skills / Technologies
        </h4>
        {missingSkills && missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <span 
                key={index}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-450 border border-amber-100 dark:border-amber-900/50"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold italic">Keyword coverage matches 100%!</p>
        )}
      </div>

      {/* Keyword Match details */}
      {keywordMatch && keywordMatch.length > 0 && (
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Tag className="h-4.5 w-4.5 text-slate-400" />
            Keyword Density Analysis
          </h4>
          <div className="space-y-2">
            {keywordMatch.map((item, index) => {
              // Handle format e.g., "React: High Match" or object
              const parts = typeof item === 'string' ? item.split(':') : [];
              const name = parts[0] || item;
              const details = parts[1] || 'Found';
              
              return (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{name}</span>
                  <span className="text-slate-500 dark:text-slate-450 font-semibold">{details}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
