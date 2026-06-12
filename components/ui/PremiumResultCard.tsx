import { TrendingUp, DollarSign, Calculator, PiggyBank } from 'lucide-react';
import clsx from 'clsx';

interface ResultCardProps {
  title: string;
  value: string | number | React.ReactNode;
  change?: string;
  icon?: 'dollar' | 'trend' | 'calc' | 'savings';
  variant?: 'default' | 'highlight';
}

export default function PremiumResultCard({
  title,
  value,
  change,
  icon = 'dollar',
  variant = 'default'
}: ResultCardProps) {
  const icons = {
    dollar: DollarSign,
    trend: TrendingUp,
    calc: Calculator,
    savings: PiggyBank
  };

  const Icon = icons[icon];

  return (
    <div className={clsx(
      'rounded-xl border p-4 transition-all duration-200',
      variant === 'highlight'
        ? 'bg-brand-50 border-brand-200'
        : 'bg-white border-slate-200 hover:shadow-sm'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'rounded-lg p-2',
            variant === 'highlight' ? 'bg-brand-100' : 'bg-brand-100'
          )}>
            <Icon className={clsx(
              'h-4 w-4',
              variant === 'highlight' ? 'text-brand-600' : 'text-brand-600'
            )} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className={clsx(
              'text-lg font-semibold',
              variant === 'highlight' ? 'text-brand-900' : 'text-slate-900'
            )}>
              {typeof value === 'number' ? `$${value.toLocaleString()}` : value}
            </p>
            {change && (
              <p className="text-xs text-slate-500">{change}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}