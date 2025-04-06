
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarCrawlRequest } from '@/hooks/useBarCrawlRequests';

export const useEstablishmentBarCrawls = () => {
  const [barCrawls, setBarCrawls] = useState<BarCrawlRequest[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulating API call to fetch bar crawls
    setTimeout(() => {
      setBarCrawls([
        {
          id: '1',
          name: 'Downtown Mocktail Tour',
          date: '2023-11-15',
          time: '18:00',
          participants: 12,
          organizer: 'John Smith',
          startDate: '2023-11-15',
          endDate: '2023-11-15',
          status: 'accepted',
          otherEstablishments: [],
          description: 'A tour of the best mocktail spots downtown.',
          expectedDuration: '3 hours'
        },
        {
          id: '2',
          name: 'Weekend Spirits-Free Adventure',
          date: '2023-11-20',
          time: '19:00',
          participants: 8,
          organizer: 'Sarah Johnson',
          startDate: '2023-11-20',
          endDate: '2023-11-20',
          status: 'accepted',
          otherEstablishments: [],
          description: 'Experience the best alcohol-free drinks in the city.',
          expectedDuration: '4 hours'
        },
        {
          id: '3',
          name: 'Holiday Mocktail Crawl',
          date: '2023-12-15',
          time: '20:00',
          participants: 15,
          organizer: 'Mike Wilson',
          startDate: '2023-12-15',
          endDate: '2023-12-16',
          status: 'pending',
          otherEstablishments: ['The Juice Bar', 'Herbal Infusions', 'Tropical Blends'],
          description: 'Celebrate the holidays with festive non-alcoholic concoctions.',
          expectedDuration: '6 hours'
        }
      ]);
    }, 500);
  }, []);

  const handleEndParticipation = (crawlId: string) => {
    setBarCrawls(barCrawls.filter(crawl => crawl.id !== crawlId));
    
    toast({
      title: 'Participation ended',
      description: 'You have successfully ended your participation in this bar crawl',
    });
  };

  const handleAcceptRequest = (crawlId: string) => {
    setBarCrawls(barCrawls.map(crawl => 
      crawl.id === crawlId 
        ? { ...crawl, status: 'accepted' as const } 
        : crawl
    ));
    
    toast({
      title: 'Request accepted',
      description: 'You have successfully accepted the bar crawl request',
    });
  };

  return {
    barCrawls,
    handleEndParticipation,
    handleAcceptRequest
  };
};
