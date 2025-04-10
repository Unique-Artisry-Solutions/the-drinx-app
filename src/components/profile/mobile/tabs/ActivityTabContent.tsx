
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface ActivityTabContentProps {
  recentActivity: any[];
  isPromoter?: boolean;
}

const ActivityTabContent: React.FC<ActivityTabContentProps> = ({ 
  recentActivity,
  isPromoter = false
}) => {
  const emptyStateMessage = isPromoter
    ? "No recent promoter activity to display. Your promotion activities will appear here."
    : "No recent activity to display. Your activities will appear here as you explore.";

  return (
    <div className="space-y-4">
      <Card className={isPromoter ? "border-purple-100" : ""}>
        <CardHeader>
          <CardTitle className={`text-lg flex items-center gap-2 ${isPromoter ? "text-purple-800" : ""}`}>
            <Activity className={`h-5 w-5 ${isPromoter ? "text-purple-600" : ""}`} />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${isPromoter ? "border-purple-100 bg-purple-50/50" : "border-gray-100"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {activity.type === 'visit' && 'Visited Establishment'}
                      {activity.type === 'favorite' && 'Favorited Cocktail'}
                      {activity.type === 'barCrawl' && 'Started Bar Crawl'}
                      {activity.type === 'badge' && 'Earned Badge'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activity.date.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">
                    {activity.type === 'visit' && activity.establishment.name}
                    {activity.type === 'favorite' && activity.cocktail.name}
                    {activity.type === 'barCrawl' && activity.name}
                    {activity.type === 'badge' && activity.name}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">{emptyStateMessage}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityTabContent;
