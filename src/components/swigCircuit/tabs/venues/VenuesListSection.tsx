
import React from 'react';
import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Establishment } from '@/types/ProfileTypes';
import SwigCircuitControlWithSampleData from '@/components/swigCircuit/selection/SwigCircuitControlWithSampleData';
import SelectedVenuesList from './SelectedVenuesList';
import SampleVenuesSection from './SampleVenuesSection';
import { sampleNearbyEstablishments } from './SampleVenuesSection';

interface VenuesListSectionProps {
  isLoadingEstablishments: boolean;
  availableEstablishments: Establishment[];
  useTestData: boolean;
  setUseTestData: (value: boolean) => void;
  maxDistance: number;
  selectedEstablishments: Establishment[];
  onSaveEstablishments: (establishments: Establishment[]) => void;
}

const VenuesListSection: React.FC<VenuesListSectionProps> = ({
  isLoadingEstablishments,
  availableEstablishments,
  useTestData,
  setUseTestData,
  maxDistance,
  selectedEstablishments,
  onSaveEstablishments
}) => {
  if (isLoadingEstablishments) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading venues...</p>
      </div>
    );
  }
  
  if (availableEstablishments.length === 0 && !useTestData) {
    return (
      <SampleVenuesSection 
        maxDistance={maxDistance}
        setUseTestData={setUseTestData}
      />
    );
  }
  
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        {useTestData 
          ? `Showing ${sampleNearbyEstablishments.length} sample venues for testing.` 
          : `Found ${availableEstablishments.length} venues within ${maxDistance} miles of your location.`
        }
        Select venues to add to your Swig Circuit.
      </p>
      
      {useTestData && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center">
          <MapPin className="h-4 w-4 text-blue-500 mr-2 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            Using sample venues for demonstration purposes.
          </p>
        </div>
      )}
      
      {/* Using the sample data component for testing */}
      <SwigCircuitControlWithSampleData 
        onSaveSwigCircuit={onSaveEstablishments}
        initialSelections={selectedEstablishments}
        minEstablishments={2}
      />
      
      <SelectedVenuesList selectedEstablishments={selectedEstablishments} />
    </div>
  );
};

export default VenuesListSection;
