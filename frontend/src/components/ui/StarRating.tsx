'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeMap = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-6 h-6' };

export function StarRating({
  rating, maxStars = 5, size = 'md', interactive, onChange, showValue, className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayRating = hovered ?? rating;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className={cn('flex items-center gap-0.5', interactive && 'cursor-pointer')}>
        {Array.from({ length: maxStars }).map((_, i) => {
          const filled = i < Math.floor(displayRating);
          const partial = !filled && i < displayRating && displayRating % 1 >= 0.5;
          return (
            <svg
              key={i}
              className={cn(
                sizeMap[size],
                'transition-colors duration-100',
                filled ? 'text-amber-400' : partial ? 'text-amber-300' : 'text-gray-200',
                interactive && 'hover:scale-110'
              )}
              fill="currentColor"
              viewBox="0 0 24 24"
              onMouseEnter={() => interactive && setHovered(i + 1)}
              onMouseLeave={() => interactive && setHovered(null)}
              onClick={() => interactive && onChange?.(i + 1)}
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          );
        })}
      </div>
      {showValue && (
        <span className="ml-1 text-sm font-semibold text-neutral-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
