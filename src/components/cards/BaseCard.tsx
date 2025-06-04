
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, Flame, Trophy, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BaseCardProps {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  price?: string;
  distance?: string;
  image?: string;
  linkPath: string;
  className?: string;
  onClick?: () => void;
  
  // Reward-related props
  potentialPoints?: number;
  streakBonus?: number;
  achievementProgress?: {
    name: string;
    current: number;
    total: number;
  };
  
  // Additional content
  extraInfo?: string;
  tags?: string[];
  
  // Layout variants
  variant?: 'horizontal' | 'vertical';
  imageHeight?: string;
}

const BaseCard: React.FC<BaseCardProps> = ({
  id,
  title,
  subtitle,
  description,
  price,
  distance,
  image,
  linkPath,
  className,
  onClick,
  potentialPoints = 25,
  streakBonus,
  achievementProgress,
  extraInfo,
  tags,
  variant = 'horizontal',
  imageHeight = 'h-24 sm:h-32'
}) => {
  const { theme } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    window.scrollTo(0, 0);
  };

  const imageClasses = variant === 'horizontal' 
    ? `w-24 sm:w-32 ${imageHeight}` 
    : `h-48 w-full`;

  const cardClasses = variant === 'horizontal' 
    ? "flex rounded-xl overflow-hidden" 
    : "rounded-xl overflow-hidden";

  return (
    <Link to={linkPath} onClick={handleClick}>
      <div className={cn(
        cardClasses,
        "bg-card elevation-2 border border-border transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
        className
      )}>
        <div className={cn("bg-gray-200 overflow-hidden relative", imageClasses)}>
          {image ? (
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform-300 hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-xs text-center p-1">No Image</span>
            </div>
          )}
          
          {/* Price and Points Badges */}
          <div className="absolute top-1 right-1 flex flex-col gap-1">
            {price && (
              <div className="bg-spiritless-pink text-white px-3 py-1 rounded-full text-sm font-medium">
                {price}
              </div>
            )}
            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              +{potentialPoints}
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5 px-[11px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-medium text-left text-foreground">
              {title}
            </h3>
            {distance && (
              <span className="text-xs px-2 py-1 rounded-full flex items-center ml-2 text-muted-foreground text-left">
                <MapPin size={12} className="mr-1" /> {distance}
              </span>
            )}
          </div>
          
          <p className="text-xs mt-1 mb-3 text-left text-muted-foreground">
            {subtitle}
          </p>

          {description && (
            <p className="text-sm line-clamp-2 mb-2 text-foreground">
              {description}
            </p>
          )}

          {/* Reward Information */}
          <div className="space-y-2 mb-3">
            {streakBonus && (
              <div className="flex items-center text-xs text-orange-600">
                <Flame className="h-3 w-3 mr-1" />
                <span>+{streakBonus} streak bonus</span>
              </div>
            )}

            {achievementProgress && (
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center text-amber-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  <span>{achievementProgress.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {achievementProgress.current}/{achievementProgress.total}
                </Badge>
              </div>
            )}
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 rounded-full bg-muted text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {extraInfo && (
            <div className="mt-auto flex justify-between items-end">
              <div className="text-xs font-medium text-left text-spiritless-pink">
                {extraInfo}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BaseCard;
