
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, MapPin } from 'lucide-react';
import DistanceFilter from '@/components/barCrawl/VenueDiversity';
import BarCrawlControlWithSampleData from '@/components/barCrawl/selection/BarCrawlControlWithSampleData';
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

// Sample establishments for demonstration when no venues are found
const sampleNearbyEstablishments: Establishment[] = [
  {
    id: "sample-1",
    name: "Mocktail Haven",
    address: "123 Main Street",
    distance: "0.5 miles",
    latitude: 37.7749,
    longitude: -122.4194,
    cocktailCount: 8,
    image: "https://placehold.co/200x150?text=Mocktail+Haven",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-2",
    name: "Spirit-free Lounge",
    address: "456 Oak Avenue",
    distance: "0.8 miles",
    latitude: 37.7741,
    longitude: -122.4183,
    cocktailCount: 12,
    image: "https://placehold.co/200x150?text=Spirit-free+Lounge",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-3", 
    name: "Sober Bar & Grill",
    address: "789 Market Street",
    distance: "1.2 miles",
    latitude: 37.7758,
    longitude: -122.4205,
    cocktailCount: 10,
    image: "https://placehold.co/200x150?text=Sober+Bar",
    created_at: new Date().toISOString()
  },
  {
    id: "sample-4",
    name: "Juice Junction",
    address: "101 Pine Road",
    distance: "1.5 miles",
    latitude: 37.7731,
    longitude: -122.4173,
    cocktailCount: 15,
    image: "https://placehold.co/200x150?text=Juice+Junction",
    created_at: new Date().toISOString()
  }
];

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
              ) : availableEstablishments.length === 0 && !useTestData ? (
                <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                  <Utensils className="mx-auto h-8 w-8 text-gray-400 mb-3" />
                  <p className="text-gray-600">
                    No venues found within {maxDistance} miles of your location.
                  </p>
                  <div className="text-sm text-gray-500 mt-2 mb-4">
                    Try increasing the distance or use our sample venues for testing.
                  </div>
                  <Button 
                    onClick={() => setUseTestData(true)}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Use Sample Venues
                  </Button>
                </div>
              ) : (
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
                  <BarCrawlControlWithSampleData 
                    onSaveBarCrawl={onSaveEstablishments}
                    initialSelections={selectedEstablishments}
                    minEstablishments={2}
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
