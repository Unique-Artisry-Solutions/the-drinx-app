
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Bell, Clock, ListChecks, Settings } from 'lucide-react';

const AllActionsPage = () => {
  const navigate = useNavigate();
  
  // Sample data - in a real app, this would come from an API
  const actions = [
    {
      title: 'Bar Crawl Requests',
      description: '3 pending requests',
      icon: Calendar,
      color: 'text-spiritless-pink',
      bgClass: 'bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10',
      route: '/establishment/bar-crawl-requests'
    },
    {
      title: 'New Reviews',
      description: '8 unread reviews',
      icon: MessageSquare,
      color: 'text-spiritless-green',
      bgClass: 'bg-gradient-to-r from-spiritless-green/10 to-blue-400/10',
      route: '/establishment/reviews'
    },
    {
      title: 'Mocktail Updates',
      description: '2 menu items need updating',
      icon: ListChecks,
      color: 'text-blue-500',
      bgClass: 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10',
      route: '/establishment/profile'
    },
    {
      title: 'Profile Completion',
      description: 'Complete your profile details',
      icon: Settings,
      color: 'text-amber-500',
      bgClass: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
      route: '/establishment/profile'
    },
    {
      title: 'Analytics Reports',
      description: 'Weekly analytics ready to view',
      icon: Bell,
      color: 'text-purple-500',
      bgClass: 'bg-gradient-to-r from-purple-500/10 to-pink-500/10',
      route: '/establishment/analytics'
    },
    {
      title: 'Scheduled Promotions',
      description: '1 promotion scheduled this week',
      icon: Clock,
      color: 'text-emerald-500',
      bgClass: 'bg-gradient-to-r from-emerald-500/10 to-green-500/10',
      route: '/establishment/profile'
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold gradient-text">All Pending Actions</h1>
          <p className="text-material-on-surface-variant">Review and manage all pending tasks for your establishment</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {actions.map((action, index) => (
            <Card key={index} className="vibrant-card shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <action.icon className={`h-5 w-5 ${action.color}`} />
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </div>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-3 rounded-md ${action.bgClass} mb-3`}>
                  <p className="text-sm">
                    Take action on this item to keep your establishment up to date.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate(action.route)} 
                  variant="outline" 
                  className="w-full"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AllActionsPage;
