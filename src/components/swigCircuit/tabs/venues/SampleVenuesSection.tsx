
import React from 'react';
import { Button } from '@/components/ui/button';
import { Utensils } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';

interface SampleVenuesSectionProps {
  maxDistance: number;
  setUseTestData: (value: boolean) => void;
}

// Sample establishments for demonstration when no venues are found
export const sampleNearbyEstablishments: Establishment[] = [
  {
    id: "sample-1",
    name: "Mocktail Haven",
    address: "123 Main Street",
    distance: "0.5 miles",
    latitude: 37.7749,
    longitude: -122.4194,
    cocktailCount: 8,
    image: "https://placehold.co/200x150?text=Mocktail+Haven"
  },
  {
    id: "sample-2",
    name: "Spirit-free Lounge",
    address: "456 Oak Avenue",
    distance: "0.8 miles",
    latitude: 37.7741,
    longitude: -122.4183,
    cocktailCount: 12,
    image: "https://placehold.co/200x150?text=Spirit-free+Lounge"
  },
  {
    id: "sample-3", 
    name: "Sober Bar & Grill",
    address: "789 Market Street",
    distance: "1.2 miles",
    latitude: 37.7758,
    longitude: -122.4205,
    cocktailCount: 10,
    image: "https://placehold.co/200x150?text=Sober+Bar"
  },
  {
    id: "sample-4",
    name: "Juice Junction",
    address: "101 Pine Road",
    distance: "1.5 miles",
    latitude: 37.7731,
    longitude: -122.4173,
    cocktailCount: 15,
    image: "https://placehold.co/200x150?text=Juice+Junction"
  }
];

const SampleVenuesSection: React.FC<SampleVenuesSectionProps> = ({ 
  maxDistance, 
  setUseTestData 
}) => {
  return (
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
  );
};

export default SampleVenuesSection;
