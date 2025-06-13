
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import SwigCircuitCard from '@/components/swigCircuit/SwigCircuitCard';
import { Route } from 'lucide-react';
import { useSwigCircuitsData } from '@/hooks/swigCircuit/useSwigCircuitsData';

const SwigCircuitsSection: React.FC = () => {
  const { filteredCircuits, isLoading } = useSwigCircuitsData();

  // Helper functions for SwigCircuitCard
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration': return 'from-blue-600 to-cyan-600';
      case 'Weekend Getaway': return 'from-purple-600 to-pink-600';
      case 'Cocktail Masters': return 'from-amber-600 to-orange-600';
      default: return 'from-green-600 to-emerald-600';
    }
  };

  const getThemeBorderColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration': return 'border-b-blue-500';
      case 'Weekend Getaway': return 'border-b-purple-500';
      case 'Cocktail Masters': return 'border-b-amber-500';
      default: return 'border-b-green-500';
    }
  };

  const getThemeImage = (theme: string) => {
    return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.2)"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>')`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500 text-white';
      case 'Moderate': return 'bg-yellow-500 text-white';
      case 'Challenging': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    return <Route className="h-3 w-3 mr-1" />;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Featured Swig Circuits</h3>
          <Skeleton className="h-9 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Featured Swig Circuits</h3>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      
      {filteredCircuits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCircuits.slice(0, 6).map(circuit => (
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
      ) : (
        <div className="text-center py-12 bg-card rounded-lg border border-dashed">
          <Route className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Swig Circuits Available</h3>
          <p className="text-muted-foreground">Check back later for new circuit experiences</p>
        </div>
      )}
    </div>
  );
};

export default SwigCircuitsSection;
