
import React from 'react';
import SwigCircuitCard from './SwigCircuitCard';
import { Route } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SwigCircuitsListProps {
  circuits: any[];
  isLoading: boolean;
  getThemeColor: (theme: string) => string;
  getThemeBorderColor: (theme: string) => string;
  getThemeImage: (theme: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyIcon: (difficulty: string) => React.ReactNode;
}

const SwigCircuitsList: React.FC<SwigCircuitsListProps> = ({
  circuits,
  isLoading,
  getThemeColor,
  getThemeBorderColor,
  getThemeImage,
  getDifficultyColor,
  getDifficultyIcon
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map(item => (
          <div key={item} className="animate-pulse shadow-md overflow-hidden h-64">
            <Skeleton className="h-28" />
            <div className="h-36 p-4 space-y-3">
              <Skeleton className="h-5 w-24" />
              <div className="flex space-x-1">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (circuits.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800/30 rounded-lg shadow-sm">
        <Route className="mx-auto h-12 w-12 text-gray-300 mb-2" />
        <h3 className="text-lg font-medium">No circuits found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {circuits.map(circuit => (
        <SwigCircuitCard
          key={circuit.id}
          circuit={circuit}
          getThemeColor={getThemeColor}
          getThemeBorderColor={getThemeBorderColor}
          getThemeImage={getThemeImage}
          getDifficultyColor={getDifficultyColor}
          getDifficultyIcon={getDifficultyIcon}
        />
      ))}
    </div>
  );
};

export default SwigCircuitsList;
