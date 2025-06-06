
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Activity, Heart, Clock } from 'lucide-react';

interface EngagementScore {
  overall_score: number;
  activity_score: number;
  interaction_score: number;
  loyalty_score: number;
  recency_score: number;
  score_metadata?: Record<string, any>;
}

interface EngagementScoreCardProps {
  score: EngagementScore;
  showDetails?: boolean;
  className?: string;
}

const EngagementScoreCard: React.FC<EngagementScoreCardProps> = ({
  score,
  showDetails = false,
  className = ''
}) => {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-green-600';
    if (value >= 60) return 'text-blue-600';
    if (value >= 40) return 'text-yellow-600';
    if (value >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (value: number) => {
    if (value >= 80) return { label: 'Excellent', variant: 'default' as const };
    if (value >= 60) return { label: 'Good', variant: 'secondary' as const };
    if (value >= 40) return { label: 'Average', variant: 'outline' as const };
    if (value >= 20) return { label: 'Poor', variant: 'destructive' as const };
    return { label: 'Inactive', variant: 'destructive' as const };
  };

  const badge = getScoreBadge(score.overall_score);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Engagement Score
          </CardTitle>
          <Badge variant={badge.variant}>
            {badge.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${getScoreColor(score.overall_score)}`}>
            {Math.round(score.overall_score)}
          </span>
          <Progress value={score.overall_score} className="flex-1" />
        </div>
      </CardHeader>
      
      {showDetails && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{Math.round(score.activity_score)}</span>
                <Progress value={score.activity_score} className="flex-1 h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Interaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{Math.round(score.interaction_score)}</span>
                <Progress value={score.interaction_score} className="flex-1 h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Loyalty</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{Math.round(score.loyalty_score)}</span>
                <Progress value={score.loyalty_score} className="flex-1 h-2" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Recency</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{Math.round(score.recency_score)}</span>
                <Progress value={score.recency_score} className="flex-1 h-2" />
              </div>
            </div>
          </div>

          {score.score_metadata && (
            <div className="text-xs text-muted-foreground space-y-1">
              {score.score_metadata.days_since_follow && (
                <div>Following for {score.score_metadata.days_since_follow} days</div>
              )}
              {score.score_metadata.days_since_engagement && (
                <div>Last engaged {score.score_metadata.days_since_engagement} days ago</div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default EngagementScoreCard;
