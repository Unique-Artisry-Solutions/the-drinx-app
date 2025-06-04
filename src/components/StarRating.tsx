import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  interactive?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  onRatingChange,
  size = 24,
  interactive = true
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };
  
  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };
  
  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <Star
          key={index}
          size={size}
          className={`${
            (hoverRating || rating) >= index
              ? 'fill-yellow-400 text-yellow-400'
              : 'text-gray-300'
          } ${interactive ? 'cursor-pointer' : ''} transition-colors`}
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        />
      ))}
    </div>
  );
};

// Keep default export for backward compatibility during transition
export default StarRating;
