'use client';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'emerald' | 'subtle';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function ElegantButton({
  variant = 'primary',
  loading,
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';

  const variants = {
    primary: 'bg-brand-600 text-white shadow-card hover:shadow-elevated focus:ring-brand-500 hover:bg-brand-700',
    secondary: 'bg-slate-600 text-white shadow-card hover:shadow-elevated focus:ring-slate-500 hover:bg-slate-700',
    emerald: 'bg-brand-700 text-white shadow-card hover:shadow-elevated focus:ring-brand-600 hover:bg-brand-800',
    subtle: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500'
  } as const;

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...rest}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
        </svg>
      )}
      {!loading && icon}
      {children}
    </button>
  );
}