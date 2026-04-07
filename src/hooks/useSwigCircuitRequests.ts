import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface SwigCircuitRequest {
  id: string;
  name: string;
  organizer: string;
  participants: number;
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'declined';
  description: string;
  otherEstablishments: string[];
  expectedDuration: string;
  specialRequests?: string;
  startDate: string; // Changed from optional to required
  endDate: string;   // Changed from optional to required
}

export const useSwigCircuitRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<SwigCircuitRequest[]>([]);
  const [acceptedRequests, setAcceptedRequests] = useState<SwigCircuitRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const swigCircuitRequests: SwigCircuitRequest[] = [
    {
      id: '1',
      name: 'Holiday Mocktail Crawl',
      organizer: 'Mike Wilson',
      participants: 15,
      date: '2023-12-15',
      time: '7:00 PM',
      status: 'pending',
      description: 'A festive tour of the best holiday-themed mocktails around town. Celebrate the season with unique flavors and creative presentations.',
      otherEstablishments: ['The Juice Bar', 'Herbal Infusions', 'Tropical Blends'],
      expectedDuration: '3 hours',
      specialRequests: 'Looking for establishments to feature at least one holiday-themed mocktail during the event.',
      startDate: '2023-12-15',
      endDate: '2023-12-15'
    },
    {
      id: '2',
      name: 'Weekend Wellness Tour',
      organizer: 'Ashley Bennett',
      participants: 12,
      date: '2023-12-20',
      time: '6:30 PM',
      status: 'pending',
      description: 'A health-focused journey through the city\'s best wellness-oriented beverage establishments.',
      otherEstablishments: ['Green Garden', 'Wellness Lounge', 'Pure Refreshment'],
      expectedDuration: '2.5 hours',
      specialRequests: 'Would appreciate if you could highlight your most nutritious options.',
      startDate: '2023-12-20',
      endDate: '2023-12-20'
    },
    {
      id: '3',
      name: 'New Year Spirits-Free Adventure',
      organizer: 'Jordan Taylor',
      participants: 20,
      date: '2023-12-31',
      time: '8:00 PM',
      status: 'pending',
      description: 'Ring in the New Year with sophisticated non-alcoholic alternatives. This circuit aims to showcase creative mixology without the alcohol.',
      otherEstablishments: ['Sober Social', 'Mindful Mixes', 'Zero Proof'],
      expectedDuration: '4 hours',
      specialRequests: 'Looking for upscale presentation and celebratory ambiance suitable for New Year\'s Eve.',
      startDate: '2023-12-31',
      endDate: '2024-01-01'
    }
  ];

  const defaultAcceptedRequests: SwigCircuitRequest[] = [
    {
      id: '4',
      name: 'Downtown Mocktail Tour',
      organizer: 'John Smith',
      participants: 12,
      date: '2023-11-15',
      time: '7:00 PM',
      status: 'accepted',
      startDate: '2023-11-15',
      endDate: '2023-11-15',
      description: 'A tour of the best mocktail spots downtown.',
      otherEstablishments: ['The Juice Bar', 'Herbal Infusions'],
      expectedDuration: '3 hours',
      specialRequests: 'None'
    },
    {
      id: '5',
      name: 'Weekend Spirits-Free Adventure',
      organizer: 'Sarah Johnson',
      participants: 8,
      date: '2023-11-20',
      time: '6:30 PM',
      status: 'accepted',
      startDate: '2023-11-20',
      endDate: '2023-11-20',
      description: 'Experience the best alcohol-free drinks in the city.',
      otherEstablishments: ['Green Garden', 'Wellness Lounge'],
      expectedDuration: '2.5 hours',
      specialRequests: 'Would like to have a private area reserved.'
    }
  ];

  const handleAcceptRequest = (id: string) => {
    toast({
      title: 'Request Accepted',
      description: 'You have successfully accepted this Swig Circuit request.'
    });
  };

  const acceptRequest = async (id: string) => {
    // This would update the status in the database
    // For now, just a placeholder
    console.log(`Accepting request ${id}`);
    handleAcceptRequest(id);
  };

  const declineRequest = async (id: string) => {
    // This would update the status in the database
    // For now, just a placeholder
    console.log(`Declining request ${id}`);
  };

  const endParticipation = async (id: string) => {
    // This would update the status in the database
    // For now, just a placeholder
    console.log(`Ending participation in swig circuit ${id}`);
  };

  return {
    pendingRequests: swigCircuitRequests,
    acceptedRequests: defaultAcceptedRequests,
    loading,
    error,
    acceptRequest,
    declineRequest,
    endParticipation
  };
};
