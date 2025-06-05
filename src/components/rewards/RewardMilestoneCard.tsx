
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Star, Award, Trophy } from 'lucide-react';
import { Achievement, RewardTier } from '@/lib/rewards/types';

interface RewardMilestoneCardProps {
  type: 'next-tier' | 'achievement';
  tier?: RewardTier | null;
  achievement?: Achievement;
  currentPoints?: number;
  pointsRequired?: number;
}

export const RewardMilestoneCard: React.FC<RewardMilestoneCardProps> = ({
  type,
  tier,
  achievement,
  currentPoints = 0,
  pointsRequired = 0
}) => {
  const getProgress = () => {
    if (type === 'next-tier' && pointsRequired > 0) {
      return Math.min(Math.round((currentPoints / pointsRequired) * 100), 100);
    } else if (type === 'achievement' && achievement) {
      return Math.min(Math.round((achievement.progress / achievement.threshold) * 100), 100);
    }
    return 0;
  };
  
  const getPointsToGo = () => {
    if (type === 'next-tier') {
      return Math.max(0, pointsRequired - currentPoints);
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          {type === 'next-tier' ? (
            <>
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>Next Tier Progress</span>
            </>
          ) : (
            <>
              <Award className="h-4 w-4 text-amber-500" />
              <span>Achievement Progress</span>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium">
                {type === 'next-tier' && tier ? (
                  `${tier.name}`
                ) : (
                  achievement?.name
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {getProgress()}%
              </div>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </div>
          
          <div className="text-sm">
            {type === 'next-tier' ? (
              <p className="text-muted-foreground">
                {getPointsToGo() > 0 ? (
                  <>
                    <span className="font-medium text-foreground">{getPointsToGo()}</span> points to go
                  </>
                ) : (
                  <span className="text-green-600 font-medium">Ready to Claim!</span>
                )}
              </p>
            ) : (
              <p className="text-muted-foreground">
                {achievement?.progress} / {achievement?.threshold} progress
              </p>
            )}
          </div>
          
          <div className="border-t pt-3 flex items-center justify-between">
            <div>
              {type === 'next-tier' && tier ? (
                <div className="flex items-center gap-1.5">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">+{tier.benefits?.length || 'New'} benefits</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">+{achievement?.pointsReward || 0} points reward</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={type === 'next-tier' ? getPointsToGo() > 0 : achievement?.isCompleted}
            >
              {type === 'next-tier' ? (
                getPointsToGo() > 0 ? 'View Benefits' : 'Claim'
              ) : (
                achievement?.isCompleted ? 'Claimed' : 'View Details'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
