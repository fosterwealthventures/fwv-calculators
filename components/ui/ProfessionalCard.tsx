'use client';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium' | 'subtle';
  hover?: boolean;
}

export default function ProfessionalCard({
  children,
  className,
  variant = 'default',
  hover = true
}: CardProps) {
  const variants = {
    default: 'card-regal',
    premium: 'card-regal shadow-regalGlow',
    subtle: 'card-regal bg-white/60 dark:bg-plum-900/20'
  };

  return (
    <div
      className={clsx(
        'rounded-xl p-6 transition-all duration-200',
        hover && 'hover:-translate-y-1 hover:shadow-md',
        variants[variant],
        className
      )}
    >
      {children}
    </div>
  );
}