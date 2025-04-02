
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RecentActivityCard from './RecentActivityCard';
import { Activity, useActivitiesData } from '@/hooks/useActivitiesData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ActivitiesSection: React.FC = () => {
  const { activities, isLoadingActivities } = useActivitiesData();
  const navigate = useNavigate();
  
  const handleViewAllActivities = () => {
    navigate('/establishment/activities');
  };

  if (isLoadingActivities) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 border-b border-material-outline/10 pb-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Recent Activity & Pending Actions</h2>
        <Button variant="outline" size="sm" onClick={handleViewAllActivities}>
          View All
        </Button>
      </div>
      <RecentActivityCard activities={activities} />
    </div>
  );
};

export default ActivitiesSection;
