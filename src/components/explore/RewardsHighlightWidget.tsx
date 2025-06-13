
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Star, Gift, Trophy } from 'lucide-react';

export interface RewardsHighlightWidgetProps {
  totalPoints?: number;
  currentTier?: string;
  nextTier?: string;
  progressToNextTier?: number;
}

export const RewardsHighlightWidget: React.FC<RewardsHighlightWidgetProps> = ({
  totalPoints = 1250,
  currentTier = "Silver",
  nextTier = "Gold",
  progressToNextTier = 83
}) => {
  const recentRewards = [
    { id: 1, name: "Check-in Bonus", points: 10, type: "daily" },
    { id: 2, name: "Review Reward", points: 25, type: "activity" },
    { id: 3, name: "Streak Bonus", points: 50, type: "milestone" }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          Your Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalPoints}</div>
              <div className="text-sm text-muted-foreground">Total Points</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-lg font-semibold text-amber-600">{currentTier}</div>
              <div className="text-sm text-muted-foreground">Current Tier</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Progress to {nextTier}</span>
              <span className="font-medium">{progressToNextTier}%</span>
            </div>
            <Progress value={progressToNextTier} className="h-2" />
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 text-sm">Recent Rewards</h4>
            <div className="space-y-2">
              {recentRewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                  <div className="flex items-center gap-2">
                    <Gift className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{reward.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    +{reward.points}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardsHighlightWidget;
