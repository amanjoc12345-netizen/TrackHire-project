import React from 'react';

export const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  id,
  required = false,
  helperText,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-sm font-medium text-slate-755 dark:text-slate-300 flex items-center justify-between"
        >
          <span>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </span>
        </label>
      )}
      
      <div className="relative rounded-md shadow-xs">
        <input
          ref={ref}
          type={type}
          id={inputId}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-custom focus-ring
            ${error 
              ? 'border-red-300 dark:border-red-800 text-red-900 dark:text-red-300 placeholder-red-300 focus-visible:ring-red-500 focus-visible:border-red-500 bg-red-50/10 dark:bg-red-950/10' 
              : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus-visible:ring-brand-500 focus-visible:border-brand-500 bg-white dark:bg-slate-900'
            }
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs text-red-600 dark:text-red-400 mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
        </span>
      )}

      {!error && helperText && (
        <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';
