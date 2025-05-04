
import React, { useEffect, useState } from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showToast } from '@/utils/toast/toastAdapter';

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
  const [venues, setVenues] = useState<Venue[]>([]);
  const [filteredVenues, setFilteredVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch venues (establishments) from the database
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('establishments')
          .select('id, name, address')
          .order('name');
          
        if (error) {
          console.error('Error fetching venues:', error);
          showToast(
            'Error loading venues', 
            'Unable to load venue data. Please try again later.'
          );
          return;
        }
        
        if (data) {
          // Map the establishments data to the Venue type
          const venueData = data.map(est => ({
            id: est.id,
            name: est.name,
            address: est.address
          }));
          setVenues(venueData);
          setFilteredVenues(venueData);
        }
      } catch (err) {
        console.error('Unexpected error fetching venues:', err);
        showToast(
          'Error', 
          'An unexpected error occurred while fetching venues.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Filter venues based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = venues.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVenues(filtered);
    } else {
      setFilteredVenues(venues);
    }
  }, [searchTerm, venues]);

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
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="space-y-2">
            <Label>Select a Venue</Label>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                <span className="ml-2 text-sm text-gray-500">Loading venues...</span>
              </div>
            ) : (
              <RadioGroup 
                value={formData.venueId || ''} 
                onValueChange={value => {
                  const selectedVenue = filteredVenues.find(v => v.id === value);
                  if (selectedVenue) {
                    handleVenueSelect(selectedVenue);
                  }
                }}
                className="space-y-2"
              >
                {filteredVenues.map(venue => (
                  <div key={venue.id} className={`flex items-start p-4 border rounded-md cursor-pointer ${formData.venueId === venue.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
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
            
            {!isLoading && filteredVenues.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No venues found matching your search. Try different keywords.
              </p>
            )}

            {!formData.venueId && !isLoading && (
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
