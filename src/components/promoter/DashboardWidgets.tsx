
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Timer, 
  Calendar,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardWidgetsProps {
  promoterId: string;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ promoterId }) => {
  const navigate = useNavigate();

  // Mock real-time data - in real implementation, this would come from hooks
  const realTimeData = {
    activeVisitors: 147,
    liveEvents: 3,
    todayRevenue: 2840,
    urgentCampaigns: 2,
    conversionRate: 8.5
  };

  const recentActivity = [
    {
      id: 1,
      type: 'sale',
      message: 'New ticket purchase for Summer Vibes Event',
      time: '2 minutes ago',
      amount: '$45'
    },
    {
      id: 2,
      type: 'campaign',
      message: 'Urgency campaign "Last Chance" started',
      time: '15 minutes ago'
    },
    {
      id: 3,
      type: 'visitor',
      message: '23 new visitors on pricing page',
      time: '30 minutes ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Real-Time Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Live Visitors</span>
              <Badge variant="outline" className="text-green-600 ml-auto">Live</Badge>
            </div>
            <div className="text-2xl font-bold">{realTimeData.activeVisitors}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/promoter/real-time-analytics')}
            >
              View details <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Live Events</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.liveEvents}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/promoter/events')}
            >
              Manage events <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Today's Revenue</span>
            </div>
            <div className="text-2xl font-bold">${realTimeData.todayRevenue.toLocaleString()}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/promoter/analytics')}
            >
              View analytics <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Urgent Campaigns</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.urgentCampaigns}</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/promoter/urgency')}
            >
              Manage urgency <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium">Conversion Rate</span>
            </div>
            <div className="text-2xl font-bold">{realTimeData.conversionRate}%</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-2 p-0 h-auto text-sm text-muted-foreground hover:text-primary"
              onClick={() => navigate('/promoter/marketing-analytics')}
            >
              View marketing <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            <Badge variant="outline" className="text-xs">Live</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border/40 last:border-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.message}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    {activity.amount && (
                      <span className="text-sm font-medium text-green-600">{activity.amount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
