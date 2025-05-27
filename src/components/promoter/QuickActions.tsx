
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Route, 
  Users, 
  Target,
  BarChart3,
  Settings
} from 'lucide-react';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create Event",
      description: "Set up a new event",
      icon: Calendar,
      action: () => navigate('/promoter/events'),
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Create Swig Circuit",
      description: "Design a new circuit",
      icon: Route,
      action: () => navigate('/promoter/create-swig-circuit'),
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Manage Followers",
      description: "View and engage followers",
      icon: Users,
      action: () => navigate('/promoter/dashboard?tab=followers'),
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Analytics",
      description: "Check performance metrics",
      icon: BarChart3,
      action: () => navigate('/promoter/analytics'),
      color: "bg-cyan-500 hover:bg-cyan-600"
    },
    {
      title: "Marketing",
      description: "Launch campaigns",
      icon: Target,
      action: () => navigate('/promoter/marketing-analytics'),
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "Settings",
      description: "Configure preferences",
      icon: Settings,
      action: () => navigate('/promoter/settings'),
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 text-left"
              onClick={action.action}
            >
              <div className={`p-2 rounded-lg ${action.color} text-white`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-semibold">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
