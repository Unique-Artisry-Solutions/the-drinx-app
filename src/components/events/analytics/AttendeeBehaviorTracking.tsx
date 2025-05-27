
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnalyticsPieChart from '@/components/charts/AnalyticsPieChart';
import { Clock, Mouse, Eye, Share2 } from 'lucide-react';

interface AttendeeBehaviorTrackingProps {
  eventId: string;
}

const AttendeeBehaviorTracking: React.FC<AttendeeBehaviorTrackingProps> = ({ eventId }) => {
  // Mock data for attendee behavior - in production, this would come from API
  const deviceTypeData = [
    { name: 'Mobile', value: 68, color: '#3B82F6' },
    { name: 'Desktop', value: 25, color: '#10B981' },
    { name: 'Tablet', value: 7, color: '#F59E0B' }
  ];

  const pageInteractionData = [
    { name: 'Event Details', value: 45, color: '#8B5CF6' },
    { name: 'Ticket Purchase', value: 30, color: '#EF4444' },
    { name: 'Schedule', value: 15, color: '#14B8A6' },
    { name: 'Venue Info', value: 10, color: '#F97316' }
  ];

  const behaviorMetrics = [
    {
      icon: Clock,
      label: 'Avg. Session Duration',
      value: '4m 32s',
      change: '+18%',
      positive: true
    },
    {
      icon: Mouse,
      label: 'Click-through Rate',
      value: '12.4%',
      change: '+5%',
      positive: true
    },
    {
      icon: Eye,
      label: 'Page Views per Session',
      value: '3.2',
      change: '-2%',
      positive: false
    },
    {
      icon: Share2,
      label: 'Social Shares',
      value: '156',
      change: '+34%',
      positive: true
    }
  ];

  const userJourneySteps = [
    { step: 'Event Discovery', users: 1250, dropoff: 0 },
    { step: 'Event Details View', users: 1050, dropoff: 16 },
    { step: 'Ticket Selection', users: 780, dropoff: 26 },
    { step: 'Registration Form', users: 520, dropoff: 33 },
    { step: 'Payment', users: 410, dropoff: 21 },
    { step: 'Confirmation', users: 385, dropoff: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Behavior Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {behaviorMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <metric.icon className="h-4 w-4 text-blue-500" />
                <div className="text-sm font-medium">{metric.label}</div>
              </div>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className={`text-xs mt-1 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last week
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Device and Page Interaction Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={deviceTypeData} height={300} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Page Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsPieChart data={pageInteractionData} height={300} />
          </CardContent>
        </Card>
      </div>

      {/* User Journey Flow */}
      <Card>
        <CardHeader>
          <CardTitle>User Journey Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userJourneySteps.map((step, index) => (
              <div key={step.step} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{step.step}</div>
                    <div className="text-sm text-muted-foreground">{step.users} users</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {step.dropoff > 0 && (
                    <Badge variant="outline" className="text-red-600">
                      -{step.dropoff}% dropoff
                    </Badge>
                  )}
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(step.users / userJourneySteps[0].users) * 100}%` }}
                    />
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

export default AttendeeBehaviorTracking;
