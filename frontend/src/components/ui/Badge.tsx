import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'blue' | 'green' | 'amber' | 'violet' | 'gray' | 'red' | 'cyan';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles = {
  blue:   'bg-blue-50   text-brand-blue   border-blue-200',
  green:  'bg-green-50  text-green-700    border-green-200',
  amber:  'bg-amber-50  text-amber-700    border-amber-200',
  violet: 'bg-violet-50 text-violet-700   border-violet-200',
  gray:   'bg-gray-100  text-gray-600     border-gray-200',
  red:    'bg-red-50    text-red-600      border-red-200',
  cyan:   'bg-cyan-50   text-cyan-700     border-cyan-200',
};

const dotColors = {
  blue: 'bg-brand-blue', green: 'bg-green-500', amber: 'bg-amber-500',
  violet: 'bg-violet-500', gray: 'bg-gray-400', red: 'bg-red-500', cyan: 'bg-cyan-500',
};

export function Badge({ children, variant = 'blue', size = 'md', dot, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold tracking-wide border rounded-full',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-xs',
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
