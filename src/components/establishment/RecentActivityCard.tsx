
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserPlus, Calendar, BarChart, Clock } from 'lucide-react';
import { Activity } from '@/hooks/useActivitiesData';

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card className="vibrant-card w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Latest customer interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map(activity => (
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
      </CardContent>
    </Card>
  );
};

export default RecentActivityCard;
