
import React from 'react';
import { Star, Flame, Trophy, Target, Gift, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AchievementProgress {
  name: string;
  current: number;
  total: number;
  points: number;
}

interface TierBenefit {
  name: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
}

interface RewardOpportunity {
  id: string;
  type: 'points' | 'streak' | 'achievement' | 'tier' | 'bonus' | 'special';
  title: string;
  description: string;
  value: number;
  isActive: boolean;
  urgency?: 'low' | 'medium' | 'high';
  expiresIn?: string;
}

interface RewardOpportunityBadgesProps {
  opportunities?: RewardOpportunity[];
  achievementProgress?: AchievementProgress[];
  tierBenefits?: TierBenefit[];
  className?: string;
  variant?: 'compact' | 'detailed';
  maxVisible?: number;
}

const RewardOpportunityBadges: React.FC<RewardOpportunityBadgesProps> = ({
  opportunities = [],
  achievementProgress = [],
  tierBenefits = [],
  className,
  variant = 'compact',
  maxVisible = 3
}) => {
  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'points':
        return <Star className="h-3 w-3" />;
      case 'streak':
        return <Flame className="h-3 w-3" />;
      case 'achievement':
        return <Trophy className="h-3 w-3" />;
      case 'tier':
        return <Target className="h-3 w-3" />;
      case 'bonus':
        return <Gift className="h-3 w-3" />;
      case 'special':
        return <Zap className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const getOpportunityColor = (type: string, urgency?: string) => {
    if (urgency === 'high') return 'bg-red-500 text-white';
    if (urgency === 'medium') return 'bg-orange-500 text-white';
    
    switch (type) {
      case 'points':
        return 'bg-blue-500 text-white';
      case 'streak':
        return 'bg-orange-500 text-white';
      case 'achievement':
        return 'bg-amber-500 text-white';
      case 'tier':
        return 'bg-purple-500 text-white';
      case 'bonus':
        return 'bg-green-500 text-white';
      case 'special':
        return 'bg-pink-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getUrgencyPulse = (urgency?: string) => {
    if (urgency === 'high') return 'animate-pulse';
    return '';
  };

  // Mock opportunities if none provided
  const defaultOpportunities: RewardOpportunity[] = [
    {
      id: '1',
      type: 'points',
      title: 'Visit Bonus',
      description: 'Double points today',
      value: 50,
      isActive: true,
      urgency: 'high',
      expiresIn: '6h'
    },
    {
      id: '2',
      type: 'streak',
      title: 'Streak Active',
      description: '3-day streak bonus',
      value: 15,
      isActive: true,
      urgency: 'medium'
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Almost There!',
      description: 'Social Explorer 8/10',
      value: 100,
      isActive: true,
      urgency: 'low'
    }
  ];

  const defaultAchievementProgress: AchievementProgress[] = [
    {
      name: 'Social Explorer',
      current: 8,
      total: 10,
      points: 100
    },
    {
      name: 'Flavor Hunter',
      current: 5,
      total: 7,
      points: 75
    }
  ];

  const defaultTierBenefits: TierBenefit[] = [
    {
      name: 'Gold Member',
      description: '1.5x points on all visits',
      pointsRequired: 2500,
      currentPoints: 1850
    }
  ];

  const activeOpportunities = opportunities.length > 0 ? opportunities : defaultOpportunities;
  const activeAchievements = achievementProgress.length > 0 ? achievementProgress : defaultAchievementProgress;
  const activeTierBenefits = tierBenefits.length > 0 ? tierBenefits : defaultTierBenefits;

  const visibleOpportunities = activeOpportunities
    .filter(opp => opp.isActive)
    .slice(0, maxVisible);

  if (variant === 'compact') {
    return (
      <div className={cn("flex flex-wrap gap-1.5", className)}>
        {visibleOpportunities.map((opportunity) => (
          <Badge
            key={opportunity.id}
            className={cn(
              "text-xs font-medium flex items-center gap-1 px-2 py-1",
              getOpportunityColor(opportunity.type, opportunity.urgency),
              getUrgencyPulse(opportunity.urgency)
            )}
          >
            {getOpportunityIcon(opportunity.type)}
            <span>+{opportunity.value}</span>
            {opportunity.expiresIn && (
              <span className="text-xs opacity-75">({opportunity.expiresIn})</span>
            )}
          </Badge>
        ))}
        
        {/* Achievement Progress Indicators */}
        {activeAchievements.slice(0, 1).map((achievement, index) => (
          <Badge
            key={`achievement-${index}`}
            variant="secondary"
            className="text-xs flex items-center gap-1 bg-amber-100 text-amber-700 border-amber-200"
          >
            <Trophy className="h-3 w-3" />
            <span>{achievement.current}/{achievement.total}</span>
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Active Opportunities */}
      {visibleOpportunities.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Active Opportunities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visibleOpportunities.map((opportunity) => (
              <div
                key={opportunity.id}
                className={cn(
                  "p-3 rounded-lg border-2 transition-all duration-200",
                  opportunity.urgency === 'high' && "border-red-200 bg-red-50",
                  opportunity.urgency === 'medium' && "border-orange-200 bg-orange-50",
                  opportunity.urgency === 'low' && "border-blue-200 bg-blue-50",
                  !opportunity.urgency && "border-gray-200 bg-gray-50",
                  getUrgencyPulse(opportunity.urgency)
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1 rounded-full",
                      getOpportunityColor(opportunity.type)
                    )}>
                      {getOpportunityIcon(opportunity.type)}
                    </div>
                    <span className="text-sm font-medium">{opportunity.title}</span>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    getOpportunityColor(opportunity.type)
                  )}>
                    +{opportunity.value}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{opportunity.description}</p>
                {opportunity.expiresIn && (
                  <p className="text-xs text-red-600 mt-1">Expires in {opportunity.expiresIn}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Progress */}
      {activeAchievements.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Achievement Progress</h4>
          <div className="space-y-2">
            {activeAchievements.slice(0, 2).map((achievement, index) => {
              const progressPercentage = (achievement.current / achievement.total) * 100;
              return (
                <div key={index} className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-amber-800">{achievement.name}</span>
                    <Badge className="text-xs bg-amber-600 text-white">
                      +{achievement.points} pts
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-amber-200 rounded-full h-2">
                      <div 
                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-amber-700">
                      {achievement.current}/{achievement.total}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tier Benefits Preview */}
      {activeTierBenefits.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Next Tier Benefits</h4>
          <div className="space-y-2">
            {activeTierBenefits.slice(0, 1).map((benefit, index) => {
              const progressPercentage = (benefit.currentPoints / benefit.pointsRequired) * 100;
              const pointsNeeded = benefit.pointsRequired - benefit.currentPoints;
              
              return (
                <div key={index} className="p-2 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-purple-800">{benefit.name}</span>
                    <Badge className="text-xs bg-purple-600 text-white">
                      {pointsNeeded} pts to go
                    </Badge>
                  </div>
                  <p className="text-xs text-purple-700 mb-2">{benefit.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-purple-700">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardOpportunityBadges;
