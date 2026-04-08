
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { MapPin, Star, Route, Award } from 'lucide-react';

interface ActivityTabProps {
  recentActivity: any[];
  isPromoter?: boolean;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ 
  recentActivity,
  isPromoter = false
}) => {
  const accentColor = isPromoter ? "text-purple-600" : "text-spiritless-pink";
  const borderColor = isPromoter ? "border-purple-200" : "border-gray-200";

  if (!recentActivity || recentActivity.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No recent activity found.</p>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <MapPin className={`h-4 w-4 ${accentColor}`} />;
      case 'favorite':
        return <Star className={`h-4 w-4 ${accentColor}`} />;
      case 'swigCircuit':
        return <Route className={`h-4 w-4 ${accentColor}`} />;
      case 'badge':
        return <Award className={`h-4 w-4 ${accentColor}`} />;
      default:
        return null;
    }
  };

  return (
    <Card className={`border-${borderColor}`}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {recentActivity.map((activity, index) => (
          <div key={index} className="flex items-start space-x-4 pb-4 last:pb-0 border-b last:border-0 border-gray-100">
            <div className="p-2 rounded-full bg-gray-100">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">
                {activity.type === 'visit' && `Visited ${activity.establishment?.name}`}
                {activity.type === 'favorite' && `Added ${activity.cocktail?.name} to favorites`}
                {activity.type === 'swigCircuit' && `Created bar crawl: ${activity.name}`}
                {activity.type === 'badge' && `Earned badge: ${activity.name}`}
              </p>
              {activity.date && (
                <p className="text-sm text-gray-500">
                  {format(activity.date, 'PPP')}
                </p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
