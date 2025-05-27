
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Plus,
  Eye,
  BarChart3,
  Target,
  Route
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RealTimeDashboard from '@/components/promoter/RealTimeDashboard';

const PromoterDashboard = () => {
  const navigate = useNavigate();

  // Mock recent events data
  const recentEvents = [
    {
      id: 1,
      name: "Summer Music Festival",
      date: "2024-02-15",
      attendees: 150,
      status: "active"
    },
    {
      id: 2,
      name: "Tech Networking Night",
      date: "2024-02-22",
      attendees: 75,
      status: "upcoming"
    }
  ];

  const quickActions = [
    {
      title: "Create Event",
      description: "Set up a new promotional event",
      icon: Plus,
      action: () => navigate('/promoter/events'),
      color: "bg-blue-500"
    },
    {
      title: "Create Swig Circuit",
      description: "Design a new swig circuit experience",
      icon: Route,
      action: () => navigate('/promoter/create-swig-circuit'),
      color: "bg-spiritless-pink"
    },
    {
      title: "View Analytics", 
      description: "Check detailed performance metrics",
      icon: BarChart3,
      action: () => navigate('/promoter/analytics'),
      color: "bg-green-500"
    },
    {
      title: "Marketing Analytics",
      description: "Review campaign performance",
      icon: Target,
      action: () => navigate('/promoter/marketing-analytics'),
      color: "bg-purple-500"
    },
    {
      title: "Manage Events",
      description: "Edit existing events",
      icon: Calendar,
      action: () => navigate('/promoter/events'),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promoter Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your events and campaign performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/promoter/events')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
          <Button 
            onClick={() => navigate('/promoter/create-swig-circuit')} 
            className="flex items-center gap-2 bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            <Route className="h-4 w-4" />
            Create Swig Circuit
          </Button>
        </div>
      </div>

      {/* Real-Time Analytics Dashboard */}
      <RealTimeDashboard />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and navigation shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  onClick={action.action}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${action.color} group-hover:scale-105 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-sm">{action.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Recent Events
          </CardTitle>
          <CardDescription>
            Your latest promotional events and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Attendees</p>
                    <p className="font-semibold">{event.attendees}</p>
                  </div>
                  <Badge 
                    variant={event.status === 'active' ? 'default' : 'secondary'}
                  >
                    {event.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/promoter/events')}
            >
              View All Events
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoterDashboard;
