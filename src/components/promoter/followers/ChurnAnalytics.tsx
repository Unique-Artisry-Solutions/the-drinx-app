
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useChurnAnalytics } from '@/hooks/useChurnAnalytics';
import { AlertTriangle, Users, TrendingDown, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ChurnAnalyticsProps {
  promoterId: string;
}

const ChurnAnalytics: React.FC<ChurnAnalyticsProps> = ({ promoterId }) => {
  const { analytics, churnScores, isLoading, updateChurnScores } = useChurnAnalytics(promoterId);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Churn Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading analytics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Followers at Risk</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAtRisk}</div>
            <p className="text-xs text-muted-foreground">
              Medium to critical risk
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageRiskScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              Out of 100
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{churnScores.length}</div>
            <p className="text-xs text-muted-foreground">
              Being monitored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Risk Distribution</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateChurnScores.mutate()}
            disabled={updateChurnScores.isPending}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${updateChurnScores.isPending ? 'animate-spin' : ''}`} />
            Update Analysis
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analytics.riskDistribution).map(([level, count]) => (
              <div key={level} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getRiskColor(level)}`}></div>
                  <span className="capitalize font-medium">{level} Risk</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{count} followers</span>
                  <Badge variant={getRiskVariant(level) as any}>
                    {churnScores.length > 0 ? Math.round((count / churnScores.length) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* High Risk Followers */}
      {churnScores.filter(score => score.risk_level === 'critical' || score.risk_level === 'high').length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>High Risk Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {churnScores
                .filter(score => score.risk_level === 'critical' || score.risk_level === 'high')
                .slice(0, 5)
                .map((score) => (
                  <div key={score.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        Follower {score.follower_id.slice(0, 8)}...
                      </span>
                      <Badge variant={getRiskVariant(score.risk_level) as any}>
                        {score.risk_level.toUpperCase()}
                      </Badge>
                    </div>
                    <Progress value={score.risk_score} className="mb-2" />
                    <div className="text-sm text-muted-foreground">
                      Risk Score: {score.risk_score.toFixed(1)}/100
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Suggested: {score.intervention_suggested.replace(/_/g, ' ')}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Interventions */}
      {analytics.recommendedInterventions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.recommendedInterventions.map((intervention, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2">
                  {intervention.replace(/_/g, ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ChurnAnalytics;
