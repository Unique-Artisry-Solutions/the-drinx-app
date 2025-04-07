
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DistanceFilter from '@/components/barCrawl/VenueDiversity';
import BarCrawlControl from '@/components/barCrawl/selection/BarCrawlControl';
import { Establishment } from '@/types/ProfileTypes';

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
        ) : !userLocation ? (
          <div className="text-center py-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800">
              Location services are disabled. Enable location services in your browser to see nearby venues.
            </p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            <DistanceFilter 
              maxDistance={maxDistance}
              onDistanceChange={onDistanceChange}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Available Venues</h3>
              {isLoadingEstablishments ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading venues...</p>
                </div>
              ) : availableEstablishments.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">
                    No venues found within {maxDistance} miles of your location.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try increasing the distance or selecting a different location.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Found {availableEstablishments.length} venues within {maxDistance} miles of your location.
                    Select venues to add to your Swig Circuit.
                  </p>
                  
                  <BarCrawlControl 
                    establishments={availableEstablishments}
                    onSaveBarCrawl={onSaveEstablishments}
                  />
                  
                  {selectedEstablishments.length > 0 && (
                    <div className="bg-muted/30 p-3 rounded border mt-4">
                      <h3 className="font-medium mb-2">Selected Venues ({selectedEstablishments.length})</h3>
                      <div className="space-y-2">
                        {selectedEstablishments.map((est, index) => (
                          <div key={est.id} className="bg-background p-2 rounded flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                                {index + 1}
                              </div>
                              <span className="truncate">{est.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="flex justify-between space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={onContinue}
            disabled={selectedEstablishments.length < 2}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Continue to Drink Highlights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenuesTab;
