
import React from 'react';
import { MapPin, Star, Flame, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';

interface EstablishmentCardProps {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount: number;
  image?: string;
  className?: string;
  onClick?: () => void;
  // New reward-related props
  potentialPoints?: number;
  streakBonus?: number;
  achievementProgress?: {
    name: string;
    current: number;
    total: number;
  };
  visitContribution?: {
    weeklyGoal: number;
    monthlyGoal: number;
  };
}

const EstablishmentCard: React.FC<EstablishmentCardProps> = ({
  id,
  name,
  address,
  distance,
  cocktailCount,
  image,
  className,
  onClick,
  potentialPoints = 25,
  streakBonus,
  achievementProgress,
  visitContribution
}) => {
  const { theme } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    window.scrollTo(0, 0);
  };

  return (
    <Link to={`/establishment/${id}`} onClick={handleClick}>
      <div className={cn(
        "flex rounded-xl overflow-hidden bg-card elevation-2 border border-border transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
        className
      )}>
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 overflow-hidden relative">
          {image ? (
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform-300 hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <span className="text-muted-foreground text-xs text-center p-1">No Image</span>
            </div>
          )}
          
          {/* Points Badge */}
          <div className="absolute top-1 right-1 bg-spiritless-pink text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
            <Star className="h-3 w-3 mr-1" />
            +{potentialPoints}
          </div>
        </div>

        <div className="flex-1 p-4 sm:p-5 px-[11px]">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-medium text-left text-foreground">
              {name}
            </h3>
            {distance && (
              <span className="text-xs px-2 py-1 rounded-full flex items-center ml-2 text-muted-foreground text-left">
                <MapPin size={12} className="mr-1" /> {distance}
              </span>
            )}
          </div>
          
          <p className="text-xs mt-1 mb-3 text-left text-muted-foreground">
            {address}
          </p>

          {/* Reward Information */}
          <div className="space-y-2 mb-3">
            {/* Streak Bonus */}
            {streakBonus && (
              <div className="flex items-center text-xs text-orange-600">
                <Flame className="h-3 w-3 mr-1" />
                <span>+{streakBonus} streak bonus</span>
              </div>
            )}

            {/* Achievement Progress */}
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

            {/* Visit Contribution */}
            {visitContribution && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/30 rounded px-2 py-1">
                  <span className="text-muted-foreground">Weekly: </span>
                  <span className="font-medium">+{visitContribution.weeklyGoal}%</span>
                </div>
                <div className="bg-muted/30 rounded px-2 py-1">
                  <span className="text-muted-foreground">Monthly: </span>
                  <span className="font-medium">+{visitContribution.monthlyGoal}%</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-auto flex justify-between items-end">
            <div className="text-xs font-medium text-left text-spiritless-pink">
              {cocktailCount} {cocktailCount === 1 ? 'cocktail' : 'cocktails'} available
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EstablishmentCard;
