
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Establishment } from '@/types/ProfileTypes';
import DistanceFilter from '@/components/swigCircuit/VenueDiversity';
import LocationNotice from './venues/LocationNotice';
import VenuesListSection from './venues/VenuesListSection';
import NavigationButtons from './venues/NavigationButtons';

interface VenuesTabProps {
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  isLocating: boolean;
  userLocation: { latitude: number; longitude: number } | null;
  isLoadingEstablishments: boolean;
  availableEstablishments: Establishment[];
  selectedEstablishments: Establishment[];
  onSaveEstablishments: (establishments: Establishment[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

const VenuesTab: React.FC<VenuesTabProps> = ({
  maxDistance,
  onDistanceChange,
  isLocating,
  userLocation,
  isLoadingEstablishments,
  availableEstablishments,
  selectedEstablishments,
  onSaveEstablishments,
  onBack,
  onContinue
}) => {
  const [useTestData, setUseTestData] = useState(false);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Select Venues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLocating ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Detecting your location...</p>
          </div>
        ) : (
          <>
            <LocationNotice userLocation={userLocation} />
            
            {userLocation && (
              <>
                <DistanceFilter 
                  maxDistance={maxDistance}
                  onDistanceChange={onDistanceChange}
                />
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-3">Available Venues</h3>
                  <VenuesListSection
                    isLoadingEstablishments={isLoadingEstablishments}
                    availableEstablishments={availableEstablishments}
                    useTestData={useTestData}
                    setUseTestData={setUseTestData}
                    maxDistance={maxDistance}
                    selectedEstablishments={selectedEstablishments}
                    onSaveEstablishments={onSaveEstablishments}
                  />
                </div>
              </>
            )}
          </>
        )}
        
        <NavigationButtons 
          onBack={onBack}
          onContinue={onContinue}
          selectedEstablishments={selectedEstablishments}
        />
      </CardContent>
    </Card>
  );
};

export default VenuesTab;
