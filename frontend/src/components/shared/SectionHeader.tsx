import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowVariant?: 'blue' | 'green' | 'amber' | 'violet' | 'gray';
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  dark?: boolean;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({
  eyebrow, eyebrowVariant = 'blue', title, description,
  align = 'center', dark, className, titleClassName,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-14',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {eyebrow && (
        <div className={cn('mb-3', align === 'center' && 'flex justify-center')}>
          <Badge variant={dark ? 'gray' : eyebrowVariant}>{eyebrow}</Badge>
        </div>
      )}
      <h2
        className={cn(
          'font-display text-3xl md:text-4xl lg:text-[44px] font-bold leading-tight mb-4',
          dark ? 'text-white' : 'text-neutral-900',
          titleClassName
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'text-base md:text-lg leading-relaxed',
            dark ? 'text-white/60' : 'text-neutral-500',
            align === 'center' && 'max-w-xl mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
