import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'white' | 'danger';
  size?:    'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:   'bg-brand-blue text-white shadow-brand hover:bg-brand-blue-dark hover:-translate-y-0.5 hover:shadow-lg',
  secondary: 'bg-white text-neutral-800 border border-neutral-200 hover:bg-neutral-50 hover:-translate-y-0.5 shadow-sm hover:shadow-card',
  ghost:     'bg-transparent text-brand-blue hover:bg-blue-50',
  outline:   'bg-transparent text-brand-blue border-2 border-brand-blue hover:bg-blue-50',
  white:     'bg-white text-brand-blue hover:bg-blue-50 shadow-lg hover:shadow-xl',
  danger:    'bg-red-500 text-white hover:bg-red-600 shadow-sm',
};

const sizeStyles = {
  sm:   'px-4 py-2 text-sm gap-1.5 rounded-lg',
  md:   'px-5 py-2.5 text-sm gap-2 rounded-xl',
  lg:   'px-7 py-3.5 text-base gap-2.5 rounded-xl',
  icon: 'p-2.5 rounded-xl',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold',
          'transition-all duration-200 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          'select-none cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Memproses...</span>
          </>
        ) : children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
