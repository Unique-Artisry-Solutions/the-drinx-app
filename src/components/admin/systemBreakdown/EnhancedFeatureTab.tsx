
import React, { useState } from 'react';
import { FeatureItem } from './types';
import { FeatureDetailCard } from './shared/FeatureDetailCard';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdvancedSearch } from './hooks/useAdvancedSearch';
import { useLazyLoading } from './hooks/useLazyLoading';
import AdvancedSearchPanel from './components/AdvancedSearchPanel';
import MobileOptimizedFeatureCard from './components/MobileOptimizedFeatureCard';
import { Loader2 } from 'lucide-react';

interface EnhancedFeatureTabProps {
  features: FeatureItem[];
  title: string;
  userType: string;
}

const EnhancedFeatureTab: React.FC<EnhancedFeatureTabProps> = ({
  features,
  title,
  userType
}) => {
  const [viewMode, setViewMode] = useState<'all' | 'phases' | 'simple'>('all');
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const isMobile = useIsMobile();

  const {
    filters,
    filteredFeatures,
    updateFilter,
    clearFilters,
    activeFilterCount,
    totalResults,
    totalFeatures
  } = useAdvancedSearch(features);

  const {
    loadedFeatures,
    hasMore,
    isLoading,
    loadMore,
    loadedCount
  } = useLazyLoading(filteredFeatures, {
    pageSize: isMobile ? 10 : 20,
    initialLoad: isMobile ? 5 : 10
  });

  const handleViewDetails = (feature: FeatureItem) => {
    setSelectedFeature(feature);
  };

  const renderFeatureCard = (feature: FeatureItem) => {
    if (isMobile) {
      return (
        <MobileOptimizedFeatureCard
          key={feature.id}
          feature={feature}
          onViewDetails={handleViewDetails}
        />
      );
    }

    return (
      <FeatureDetailCard 
        key={feature.id} 
        feature={feature} 
        showPhases={viewMode === 'all' || viewMode === 'phases'}
        showDetails={viewMode === 'all'}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500">Features for {userType} users</p>
      </div>

      <AdvancedSearchPanel
        filters={filters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
        activeFilterCount={activeFilterCount}
        totalResults={totalResults}
        totalFeatures={totalFeatures}
      />

      {!isMobile && (
        <div className="flex gap-2">
          <div className="bg-white border rounded-md p-1 flex">
            <Button 
              variant={viewMode === 'all' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('all')}
              className="text-xs h-8"
            >
              Detailed View
            </Button>
            <Button 
              variant={viewMode === 'phases' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('phases')}
              className="text-xs h-8"
            >
              Phases View
            </Button>
            <Button 
              variant={viewMode === 'simple' ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode('simple')}
              className="text-xs h-8"
            >
              Simple View
            </Button>
          </div>
        </div>
      )}

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Features ({features.length})</TabsTrigger>
          <TabsTrigger value="updated">
            Updated ({features.filter(f => f.statusUpdated).length})
          </TabsTrigger>
          <TabsTrigger value="needsAttention">
            Needs Attention ({features.filter(f => f.status !== 'implemented').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
            {loadedFeatures.map(renderFeatureCard)}
            
            {loadedFeatures.length === 0 && (
              <div className={`${isMobile ? '' : 'col-span-full'} p-8 text-center border rounded-lg bg-slate-50`}>
                <p className="text-gray-500">No features match your search criteria.</p>
              </div>
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button 
                onClick={loadMore} 
                disabled={isLoading}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Load More Features ({loadedCount} of {totalResults})
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="updated" className="space-y-4">
          <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
            {loadedFeatures.filter(f => f.statusUpdated).map(renderFeatureCard)}
            
            {loadedFeatures.filter(f => f.statusUpdated).length === 0 && (
              <div className={`${isMobile ? '' : 'col-span-full'} p-8 text-center border rounded-lg bg-slate-50`}>
                <p className="text-gray-500">No recently updated features match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="needsAttention" className="space-y-4">
          <div className={isMobile ? "space-y-3" : "grid grid-cols-1 lg:grid-cols-2 gap-4"}>
            {loadedFeatures.filter(f => f.status !== 'implemented').map(renderFeatureCard)}
            
            {loadedFeatures.filter(f => f.status !== 'implemented').length === 0 && (
              <div className={`${isMobile ? '' : 'col-span-full'} p-8 text-center border rounded-lg bg-slate-50`}>
                <p className="text-gray-500">No features requiring attention match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFeatureTab;
