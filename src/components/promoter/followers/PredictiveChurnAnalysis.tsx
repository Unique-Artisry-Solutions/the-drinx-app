
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useChurnAnalytics } from '@/hooks/useChurnAnalytics';
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Target,
  MessageSquare,
  Gift,
  Mail,
  Phone
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';

interface PredictiveChurnAnalysisProps {
  promoterId: string;
}

const PredictiveChurnAnalysis: React.FC<PredictiveChurnAnalysisProps> = ({ promoterId }) => {
  const { churnScores, analytics, isLoading, updateChurnScores } = useChurnAnalytics(promoterId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const riskLevelColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', 
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const interventionStrategies = {
    immediate_personal_outreach: {
      icon: Phone,
      title: 'Personal Outreach',
      description: 'Direct phone call or personal message',
      urgency: 'immediate'
    },
    targeted_re_engagement_campaign: {
      icon: Mail,
      title: 'Re-engagement Campaign',
      description: 'Targeted email/message campaign',
      urgency: 'high'
    },
    personalized_content_offer: {
      icon: Gift,
      title: 'Personalized Offer',
      description: 'Customized content or discount',
      urgency: 'medium'
    },
    maintain_regular_communication: {
      icon: MessageSquare,
      title: 'Regular Communication',
      description: 'Consistent engagement schedule',
      urgency: 'low'
    }
  };

  // Risk distribution chart data
  const riskDistributionData = [
    { risk: 'Low', count: analytics.riskDistribution.low, color: '#10B981' },
    { risk: 'Medium', count: analytics.riskDistribution.medium, color: '#F59E0B' },
    { risk: 'High', count: analytics.riskDistribution.high, color: '#EF4444' },
    { risk: 'Critical', count: analytics.riskDistribution.critical, color: '#DC2626' }
  ];

  // Mock trend data for churn risk over time
  const riskTrendData = [
    { week: 'Week 1', at_risk: 12, prevented: 3 },
    { week: 'Week 2', at_risk: 15, prevented: 5 },
    { week: 'Week 3', at_risk: 18, prevented: 7 },
    { week: 'Week 4', at_risk: 14, prevented: 9 }
  ];

  const highRiskFollowers = churnScores.filter(score => 
    score.risk_level === 'high' || score.risk_level === 'critical'
  );

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">At Risk Followers</p>
                <p className="text-2xl font-bold text-red-600">{analytics.totalAtRisk}</p>
                <p className="text-xs text-red-500">
                  {Math.round((analytics.totalAtRisk / churnScores.length) * 100) || 0}% of total
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Risk Score</p>
                <p className="text-2xl font-bold">{Math.round(analytics.averageRiskScore)}</p>
                <p className="text-xs text-gray-600">Out of 100</p>
              </div>
              <TrendingDown className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Cases</p>
                <p className="text-2xl font-bold text-red-600">{analytics.riskDistribution.critical}</p>
                <p className="text-xs text-red-500">Need immediate attention</p>
              </div>
              <Target className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Analyzed</p>
                <p className="text-2xl font-bold">{churnScores.length}</p>
                <p className="text-xs text-blue-600">Followers tracked</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="risk" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8">
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Churn Prevention Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={riskTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="at_risk" 
                  stackId="1"
                  stroke="#EF4444" 
                  fill="#EF4444"
                  fillOpacity={0.6}
                  name="At Risk"
                />
                <Area 
                  type="monotone" 
                  dataKey="prevented" 
                  stackId="2"
                  stroke="#10B981" 
                  fill="#10B981"
                  fillOpacity={0.6}
                  name="Churn Prevented"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* High Risk Followers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>High Risk Followers</CardTitle>
            <Button 
              onClick={() => updateChurnScores.mutate()}
              disabled={updateChurnScores.isPending}
            >
              Refresh Analysis
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highRiskFollowers.slice(0, 10).map((follower) => {
              const strategy = interventionStrategies[follower.intervention_suggested as keyof typeof interventionStrategies];
              const Icon = strategy?.icon || MessageSquare;
              
              return (
                <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">Follower {follower.follower_id.slice(0, 8)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={riskLevelColors[follower.risk_level as keyof typeof riskLevelColors]}>
                          {follower.risk_level.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Risk Score: {Math.round(follower.risk_score)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex-1 max-w-xs">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Risk Level</span>
                        <span>{Math.round(follower.risk_score)}%</span>
                      </div>
                      <Progress 
                        value={follower.risk_score} 
                        className="h-2"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{strategy?.title}</p>
                      <p className="text-xs text-muted-foreground">{strategy?.description}</p>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      <Icon className="h-4 w-4 mr-2" />
                      Take Action
                    </Button>
                  </div>
                </div>
              );
            })}

            {highRiskFollowers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No high-risk followers identified</p>
                <p className="text-sm">Your follower retention looks healthy!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recommended Interventions */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Intervention Strategies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analytics.recommendedInterventions.map((intervention) => {
              const strategy = interventionStrategies[intervention as keyof typeof interventionStrategies];
              const Icon = strategy?.icon || MessageSquare;
              const count = churnScores.filter(s => s.intervention_suggested === intervention).length;
              
              return (
                <div key={intervention} className="flex items-center gap-3 p-4 border rounded-lg">
                  <Icon className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">{strategy?.title}</h4>
                    <p className="text-sm text-muted-foreground">{strategy?.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {count} followers
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveChurnAnalysis;
