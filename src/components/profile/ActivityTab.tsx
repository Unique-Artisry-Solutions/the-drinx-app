
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Route, Clock } from 'lucide-react';

interface Activity {
  type: 'visit' | 'favorite' | 'barCrawl';
  establishment?: { name: string; address: string };
  cocktail?: { name: string; establishment: string | { id?: string; name: string } };
  name?: string;
  date: Date;
}

interface ActivityTabProps {
  recentActivity: Activity[];
}

const ActivityTab: React.FC<ActivityTabProps> = ({ recentActivity }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex">
              <div className="mr-4">
                {activity.type === 'visit' && (
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <MapPin size={20} className="text-emerald-600" />
                  </div>
                )}
                {activity.type === 'favorite' && (
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Star size={20} className="text-amber-600" />
                  </div>
                )}
                {activity.type === 'barCrawl' && (
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Route size={20} className="text-purple-600" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    {activity.type === 'visit' && activity.establishment && (
                      <p className="font-medium">Visited {activity.establishment.name}</p>
                    )}
                    {activity.type === 'favorite' && activity.cocktail && (
                      <p className="font-medium">Added {activity.cocktail.name} to favorites</p>
                    )}
                    {activity.type === 'barCrawl' && (
                      <p className="font-medium">Joined "{activity.name}" bar crawl</p>
                    )}
                  </div>
                  <div className="text-sm text-material-on-surface-variant flex items-center">
                    <Clock size={14} className="mr-1" />
                    {activity.date.toLocaleDateString()}
                  </div>
                </div>
                <p className="text-sm text-material-on-surface-variant mt-1">
                  {activity.type === 'visit' && activity.establishment && activity.establishment.address}
                  {activity.type === 'favorite' && activity.cocktail && 
                    `${typeof activity.cocktail.establishment === 'object' ? activity.cocktail.establishment.name : activity.cocktail.establishment}`}
                  {activity.type === 'barCrawl' && 'Joined with 5 other participants'}
                </p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 text-center">
            <Button variant="outline">
              View All Activity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTab;
