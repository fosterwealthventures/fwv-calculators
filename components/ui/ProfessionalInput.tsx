'use client';
import clsx from 'clsx';
import { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function ProfessionalInput({
  label,
  error,
  helperText,
  className,
  id,
  ...rest
}: InputProps) {
  const inputId = id || useId();

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-plum-700 dark:text-plum-200"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          className={clsx(
            'block w-full rounded-xl border bg-white/80 dark:bg-plum-900/40 px-4 py-3 text-sm transition-colors',
            'text-plum-900 dark:text-white font-medium',
            'border-plum-200/70 dark:border-plum-700 placeholder:text-plum-400 dark:placeholder:text-plum-500 focus-regal',
            error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...rest}
        />

        {error && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-sm text-plum-500 dark:text-plum-400">{helperText}</p>
      )}
    </div>
  );
}