
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface CardSkeletonProps {
  hasHeader?: boolean;
  hasFooter?: boolean;
  hasImage?: boolean;
  imageHeight?: string | number;
  className?: string;
}

/**
 * Skeleton loader for card components
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({
  hasHeader = true,
  hasFooter = false,
  hasImage = false,
  imageHeight = 180,
  className = ''
}) => {
  return (
    <Card className={className}>
      {hasImage && (
        <Skeleton className="rounded-t-lg" style={{ height: imageHeight }} />
      )}
      
      {hasHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
      )}
      
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </CardContent>
      
      {hasFooter && (
        <CardFooter>
          <Skeleton className="h-9 w-24" />
        </CardFooter>
      )}
    </Card>
  );
};

export default CardSkeleton;
