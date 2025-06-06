
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Crown, TrendingUp, Clock, Star, Check, Lock } from 'lucide-react';
import type { TierProgress, LoyaltyMilestone } from '@/types/gamification';

interface TierProgressionEngineProps {
  tierProgress: TierProgress;
  milestones: LoyaltyMilestone[];
  onUpgradeCheck?: () => void;
  isProcessing?: boolean;
}

const TierIcons = {
  1: '🥉',
  2: '🥈', 
  3: '🥇',
  4: '💎',
  5: '👑'
};

const TierColors = {
  1: 'from-orange-400 to-orange-600',
  2: 'from-gray-400 to-gray-600',
  3: 'from-yellow-400 to-yellow-600',
  4: 'from-purple-400 to-purple-600',
  5: 'from-pink-400 to-pink-600'
};

const RequirementItem: React.FC<{
  label: string;
  met: boolean;
  current?: number;
  required?: number;
}> = ({ label, met, current, required }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Lock className="w-4 h-4 text-muted-foreground" />
      )}
      <span className={met ? 'text-green-700' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
    {current !== undefined && required !== undefined && (
      <span className="text-sm font-mono">
        {current}/{required}
      </span>
    )}
  </div>
);

const TierCard: React.FC<{
  milestone: LoyaltyMilestone;
  isCurrent: boolean;
  isNext: boolean;
  isUnlocked: boolean;
}> = ({ milestone, isCurrent, isNext, isUnlocked }) => (
  <Card className={`relative overflow-hidden ${
    isCurrent ? 'ring-2 ring-primary' : isNext ? 'ring-2 ring-blue-300' : ''
  }`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${TierColors[milestone.tier_level as keyof typeof TierColors]} opacity-10`} />
    <CardContent className="p-4 relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{TierIcons[milestone.tier_level as keyof typeof TierIcons]}</span>
          <div>
            <h3 className="font-semibold">{milestone.milestone_name}</h3>
            <div className="flex gap-1">
              {isCurrent && <Badge variant="default">Current</Badge>}
              {isNext && <Badge variant="outline">Next</Badge>}
              {!isUnlocked && milestone.tier_level > 1 && <Badge variant="secondary">Locked</Badge>}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Tier {milestone.tier_level}</div>
          {milestone.points_threshold && (
            <div className="text-xs text-muted-foreground">{milestone.points_threshold} pts</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Rewards:</h4>
        <div className="space-y-1">
          {milestone.rewards.map((reward, index) => (
            <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
              <Star className="w-3 h-3" />
              {reward}
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const TierProgressionEngine: React.FC<TierProgressionEngineProps> = ({
  tierProgress,
  milestones,
  onUpgradeCheck,
  isProcessing = false
}) => {
  const currentMilestone = milestones.find(m => m.tier_level === tierProgress.current_tier);
  const nextMilestone = milestones.find(m => m.tier_level === tierProgress.next_tier);

  const allRequirementsMet = nextMilestone ? 
    Object.values(tierProgress.requirements_met).every(Boolean) : false;

  return (
    <div className="space-y-6">
      {/* Current Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            Tier Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {TierIcons[tierProgress.current_tier as keyof typeof TierIcons]}
              </span>
              <div>
                <h3 className="font-semibold">{tierProgress.current_tier_name}</h3>
                <p className="text-sm text-muted-foreground">Tier {tierProgress.current_tier}</p>
              </div>
            </div>
            {nextMilestone && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next:</p>
                <p className="font-medium">{tierProgress.next_tier_name}</p>
              </div>
            )}
          </div>

          {nextMilestone && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress to next tier</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(tierProgress.progress_percentage)}%
                </span>
              </div>
              <Progress value={tierProgress.progress_percentage} className="h-3" />

              {allRequirementsMet && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-medium">
                    Ready for tier upgrade!
                  </span>
                  <Button 
                    size="sm" 
                    onClick={onUpgradeCheck}
                    disabled={isProcessing}
                    className="ml-auto"
                  >
                    {isProcessing ? 'Processing...' : 'Upgrade Now'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Requirements for Next Tier */}
      {nextMilestone && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Requirements for {tierProgress.next_tier_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RequirementItem
              label="Loyalty Points"
              met={tierProgress.requirements_met.points}
              current={tierProgress.points_to_next_tier <= 0 ? nextMilestone.points_threshold : 
                (nextMilestone.points_threshold || 0) - tierProgress.points_to_next_tier}
              required={nextMilestone.points_threshold}
            />
            <RequirementItem
              label="Engagement Score"
              met={tierProgress.requirements_met.engagement}
              required={nextMilestone.engagement_threshold}
            />
            <RequirementItem
              label="Follow Duration"
              met={tierProgress.requirements_met.time}
              current={tierProgress.days_to_next_tier <= 0 ? nextMilestone.time_requirement_days :
                (nextMilestone.time_requirement_days || 0) - tierProgress.days_to_next_tier}
              required={nextMilestone.time_requirement_days}
            />
            {tierProgress.days_to_next_tier > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700">
                  {tierProgress.days_to_next_tier} days remaining
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* All Tiers Overview */}
      <Card>
        <CardHeader>
          <CardTitle>All Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {milestones.map(milestone => (
              <TierCard
                key={milestone.id}
                milestone={milestone}
                isCurrent={milestone.tier_level === tierProgress.current_tier}
                isNext={milestone.tier_level === tierProgress.next_tier}
                isUnlocked={milestone.tier_level <= tierProgress.current_tier}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierProgressionEngine;
