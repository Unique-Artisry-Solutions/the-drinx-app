
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, UserPlus, Calendar, BarChart, Clock } from 'lucide-react';
import { Activity } from '@/hooks/useActivitiesData';

interface RecentActivityCardProps {
  activities: Activity[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ activities }) => {
  return (
    <Card className="vibrant-card md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest customer interactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map(activity => (
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
  );
};

export default RecentActivityCard;
