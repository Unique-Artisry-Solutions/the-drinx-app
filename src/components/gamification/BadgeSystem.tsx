
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Star, Users, Activity, Heart, Trophy } from 'lucide-react';
import type { Badge as BadgeType, BadgeProgress } from '@/types/gamification';

interface BadgeSystemProps {
  badges: BadgeType[];
  badgeProgress: BadgeProgress[];
  earnedBadges: BadgeType[];
  onBadgeClick?: (badge: BadgeType) => void;
}

const CategoryIcons = {
  engagement: Activity,
  social: Users,
  loyalty: Heart,
  activity: Star,
  special: Award,
  milestone: Trophy
};

const RarityColors = {
  common: 'bg-gray-100 border-gray-300 text-gray-700',
  uncommon: 'bg-green-100 border-green-300 text-green-700',
  rare: 'bg-blue-100 border-blue-300 text-blue-700',
  epic: 'bg-purple-100 border-purple-300 text-purple-700',
  legendary: 'bg-yellow-100 border-yellow-300 text-yellow-700'
};

const BadgeCard: React.FC<{ 
  badge: BadgeType; 
  progress?: BadgeProgress; 
  earned?: boolean;
  onClick?: () => void;
}> = ({ badge, progress, earned = false, onClick }) => {
  const IconComponent = CategoryIcons[badge.category];
  const progressPercentage = progress?.progress_percentage || 0;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card 
            className={`cursor-pointer transition-all hover:scale-105 ${
              earned ? 'ring-2 ring-green-500' : 'opacity-75'
            } ${RarityColors[badge.rarity]}`}
            onClick={onClick}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl" style={{ color: badge.color_code }}>
                  {badge.icon || <IconComponent className="w-8 h-8" />}
                </div>
                <h3 className="font-semibold text-sm text-center">{badge.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {badge.rarity}
                </Badge>
                {!earned && progress && (
                  <div className="w-full space-y-1">
                    <Progress value={progressPercentage} className="h-2" />
                    <div className="text-xs text-center text-muted-foreground">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                )}
                {earned && (
                  <div className="text-green-600 text-xs font-medium">
                    ✓ Earned
                  </div>
                )}
                <div className="text-xs text-center text-muted-foreground">
                  +{badge.points_reward} points
                </div>
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <div className="max-w-xs">
            <p className="font-medium">{badge.name}</p>
            <p className="text-sm">{badge.description}</p>
            {progress && !earned && (
              <div className="mt-2 text-xs">
                <p>Progress: {Math.round(progressPercentage)}%</p>
                {Object.entries(progress.current_progress).map(([key, value]) => (
                  <p key={key}>{key}: {value}</p>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const BadgeSystem: React.FC<BadgeSystemProps> = ({ 
  badges, 
  badgeProgress, 
  earnedBadges,
  onBadgeClick 
}) => {
  const earnedBadgeIds = new Set(earnedBadges.map(b => b.id));
  const categories = Array.from(new Set(badges.map(b => b.category)));

  const getBadgesForCategory = (category: string) => {
    return badges.filter(b => b.category === category);
  };

  const getProgressForBadge = (badgeId: string) => {
    return badgeProgress.find(p => p.badge.id === badgeId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Badge Collection
          <Badge variant="secondary">
            {earnedBadges.length}/{badges.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="earned">Earned</TabsTrigger>
            {categories.map(category => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  progress={getProgressForBadge(badge.id)}
                  earned={earnedBadgeIds.has(badge.id)}
                  onClick={() => onBadgeClick?.(badge)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="earned" className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {earnedBadges.map(badge => (
                <BadgeCard
                  key={badge.id}
                  badge={badge}
                  earned={true}
                  onClick={() => onBadgeClick?.(badge)}
                />
              ))}
            </div>
            {earnedBadges.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No badges earned yet. Start engaging to earn your first badge!
              </div>
            )}
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getBadgesForCategory(category).map(badge => (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    progress={getProgressForBadge(badge.id)}
                    earned={earnedBadgeIds.has(badge.id)}
                    onClick={() => onBadgeClick?.(badge)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BadgeSystem;
