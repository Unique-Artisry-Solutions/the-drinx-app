
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface FollowerListSkeletonProps {
  count?: number;
}

export const FollowerListSkeleton: React.FC<FollowerListSkeletonProps> = ({ count = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    ))}
  </div>
);

interface FollowerAnalyticsSkeletonProps {
  detailed?: boolean;
}

export const FollowerAnalyticsSkeleton: React.FC<FollowerAnalyticsSkeletonProps> = ({ detailed = false }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-20" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
    
    {detailed && (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )}
  </div>
);

interface FollowerProgressIndicatorProps {
  progress: number;
  message: string;
}

export const FollowerProgressIndicator: React.FC<FollowerProgressIndicatorProps> = ({ 
  progress, 
  message 
}) => (
  <div className="space-y-2 p-4">
    <div className="flex justify-between text-sm">
      <span>{message}</span>
      <span>{Math.round(progress)}%</span>
    </div>
    <Progress value={progress} className="h-2" />
  </div>
);
