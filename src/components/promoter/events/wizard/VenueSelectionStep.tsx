
import React, { useState } from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, AlertCircle } from 'lucide-react';
import { useEstablishments } from '@/hooks/useEstablishments';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Venue = {
  id: string;
  name: string;
  address: string;
};

const VenueSelectionStep: React.FC = () => {
  const {
    formData,
    updateFormData
  } = useEventWizard();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    establishments, 
    isLoading, 
    error,
    filterEstablishments
  } = useEstablishments({});
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    filterEstablishments(e.target.value);
  };

  const handleVenueSelect = (venue: Venue) => {
    updateFormData({
      venueId: venue.id
    });
  };

  return <Card className="shadow-md">
      <CardContent className="pt-6 my-px">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search venues..." 
              className="pl-10" 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Error loading venues: {error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Select a Venue</Label>
            {isLoading ? (
              <div className="py-4 text-center">
                <div className="w-6 h-6 border-2 border-t-purple-500 border-purple-200 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading venues...</p>
              </div>
            ) : (
              <RadioGroup 
                value={formData.venueId || ''} 
                onValueChange={value => {
                  const selectedVenue = establishments.find(v => v.id === value);
                  if (selectedVenue) {
                    handleVenueSelect({
                      id: selectedVenue.id,
                      name: selectedVenue.name,
                      address: selectedVenue.address
                    });
                  }
                }} 
                className="space-y-2"
              >
                {establishments.map(venue => (
                  <div 
                    key={venue.id} 
                    className={`flex items-start p-4 border rounded-md cursor-pointer ${
                      formData.venueId === venue.id 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem value={venue.id} id={`venue-${venue.id}`} className="mt-1" />
                    <div className="ml-3">
                      <Label htmlFor={`venue-${venue.id}`} className="font-medium cursor-pointer">
                        {venue.name}
                      </Label>
                      <p className="text-sm text-gray-500">{venue.address}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {!isLoading && establishments.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No venues found matching your search. Try different keywords.
              </p>
            )}

            {!formData.venueId && (
              <p className="text-red-500 text-sm mt-2">
                Please select a venue for your event
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>;
};

export default VenueSelectionStep;
