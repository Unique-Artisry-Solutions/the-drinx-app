
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, Flame, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CocktailCardProps {
  id: string;
  name: string;
  price: string;
  description: string;
  ingredients?: string[];
  image?: string;
  establishment: {
    id: string;
    name: string;
    distance?: string;
  } | undefined;
  className?: string;
  // New reward-related props
  potentialPoints?: number;
  streakBonus?: number;
  achievementProgress?: {
    name: string;
    current: number;
    total: number;
  };
  mocktailContribution?: {
    weeklyGoal: number;
    monthlyGoal: number;
  };
}

const CocktailCard: React.FC<CocktailCardProps> = ({
  id,
  name,
  price,
  description,
  ingredients,
  image,
  establishment,
  className,
  potentialPoints = 15,
  streakBonus,
  achievementProgress,
  mocktailContribution
}) => {
  const { theme } = useTheme();
  const isLightTheme = theme === 'light';
  
  const establishmentName = establishment?.name || 'Unknown Venue';
  const establishmentDistance = establishment?.distance;
  
  return (
    <Link to={`/cocktail/${id}`}>
      <div className={cn(
        "rounded-xl overflow-hidden elevation-2 border transition-all-300 hover:elevation-3 hover:translate-y-[-2px]",
        "bg-card border-border", 
        className
      )}>
        <div className="relative">
          <div className="h-48 w-full bg-gray-200 overflow-hidden">
            {image ? (
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover transition-transform-300 hover:scale-105" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground">No Image</span>
              </div>
            )}
          </div>
          
          {/* Price and Points Badge */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            <div className="bg-spiritless-pink text-white px-3 py-1 rounded-full text-sm font-medium">
              {price}
            </div>
            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
              +{potentialPoints}
            </div>
          </div>
        </div>

        <div className="p-4 py-[23px]">
          <h3 className="text-lg font-medium mb-1 text-foreground">
            {name}
          </h3>
          <p className="text-sm mb-3 text-muted-foreground">
            {establishmentName} {establishmentDistance && `· ${establishmentDistance}`}
          </p>

          <p className="text-sm line-clamp-2 mb-2 text-foreground">
            {description}
          </p>

          {/* Reward Information */}
          <div className="space-y-2 mb-3">
            {/* Streak Bonus */}
            {streakBonus && (
              <div className="flex items-center text-xs text-orange-600">
                <Flame className="h-3 w-3 mr-1" />
                <span>+{streakBonus} streak bonus available</span>
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

            {/* Mocktail Contribution */}
            {mocktailContribution && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted/30 rounded px-2 py-1">
                  <span className="text-muted-foreground">Weekly: </span>
                  <span className="font-medium">+{mocktailContribution.weeklyGoal}%</span>
                </div>
                <div className="bg-muted/30 rounded px-2 py-1">
                  <span className="text-muted-foreground">Monthly: </span>
                  <span className="font-medium">+{mocktailContribution.monthlyGoal}%</span>
                </div>
              </div>
            )}
          </div>

          {ingredients && ingredients.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {ingredients.map((ingredient, index) => (
                  <span 
                    key={index} 
                    className={cn(
                      "text-xs px-2 py-1 rounded-full",
                      isLightTheme 
                        ? "bg-muted text-foreground" 
                        : "bg-muted text-foreground"
                    )}
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CocktailCard;
