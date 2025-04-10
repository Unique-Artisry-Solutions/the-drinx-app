
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityTabContentProps {
  recentActivity: any[];
  isPromoter?: boolean;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ 
  recentActivity,
  isPromoter = false
}) => {
  if (!recentActivity || recentActivity.length === 0) {
    return (
      <Card className={isPromoter ? "border-purple-100" : ""}>
        <CardContent className="p-5">
          <div className="text-center py-4">
            <p className="text-gray-500">No recent activity found.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className={isPromoter ? "border-purple-100" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className={`h-4 w-4 mr-2 ${isPromoter ? "text-purple-600" : "text-spiritless-pink"}`} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-2">
            {recentActivity.map((activity, index) => (
              <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      {activity.type === 'visit' && `Visited ${activity.establishment?.name}`}
                      {activity.type === 'favorite' && `Added ${activity.cocktail?.name} to favorites`}
                      {activity.type === 'barCrawl' && `Created bar crawl: ${activity.name}`}
                      {activity.type === 'badge' && `Earned badge: ${activity.name}`}
                    </p>
                    {activity.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {format(activity.date, 'MMM d, yyyy')}
                      </p>
                    )}
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

export default ActivityTabContent;
