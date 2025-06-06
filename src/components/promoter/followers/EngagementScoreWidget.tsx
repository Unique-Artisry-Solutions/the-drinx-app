
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TrendingUp, TrendingDown, Activity, Clock, Heart, Target } from 'lucide-react';

interface EngagementScoreWidgetProps {
  followerId: string;
  score: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  scoreBreakdown?: {
    activity: number;
    interaction: number;
    loyalty: number;
    recency: number;
    conversion: number;
  };
  lastUpdated?: string;
  compact?: boolean;
  showDetails?: boolean;
}

const getTierConfig = (tier: string) => {
  switch (tier) {
    case 'platinum':
      return { color: '#E5E4E2', bgColor: 'bg-gray-200', textColor: 'text-gray-800', icon: '💎' };
    case 'gold':
      return { color: '#FFD700', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: '🥇' };
    case 'silver':
      return { color: '#C0C0C0', bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '🥈' };
    case 'bronze':
      return { color: '#CD7F32', bgColor: 'bg-orange-100', textColor: 'text-orange-700', icon: '🥉' };
    default:
      return { color: '#9CA3AF', bgColor: 'bg-gray-100', textColor: 'text-gray-700', icon: '📊' };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 75) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  if (score >= 25) return 'text-yellow-600';
  return 'text-red-600';
};

const EngagementScoreWidget: React.FC<EngagementScoreWidgetProps> = ({
  score,
  tier,
  scoreBreakdown,
  lastUpdated,
  compact = false,
  showDetails = false
}) => {
  const tierConfig = getTierConfig(tier);
  const scoreColor = getScoreColor(score);

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded text-xs font-medium ${tierConfig.bgColor} ${tierConfig.textColor}`}>
                {tierConfig.icon} {tier.toUpperCase()}
              </div>
              <div className={`font-bold ${scoreColor}`}>
                {score.toFixed(1)}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top">
            <div className="text-sm">
              <div className="font-medium">Engagement Score: {score.toFixed(1)}</div>
              <div>Tier: {tier.charAt(0).toUpperCase() + tier.slice(1)}</div>
              {lastUpdated && (
                <div className="text-xs text-muted-foreground mt-1">
                  Updated: {new Date(lastUpdated).toLocaleDateString()}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl">{tierConfig.icon}</div>
              <div>
                <div className="font-semibold">Engagement Score</div>
                <Badge className={`${tierConfig.bgColor} ${tierConfig.textColor}`}>
                  {tier.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className={`text-3xl font-bold ${scoreColor}`}>
              {score.toFixed(1)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={score} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>

          {/* Score Breakdown */}
          {showDetails && scoreBreakdown && (
            <div className="space-y-3">
              <div className="text-sm font-medium">Score Breakdown:</div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  <span>Activity: {scoreBreakdown.activity.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <span>Interaction: {scoreBreakdown.interaction.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-500" />
                  <span>Loyalty: {scoreBreakdown.loyalty.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>Recency: {scoreBreakdown.recency.toFixed(1)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-xs text-muted-foreground border-t pt-2">
              Last updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementScoreWidget;
