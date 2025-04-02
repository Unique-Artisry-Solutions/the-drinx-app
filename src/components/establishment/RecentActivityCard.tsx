
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserPlus, Calendar, BarChart, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { Activity } from '@/hooks/useActivitiesData';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  const navigate = useNavigate();
  
  // Separate activities that require action
  const actionableActivities = activities.filter(activity => activity.requires_action);
  const regularActivities = activities.filter(activity => !activity.requires_action);

  const handleActionClick = (url: string) => {
    navigate(url);
  };

  return (
    <Card className="vibrant-card w-full">
      <CardContent className="pt-6">
        {actionableActivities.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
              Pending Actions
            </h3>
            <div className="space-y-4 mb-6">
              {actionableActivities.map(activity => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-4 border-b border-orange-200 pb-4 bg-orange-50/50 p-3 rounded-md"
                >
                  <div className="rounded-full p-3 bg-orange-100">
                    {activity.type === 'review' && <Star className="h-5 w-5 text-yellow-500" />}
                    {activity.type === 'visit' && <UserPlus className="h-5 w-5 text-spiritless-green" />}
                    {activity.type === 'crawl' && <Calendar className="h-5 w-5 text-spiritless-pink" />}
                    {activity.type === 'order' && <BarChart className="h-5 w-5 text-blue-400" />}
                    {activity.type === 'action' && <AlertCircle className="h-5 w-5 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{activity.user}</p>
                        <Badge variant="outline" className="bg-orange-100 text-orange-800 mb-1">Requires action</Badge>
                      </div>
                      <span className="text-sm text-material-on-surface-variant flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-md text-material-on-surface-variant mt-1">{activity.content}</p>
                    {activity.action_url && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => handleActionClick(activity.action_url!)}
                      >
                        Take Action
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
          <div className="space-y-5">
            {regularActivities.map(activity => (
              <div key={activity.id} className="flex items-start gap-4 border-b border-material-outline/10 pb-4">
                <div className="rounded-full p-3 bg-gradient-to-r from-spiritless-pink/10 to-spiritless-orange/10">
                  {activity.type === 'review' && <Star className="h-5 w-5 text-yellow-500" />}
                  {activity.type === 'visit' && <UserPlus className="h-5 w-5 text-spiritless-green" />}
                  {activity.type === 'crawl' && <Calendar className="h-5 w-5 text-spiritless-pink" />}
                  {activity.type === 'order' && <BarChart className="h-5 w-5 text-blue-400" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-lg">{activity.user}</p>
                    <span className="text-sm text-material-on-surface-variant flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-md text-material-on-surface-variant mt-1">{activity.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
