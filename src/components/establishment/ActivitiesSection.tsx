
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RecentActivityCard from './RecentActivityCard';
import { Activity, useActivitiesData } from '@/hooks/useActivitiesData';
import { Skeleton } from '@/components/ui/skeleton';

const ActivitiesSection: React.FC = () => {
  const { activities, isLoadingActivities } = useActivitiesData();

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

  return <RecentActivityCard activities={activities} />;
};

export default ActivitiesSection;
