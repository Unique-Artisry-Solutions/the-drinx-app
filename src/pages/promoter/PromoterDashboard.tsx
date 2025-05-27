
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Calendar, 
  Users, 
  Target, 
  DollarSign, 
  Timer, 
  TrendingUp, 
  Settings,
  ArrowRight,
  Plus
} from 'lucide-react';

interface QuickActionCard {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  status?: 'active' | 'new' | 'coming-soon';
  metrics?: string;
}

const PromoterDashboard = () => {
  const navigate = useNavigate();

  // Mock overview metrics
  const overviewMetrics = {
    totalEvents: 12,
    activeEvents: 5,
    totalTicketsSold: 1247,
    totalRevenue: 28540,
    conversionRate: 12.3
  };

  const quickActions: QuickActionCard[] = [
    {
      title: 'Dynamic Pricing',
      description: 'Manage pricing rules and automation',
      icon: DollarSign,
      path: '/promoter/pricing',
      status: 'active',
      metrics: '5 active rules'
    },
    {
      title: 'Urgency Features',
      description: 'Countdown timers and scarcity indicators',
      icon: Timer,
      path: '/promoter/urgency',
      status: 'active',
      metrics: '3 campaigns running'
    },
    {
      title: 'Real-Time Analytics',
      description: 'Live monitoring and performance tracking',
      icon: TrendingUp,
      path: '/promoter/real-time-analytics',
      status: 'new',
      metrics: '147 active visitors'
    },
    {
      title: 'Event Management',
      description: 'Create and manage your events',
      icon: Calendar,
      path: '/promoter/events',
      status: 'active',
      metrics: `${overviewMetrics.activeEvents} active events`
    },
    {
      title: 'Marketing Analytics',
      description: 'Track campaign performance',
      icon: Target,
      path: '/promoter/marketing-analytics',
      status: 'active',
      metrics: `${overviewMetrics.conversionRate}% conversion rate`
    },
    {
      title: 'Settings',
      description: 'Configure your account preferences',
      icon: Settings,
      path: '/promoter/settings',
      status: 'active'
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
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Promoter Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and promotional campaigns</p>
        </div>
        <Button onClick={() => navigate('/promoter/events')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Event
        </Button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Total Events</div>
            </div>
            <div className="text-2xl font-bold mt-1">{overviewMetrics.totalEvents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Active Events</div>
            </div>
            <div className="text-2xl font-bold mt-1">{overviewMetrics.activeEvents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Tickets Sold</div>
            </div>
            <div className="text-2xl font-bold mt-1">{overviewMetrics.totalTicketsSold}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Total Revenue</div>
            </div>
            <div className="text-2xl font-bold mt-1">${overviewMetrics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-cyan-500" />
              <div className="text-sm font-medium">Conversion Rate</div>
            </div>
            <div className="text-2xl font-bold mt-1">{overviewMetrics.conversionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Card 
              key={action.path} 
              className="cursor-pointer hover:shadow-md transition-all duration-200 group"
              onClick={() => navigate(action.path)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <action.icon className="h-5 w-5 text-purple-600" />
                    {action.title}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(action.status)}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{action.description}</p>
                {action.metrics && (
                  <p className="text-sm font-medium text-purple-600">{action.metrics}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Recent activity and notifications will appear here
            </p>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoterDashboard;
