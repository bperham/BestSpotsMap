'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface StarRatingProps {
  rating: number;
  totalRatings?: number;
  size?: number;
  className?: string;
  isInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  totalRatings,
  size = 16,
  className,
  isInteractive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleStarClick = (newRating: number) => {
    if (isInteractive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleStarHover = (hoveredRating: number) => {
    if (isInteractive) {
      setHoverRating(hoveredRating);
    }
  };

  const fullStars = Math.floor(hoverRating ?? rating);
  const hasHalfStar = (hoverRating ?? rating) - fullStars >= 0.5;

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex" onMouseLeave={() => setHoverRating(null)}>
        {[...Array(5)].map((_, i) => {
          const starValue = i + 1;
          const isFull = starValue <= fullStars;
          const isHalf = starValue === fullStars + 1 && hasHalfStar;
          
          let starFillClass = 'fill-transparent';
          if (hoverRating !== null) {
            if (starValue <= hoverRating) {
                starFillClass = 'fill-current';
            }
          } else {
             if (isFull) {
                starFillClass = 'fill-current';
             } else if (isHalf) {
                // This would be for partial fills, but we are using full stars for simplicity
             }
          }
          
          return (
            <div
              key={i}
              className={cn(isInteractive ? 'cursor-pointer' : '')}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
            >
              <Star
                style={{ width: size, height: size }}
                className={cn('text-yellow-400', starFillClass, 'transition-colors')}
              />
            </div>
          );
        })}
      </div>
      {totalRatings !== undefined && (
        <span
          className="text-xs text-muted-foreground ml-1"
          style={{ fontSize: size * 0.75 }}
        >
          ({totalRatings})
        </span>
      )}
    </div>
  );
}
