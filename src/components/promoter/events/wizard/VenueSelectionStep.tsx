import React, { useEffect, useState } from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Search } from 'lucide-react';
type Venue = {
  id: string;
  name: string;
  address: string;
};

// Mock data - would be replaced with actual API calls
const mockVenues: Venue[] = [{
  id: '1',
  name: 'The Purple Lounge',
  address: '123 Main St, City'
}, {
  id: '2',
  name: 'Skybar',
  address: '456 Park Ave, City'
}, {
  id: '3',
  name: 'Ocean View',
  address: '789 Beach Rd, Coast City'
}, {
  id: '4',
  name: 'The Rooftop',
  address: '101 High St, Downtown'
}];
const VenueSelectionStep: React.FC = () => {
  const {
    formData,
    updateFormData
  } = useEventWizard();
  const [searchTerm, setSearchTerm] = useState('');
  const [venues, setVenues] = useState<Venue[]>(mockVenues);
  useEffect(() => {
    if (searchTerm) {
      const filtered = mockVenues.filter(venue => venue.name.toLowerCase().includes(searchTerm.toLowerCase()) || venue.address.toLowerCase().includes(searchTerm.toLowerCase()));
      setVenues(filtered);
    } else {
      setVenues(mockVenues);
    }
  }, [searchTerm]);
  const handleVenueSelect = (venue: Venue) => {
    updateFormData({
      venue: venue.name,
      venueId: venue.id
    });
  };
  return <Card className="shadow-md">
      <CardContent className="pt-6 my-px">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search venues..." className="pl-10" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Select a Venue</Label>
            <RadioGroup value={formData.venueId || ''} onValueChange={value => {
            const selectedVenue = venues.find(v => v.id === value);
            if (selectedVenue) {
              handleVenueSelect(selectedVenue);
            }
          }} className="space-y-2">
              {venues.map(venue => <div key={venue.id} className={`flex items-start p-4 border rounded-md cursor-pointer ${formData.venueId === venue.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                  <RadioGroupItem value={venue.id} id={`venue-${venue.id}`} className="mt-1" />
                  <div className="ml-3">
                    <Label htmlFor={`venue-${venue.id}`} className="font-medium cursor-pointer">
                      {venue.name}
                    </Label>
                    <p className="text-sm text-gray-500">{venue.address}</p>
                  </div>
                </div>)}
            </RadioGroup>
            
            {venues.length === 0 && <p className="text-center py-4 text-gray-500">
                No venues found matching your search. Try different keywords.
              </p>}

            {!formData.venueId && <p className="text-red-500 text-sm mt-2">
                Please select a venue for your event
              </p>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default VenueSelectionStep;