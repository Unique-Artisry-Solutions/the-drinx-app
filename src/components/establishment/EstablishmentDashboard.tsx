
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Clock, MessageSquare, Star, TrendingUp, UserCheck, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EstablishmentDashboardProps {
  establishmentName: string;
}

const EstablishmentDashboard: React.FC<EstablishmentDashboardProps> = ({ establishmentName }) => {
  const navigate = useNavigate();
  
  // Sample data - in a real implementation, this would come from Supabase
  const stats = {
    totalVisits: 278,
    newVisitorsToday: 12,
    returningRate: 62,
    pendingBarCrawls: 3,
    reviewsThisWeek: 8,
    avgRating: 4.7,
    topMocktail: "Blue Lagoon",
    topMocktailOrders: 42
  };
  
  // Sample recent activity
  const recentActivity = [
    { id: 1, type: 'review', user: 'Sarah J.', content: 'Left a 5-star review', time: '2h ago' },
    { id: 2, type: 'visit', user: 'James W.', content: 'Checked in', time: '3h ago' },
    { id: 3, type: 'crawl', user: 'Downtown Crawl', content: 'Added your establishment', time: '5h ago' },
    { id: 4, type: 'order', user: 'Michael R.', content: 'Ordered Blue Lagoon', time: '6h ago' }
  ];

  return (
    <div className="animate-fade-in vibrant-bg p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Welcome, {establishmentName}</h1>
          <p className="text-material-on-surface-variant">Here's what's happening at your establishment</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/establishment/profile')}>
            Manage Profile
          </Button>
          <Button variant="gradient" onClick={() => navigate('/establishment/profile')}>
            Add New Mocktail
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="vibrant-card border-spiritless-pink/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <UserCheck className="mr-2 h-4 w-4 text-spiritless-pink" />
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-material-on-surface-variant mt-1">
              +{stats.newVisitorsToday} today
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card border-spiritless-green/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-spiritless-green" />
              Return Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.returningRate}%</div>
            <p className="text-xs text-material-on-surface-variant mt-1">
              of visitors return
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card border-spiritless-orange/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="mr-2 h-4 w-4 text-spiritless-orange" />
              Average Rating
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-xs text-material-on-surface-variant mt-1">
              {stats.reviewsThisWeek} new reviews this week
            </p>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card border-blue-400/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="mr-2 h-4 w-4 text-blue-400" />
              Top Mocktail
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats.topMocktail}</div>
            <p className="text-xs text-material-on-surface-variant mt-1">
              {stats.topMocktailOrders} orders this month
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions & Pending Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="vibrant-card md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-material-outline/10 pb-3">
                  <div className="rounded-full p-2 bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10">
                    {activity.type === 'review' && <Star className="h-4 w-4 text-yellow-500" />}
                    {activity.type === 'visit' && <UserPlus className="h-4 w-4 text-spiritless-green" />}
                    {activity.type === 'crawl' && <Calendar className="h-4 w-4 text-spiritless-pink" />}
                    {activity.type === 'order' && <BarChart className="h-4 w-4 text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-medium">{activity.user}</p>
                      <span className="text-xs text-material-on-surface-variant flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-material-on-surface-variant">{activity.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="vibrant-card">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
            <CardDescription>Items that need your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 rounded-md bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10 flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-spiritless-pink mr-2" />
                  <div>
                    <p className="text-sm font-medium">Bar Crawl Requests</p>
                    <p className="text-xs text-material-on-surface-variant">{stats.pendingBarCrawls} pending requests</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/establishment/profile')}>
                  Review
                </Button>
              </div>
              
              <div className="p-3 rounded-md bg-gradient-to-r from-spiritless-green/10 to-blue-400/10 flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-spiritless-green mr-2" />
                  <div>
                    <p className="text-sm font-medium">New Reviews</p>
                    <p className="text-xs text-material-on-surface-variant">{stats.reviewsThisWeek} unread reviews</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate('/establishment/profile')}>
                  View
                </Button>
              </div>
              
              <Button className="w-full" variant="outline" onClick={() => navigate('/establishment/profile')}>
                View All Actions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EstablishmentDashboard;
