
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Users, Gift, TrendingUp } from 'lucide-react';

export function OverviewTabContent() {
  const features = [
    {
      icon: Star,
      title: 'Points System',
      description: 'Flexible points-based rewards with customizable earning and redemption rules',
      status: 'Active'
    },
    {
      icon: Users,
      title: 'Tier Management',
      description: 'Multi-tier customer loyalty program with automatic progression',
      status: 'Active'
    },
    {
      icon: Gift,
      title: 'Reward Catalog',
      description: 'Comprehensive reward offerings with inventory management',
      status: 'Active'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Real-time insights and performance tracking for your reward program',
      status: 'Beta'
    }
  ];

  const quickActions = [
    'Create new reward campaign',
    'View customer tier distribution',
    'Export reward analytics',
    'Configure point values',
    'Set up seasonal promotions',
    'Manage reward inventory'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Rewards System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            The Swig Rewards Administration system provides comprehensive tools for managing 
            customer loyalty programs, tracking engagement, and optimizing reward strategies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <feature.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{feature.title}</h3>
                        <Badge variant={feature.status === 'Active' ? 'default' : 'secondary'}>
                          {feature.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Badge key={action} variant="outline" className="justify-start p-2">
                  {action}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
