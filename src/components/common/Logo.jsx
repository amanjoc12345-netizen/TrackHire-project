import React from 'react';

export const Logo = ({ className = "h-5 w-5" }) => {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* T top bar (white in dark, slate-900 in light) */}
      <rect x="5" y="4" width="14" height="2.5" rx="0.75" className="fill-slate-900 dark:fill-white transition-colors duration-200" />
      {/* Left vertical bar (Slate-400) */}
      <rect x="5" y="6.5" width="3" height="11.5" rx="0.75" className="fill-slate-400 dark:fill-slate-500 transition-colors duration-200" />
      {/* Middle cross bar (Blue-500) */}
      <rect x="5" y="11" width="14" height="2.5" rx="0.75" className="fill-blue-500" />
      {/* Right vertical bar (Blue-500) */}
      <rect x="16" y="6.5" width="3" height="11.5" rx="0.75" className="fill-blue-500" />
    </svg>
  );
};
