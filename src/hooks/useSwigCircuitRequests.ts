
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarCrawlRequest } from '@/hooks/useBarCrawlRequests';

export const useSwigCircuitRequests = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("pending");

  const barCrawlRequests: BarCrawlRequest[] = [
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

  const acceptedRequests: BarCrawlRequest[] = [
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

  const formattedPendingRequests = barCrawlRequests.map(req => ({
    id: req.id,
    name: req.name,
    date: req.date,
    participants: req.participants,
    organizer: req.organizer,
    startDate: req.startDate,
    endDate: req.endDate,
    status: 'pending' as const,
    otherEstablishments: req.otherEstablishments,
    description: req.description,
    time: req.time,
    expectedDuration: req.expectedDuration,
    specialRequests: req.specialRequests
  }));

  const formattedAcceptedRequests = acceptedRequests.map(req => ({
    id: req.id,
    name: req.name,
    date: req.date,
    participants: req.participants,
    organizer: req.organizer,
    startDate: req.startDate,
    endDate: req.endDate,
    status: 'accepted' as const,
    otherEstablishments: req.otherEstablishments,
    description: req.description,
    time: req.time,
    expectedDuration: req.expectedDuration,
    specialRequests: req.specialRequests
  }));

  const handleAcceptRequest = (id: string) => {
    toast({
      title: 'Request Accepted',
      description: 'You have successfully accepted this Swig Circuit request.'
    });
  };

  const handleDeclineRequest = (id: string) => {
    toast({
      title: 'Request Declined',
      description: 'You have declined this Swig Circuit request.'
    });
  };

  const handleEndParticipation = (id: string) => {
    toast({
      title: 'Participation Ended',
      description: 'You have ended your participation in this Swig Circuit.'
    });
  };

  return {
    activeTab,
    setActiveTab,
    formattedPendingRequests,
    formattedAcceptedRequests,
    handleAcceptRequest,
    handleDeclineRequest,
    handleEndParticipation
  };
};
