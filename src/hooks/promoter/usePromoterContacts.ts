
import { useState, useEffect } from 'react';
import { VenueContact } from './types';

export const usePromoterContacts = () => {
  const [contacts, setContacts] = useState<VenueContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from API/database
    // For now, we're using mock data
    const mockContacts: VenueContact[] = [
      {
        id: 'contact1',
        name: 'Alex Johnson',
        role: 'Event Manager',
        venueId: 'venue1',
        venueName: 'Downtown Club'
      },
      {
        id: 'contact2',
        name: 'Jamie Smith',
        role: 'Operations Director',
        venueId: 'venue2',
        venueName: 'Skyline Lounge'
      },
      {
        id: 'contact3',
        name: 'Taylor Wilson',
        role: 'Venue Owner',
        venueId: 'venue3',
        venueName: 'Harbor View'
      },
      {
        id: 'contact4',
        name: 'Morgan Lee',
        role: 'Events Coordinator',
        venueId: 'venue4',
        venueName: 'The Grand Hall'
      },
      {
        id: 'contact5',
        name: 'Casey Rodriguez',
        role: 'Marketing Manager',
        venueId: 'venue5',
        venueName: 'Sunset Terrace'
      }
    ];

    setContacts(mockContacts);
    setIsLoading(false);
  }, []);

  return {
    contacts,
    isLoading
  };
};
