
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Route, Award } from 'lucide-react';

interface ActivityTabProps {
  recentActivity: any[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ recentActivity }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <MapPin className="h-5 w-5 text-emerald-500" />;
      case 'favorite':
        return <Star className="h-5 w-5 text-amber-500" />;
      case 'barCrawl':
        return <Route className="h-5 w-5 text-purple-500" />;
      case 'badge':
        return <Award className="h-5 w-5 text-blue-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case 'visit':
        return `You visited ${activity.establishment.name}`;
      case 'favorite':
        return `You added ${activity.cocktail.name} to your favorites`;
      case 'barCrawl':
        return `You participated in the "${activity.name}" bar crawl`;
      case 'badge':
        return `You earned the "${activity.name}" badge`;
      default:
        return 'Activity';
    }
  };
  
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-gray-100 p-2 rounded-full">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{getActivityDescription(activity)}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(activity.date)}</p>
                  
                  {activity.type === 'visit' && (
                    <div className="mt-1">
                      <Link 
                        to={`/establishment/${activity.establishment.id}`} 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Establishment
                      </Link>
                    </div>
                  )}
                  
                  {activity.type === 'favorite' && (
                    <div className="mt-1">
                      <Link 
                        to={`/cocktail/${activity.cocktail.id}`} 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Cocktail
                      </Link>
                    </div>
                  )}
                  
                  {activity.type === 'barCrawl' && (
                    <div className="mt-1">
                      <Link 
                        to="/profile/bar-crawls" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Bar Crawls
                      </Link>
                    </div>
                  )}
                  
                  {activity.type === 'badge' && (
                    <div className="mt-1">
                      <Link 
                        to="/profile/rewards" 
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View Badges
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
