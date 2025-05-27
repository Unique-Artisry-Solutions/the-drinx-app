
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus,
  DollarSign, 
  Timer, 
  TrendingUp, 
  Calendar, 
  Target, 
  Settings,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionCard {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  status?: 'active' | 'new' | 'coming-soon';
  metrics?: string;
  actionText?: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickActionCard[] = [
    {
      title: 'Dynamic Pricing',
      description: 'Manage pricing rules and automation',
      icon: DollarSign,
      path: '/promoter/pricing',
      status: 'active',
      metrics: '5 active rules',
      actionText: 'Manage Pricing'
    },
    {
      title: 'Urgency Features',
      description: 'Countdown timers and scarcity indicators',
      icon: Timer,
      path: '/promoter/urgency',
      status: 'active',
      metrics: '3 campaigns running',
      actionText: 'Create Campaign'
    },
    {
      title: 'Real-Time Analytics',
      description: 'Live monitoring and performance tracking',
      icon: TrendingUp,
      path: '/promoter/real-time-analytics',
      status: 'new',
      metrics: '147 active visitors',
      actionText: 'View Live Data'
    },
    {
      title: 'Event Management',
      description: 'Create and manage your events',
      icon: Calendar,
      path: '/promoter/events',
      status: 'active',
      actionText: 'Create Event'
    },
    {
      title: 'Marketing Analytics',
      description: 'Track campaign performance',
      icon: Target,
      path: '/promoter/marketing-analytics',
      status: 'active',
      actionText: 'View Reports'
    },
    {
      title: 'Settings',
      description: 'Configure your account preferences',
      icon: Settings,
      path: '/promoter/settings',
      status: 'active',
      actionText: 'Configure'
    }
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">New</Badge>;
      case 'coming-soon':
        return <Badge variant="outline">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <div 
              key={action.path} 
              className="p-4 border rounded-lg hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <action.icon className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">{action.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(action.status)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
              {action.metrics && (
                <p className="text-xs font-medium text-purple-600 mb-3">{action.metrics}</p>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-purple-50 group-hover:border-purple-300"
              >
                {action.actionText || 'Open'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
