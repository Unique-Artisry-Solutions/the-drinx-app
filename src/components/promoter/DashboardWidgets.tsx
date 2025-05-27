
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnalyticsMetricCard from '@/components/charts/AnalyticsMetricCard';
import { FollowerCountWidget } from './FollowerCountWidget';
import { 
  Eye, 
  Users, 
  DollarSign, 
  TrendingUp,
  Calendar,
  Target,
  Share2,
  Zap
} from 'lucide-react';

interface DashboardWidgetsProps {
  promoterId: string;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({ promoterId }) => {
  // Mock data - in real implementation, this would come from API calls
  const widgets = [
    {
      title: "Active Visitors",
      value: "147",
      icon: Eye,
      iconColor: "text-green-500",
      change: 12
    },
    {
      title: "Event Bookings",
      value: "23",
      icon: Calendar,
      iconColor: "text-blue-500",
      change: 8
    },
    {
      title: "Revenue Today",
      value: "$1,240",
      icon: DollarSign,
      iconColor: "text-purple-500",
      change: 15
    },
    {
      title: "Conversion Rate",
      value: "8.5%",
      icon: Target,
      iconColor: "text-orange-500",
      change: 3
    },
    {
      title: "Affiliate Performance",
      value: "156",
      icon: Share2,
      iconColor: "text-cyan-500",
      change: 22
    },
    {
      title: "Urgency Campaign Impact",
      value: "+18%",
      icon: Zap,
      iconColor: "text-yellow-500",
      change: 5
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Live Dashboard
          <Badge variant="outline" className="text-green-600">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Streamlined Follower Count Widget */}
          <FollowerCountWidget promoterId={promoterId} />
          
          {/* Other Analytics Widgets */}
          {widgets.map((widget) => (
            <AnalyticsMetricCard
              key={widget.title}
              title={widget.title}
              value={widget.value}
              icon={widget.icon}
              iconColor={widget.iconColor}
              change={widget.change}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
