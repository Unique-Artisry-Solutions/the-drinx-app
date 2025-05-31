
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, TrendingUp, Users, DollarSign } from 'lucide-react';

export function StatisticsTabContent() {
  const metricCategories = [
    {
      icon: Users,
      category: 'User Engagement',
      description: 'Track customer participation and activity levels',
      metrics: ['Active users', 'New enrollments', 'Engagement rate', 'Session duration'],
      insights: ['Identify most engaged segments', 'Track onboarding success', 'Monitor retention']
    },
    {
      icon: DollarSign,
      category: 'Financial Impact',
      description: 'Measure revenue and cost effectiveness',
      metrics: ['Revenue per user', 'Redemption costs', 'ROI', 'Average transaction'],
      insights: ['Calculate program profitability', 'Optimize reward costs', 'Track spending patterns']
    },
    {
      icon: BarChart,
      category: 'Program Performance',
      description: 'Analyze overall program effectiveness',
      metrics: ['Points issued', 'Redemption rate', 'Tier distribution', 'Campaign success'],
      insights: ['Measure program health', 'Identify optimization opportunities', 'Track goals']
    },
    {
      icon: TrendingUp,
      category: 'Growth Trends',
      description: 'Monitor program growth and evolution',
      metrics: ['Growth rate', 'Cohort analysis', 'Seasonal patterns', 'Forecast data'],
      insights: ['Predict future performance', 'Plan capacity', 'Identify trends']
    }
  ];

  const reportTypes = [
    'Daily dashboard summary',
    'Weekly performance report',
    'Monthly business review',
    'Quarterly trend analysis',
    'Annual program assessment',
    'Custom date range reports'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics & Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Comprehensive analytics help you understand program performance, customer behavior, 
            and business impact. Use these insights to optimize your reward strategy.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Metric Categories</h3>
              <div className="space-y-4">
                {metricCategories.map((category) => (
                  <Card key={category.category}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <category.icon className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{category.category}</h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {category.description}
                          </p>
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Key Metrics:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.metrics.map((metric) => (
                                  <Badge key={metric} variant="outline" className="text-xs">
                                    {metric}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Insights:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {category.insights.map((insight) => (
                                  <Badge key={insight} variant="secondary" className="text-xs">
                                    {insight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Standard Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {reportTypes.map((report) => (
                  <Badge key={report} variant="outline" className="justify-start p-2">
                    {report}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
