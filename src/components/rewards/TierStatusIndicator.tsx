
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface TierStatusIndicatorProps {
  currentTier: number;
  points: number;
}

export function TierStatusIndicator({ currentTier, points }: TierStatusIndicatorProps) {
  // Define tier thresholds
  const tierThresholds = {
    2: 500,  // Points needed for Tier 2
    3: 1000  // Points needed for Tier 3
  };

  const nextTierThreshold = currentTier < 3 ? tierThresholds[currentTier + 1 as keyof typeof tierThresholds] : null;
  const progress = nextTierThreshold ? (points / nextTierThreshold) * 100 : 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Tier Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Current Tier: {currentTier}</span>
            {nextTierThreshold && (
              <span>{points}/{nextTierThreshold} points to next tier</span>
            )}
          </div>
          <Progress value={progress} className="h-2" />
          {currentTier === 3 && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              Congratulations! You've reached the highest tier!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
