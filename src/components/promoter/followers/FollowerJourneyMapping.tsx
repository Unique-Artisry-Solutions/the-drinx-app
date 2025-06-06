
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { usePromoterJourneyAnalytics } from '@/hooks/useFollowerJourney';
import { 
  ArrowRight, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare,
  Star,
  TrendingUp,
  Target,
  CheckCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  Sankey,
  ResponsiveContainer as ResponsiveContainerSankey,
  FunnelChart,
  Funnel,
  LabelList,
  Cell
} from 'recharts';

interface FollowerJourneyMappingProps {
  promoterId: string;
}

const FollowerJourneyMapping: React.FC<FollowerJourneyMappingProps> = ({ promoterId }) => {
  const { data: analytics, isLoading } = usePromoterJourneyAnalytics(promoterId);

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

  // Mock journey stages for demonstration
  const journeyStages = [
    {
      stage: 'Discovery',
      count: 1000,
      icon: Eye,
      color: 'text-blue-500',
      description: 'Initial awareness and discovery',
      conversionRate: 100
    },
    {
      stage: 'Interest',
      count: 650,
      icon: Heart,
      color: 'text-green-500',
      description: 'Showed interest in content',
      conversionRate: 65
    },
    {
      stage: 'Engagement',
      count: 420,
      icon: MessageSquare,
      color: 'text-purple-500',
      description: 'Actively engaged with content',
      conversionRate: 42
    },
    {
      stage: 'Follow',
      count: 280,
      icon: Users,
      color: 'text-orange-500',
      description: 'Became a follower',
      conversionRate: 28
    },
    {
      stage: 'Premium',
      count: 85,
      icon: Star,
      color: 'text-yellow-500',
      description: 'Upgraded to premium',
      conversionRate: 8.5
    }
  ];

  // Conversion funnel data
  const funnelData = journeyStages.map((stage, index) => ({
    name: stage.stage,
    value: stage.count,
    fill: `hsl(${index * 72}, 70%, 50%)`
  }));

  // Source breakdown
  const sourceData = Object.entries(analytics?.sourceBreakdown || {})
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([source, count]) => ({
      source: source.replace('_', ' ').toUpperCase(),
      count,
      percentage: Math.round((count / (analytics?.totalEvents || 1)) * 100)
    }));

  // Journey optimization insights
  const optimizationInsights = [
    {
      stage: 'Discovery → Interest',
      currentRate: 65,
      potential: 75,
      impact: 'high',
      suggestion: 'Improve initial content quality and targeting'
    },
    {
      stage: 'Interest → Engagement', 
      currentRate: 65,
      potential: 70,
      impact: 'medium',
      suggestion: 'Create more interactive content'
    },
    {
      stage: 'Engagement → Follow',
      currentRate: 67,
      potential: 80,
      impact: 'high',
      suggestion: 'Optimize follow prompts and value proposition'
    },
    {
      stage: 'Follow → Premium',
      currentRate: 30,
      potential: 45,
      impact: 'very high',
      suggestion: 'Enhance premium benefits showcase'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Journey Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {journeyStages.map((stage, index) => {
          const Icon = stage.icon;
          const isLast = index === journeyStages.length - 1;
          
          return (
            <div key={stage.stage} className="flex items-center">
              <Card className="flex-1">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Icon className={`h-8 w-8 ${stage.color} mx-auto mb-2`} />
                    <h3 className="font-medium text-sm">{stage.stage}</h3>
                    <p className="text-2xl font-bold">{stage.count.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {stage.conversionRate}% conversion
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {!isLast && (
                <ArrowRight className="h-6 w-6 text-gray-400 mx-2" />
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <FunnelChart>
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  <LabelList position="center" fill="#fff" stroke="none" />
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Discovery Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sourceData.map((source, index) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }} />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{source.count}</p>
                    <p className="text-xs text-muted-foreground">{source.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Stage Details */}
      <Card>
        <CardHeader>
          <CardTitle>Stage-by-Stage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {journeyStages.map((stage, index) => {
              const nextStage = journeyStages[index + 1];
              const dropOffRate = nextStage ? 
                Math.round(((stage.count - nextStage.count) / stage.count) * 100) : 0;
              
              return (
                <div key={stage.stage} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <stage.icon className={`h-6 w-6 ${stage.color}`} />
                      <h3 className="font-medium">{stage.stage}</h3>
                    </div>
                    <Badge variant="outline">{stage.count.toLocaleString()} users</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{stage.description}</p>
                  
                  {nextStage && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Conversion to {nextStage.stage}</span>
                        <span className="font-medium">
                          {Math.round((nextStage.count / stage.count) * 100)}%
                        </span>
                      </div>
                      <Progress 
                        value={(nextStage.count / stage.count) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-red-600">
                        {dropOffRate}% drop-off rate
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Optimization Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizationInsights.map((insight) => {
              const impactColors = {
                low: 'bg-gray-100 text-gray-800',
                medium: 'bg-yellow-100 text-yellow-800',
                high: 'bg-orange-100 text-orange-800',
                'very high': 'bg-red-100 text-red-800'
              };
              
              return (
                <div key={insight.stage} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{insight.stage}</h4>
                    <Badge className={impactColors[insight.impact as keyof typeof impactColors]}>
                      {insight.impact} impact
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Current Rate</span>
                      <span>{insight.currentRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Potential Rate</span>
                      <span className="text-green-600">+{insight.potential}%</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {insight.suggestion}
                  </p>
                  
                  <Button size="sm" variant="outline" className="w-full">
                    <Target className="h-4 w-4 mr-2" />
                    Implement Changes
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerJourneyMapping;
