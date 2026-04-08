
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Drink } from '@/components/establishment/DrinkProfileModal';
import { BusinessHour } from '@/components/establishment/BusinessHoursEditor';

interface Promotion {
  id: string;
  code: string;
  description: string;
}

interface SwigCircuit {
  id: string;
  name: string;
  date: string;
  participants: number;
  organizer: string;
  startDate: string;
  endDate: string;
  status: 'accepted' | 'pending';
  otherEstablishments: string[];
  description?: string;
}

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
}

export const useEstablishmentProfile = () => {
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  
  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  
  // Drinks state
  const [drinks, setDrinks] = useState<Drink[]>([]);
  
  // Visitor stats state
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    returningVisitors: 0
  });
  
  // Bar crawls state
  const [swigCircuits, setSwigCircuits] = useState<SwigCircuit[]>([]);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    // Simulating API call to fetch establishment data
    setTimeout(() => {
      // Load profile data
      setName("Your Establishment");
      setEmail(localStorage.getItem('user_email') || '');
      setDescription("We serve the best mocktails in town!");
      setAddress("123 Main St, Anytown USA");
      setPhone("555-123-4567");
      setWebsite("www.yourestablishment.com");
      setBusinessHours([
        { day: 'Monday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Tuesday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Wednesday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Thursday', openTime: '11:00', closeTime: '22:00' },
        { day: 'Friday', openTime: '11:00', closeTime: '00:00' },
        { day: 'Saturday', openTime: '11:00', closeTime: '00:00' },
        { day: 'Sunday', openTime: '12:00', closeTime: '21:00' }
      ]);
      
      // Load promotions
      setPromotions([
        {id: '1', code: 'WELCOME10', description: '10% off for first time visitors'},
        {id: '2', code: 'MOCKTAIL2023', description: 'Buy one get one free on signature mocktails'}
      ]);
      
      // Load drinks
      setDrinks([
        {
          id: '1',
          name: 'Blue Lagoon',
          description: 'A refreshing blend of blue curaçao syrup, lemon juice, and sprite, garnished with a lemon wheel and cherry.',
          price: '$8.99',
          ingredients: ['Blue Curaçao Syrup', 'Lemon Juice', 'Sprite'],
          photoUrl: 'https://placehold.co/300x200'
        },
        {
          id: '2',
          name: 'Tropical Paradise',
          description: 'A tropical mix of pineapple juice, coconut cream, and orange juice, garnished with a pineapple wedge.',
          price: '$9.99',
          ingredients: ['Pineapple Juice', 'Coconut Cream', 'Orange Juice'],
          photoUrl: 'https://placehold.co/300x200'
        }
      ]);
      
      // Load visitor stats
      setVisitorStats({
        totalVisits: 278,
        uniqueVisitors: 153,
        returningVisitors: 62
      });
      
      // Load bar crawls
      setSwigCircuits([
        {
          id: '1',
          name: 'Downtown Mocktail Tour',
          date: '2023-11-15',
          participants: 12,
          organizer: 'John Smith',
          startDate: '2023-11-15',
          endDate: '2023-11-15',
          status: 'accepted',
          otherEstablishments: [],
          description: 'A tour of the best mocktail spots downtown.'
        },
        {
          id: '2',
          name: 'Weekend Spirits-Free Adventure',
          date: '2023-11-20',
          participants: 8,
          organizer: 'Sarah Johnson',
          startDate: '2023-11-20',
          endDate: '2023-11-20',
          status: 'accepted',
          otherEstablishments: [],
          description: 'Experience the best alcohol-free drinks in the city.'
        },
        {
          id: '3',
          name: 'Holiday Mocktail Crawl',
          date: '2023-12-15',
          participants: 15,
          organizer: 'Mike Wilson',
          startDate: '2023-12-15',
          endDate: '2023-12-16',
          status: 'pending',
          otherEstablishments: ['The Juice Bar', 'Herbal Infusions', 'Tropical Blends'],
          description: 'Celebrate the holidays with festive non-alcoholic concoctions.'
        }
      ]);
    }, 500);
  }, []);

  // Profile handlers
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call to save profile data
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your establishment profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

  // Promotions handlers
  const handleAddPromotion = () => {
    if (!newPromoCode || !newPromoDescription) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a code and description for your promotion',
        variant: 'destructive'
      });
      return;
    }
    
    const newPromo = {
      id: Date.now().toString(),
      code: newPromoCode,
      description: newPromoDescription
    };
    
    setPromotions([...promotions, newPromo]);
    setNewPromoCode('');
    setNewPromoDescription('');
    
    toast({
      title: 'Promotion added',
      description: `Your promotion "${newPromoCode}" has been added successfully`,
    });
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
    
    toast({
      title: 'Promotion removed',
      description: 'The promotion has been removed successfully',
    });
  };

  // Drink handlers
  const handleAddDrink = (drink: Drink) => {
    setDrinks([...drinks, drink]);
  };

  const handleUpdateDrink = (updatedDrink: Drink) => {
    setDrinks(drinks.map(drink => 
      drink.id === updatedDrink.id ? updatedDrink : drink
    ));
  };

  const handleDeleteDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
    
    toast({
      title: 'Mocktail removed',
      description: 'The mocktail has been removed from your menu',
    });
  };

  // Bar crawl handlers
  const handleEndParticipation = (crawlId: string) => {
    setSwigCircuits(swigCircuits.filter(crawl => crawl.id !== crawlId));
    
    toast({
      title: 'Participation ended',
      description: 'You have successfully ended your participation in this bar crawl',
    });
  };

  const handleAcceptRequest = (crawlId: string) => {
    setSwigCircuits(swigCircuits.map(crawl => 
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
    // Profile state and handlers
    profileState: {
      name,
      email,
      description,
      address,
      phone,
      website,
      businessHours,
      isLoading,
      setName,
      setEmail,
      setDescription,
      setAddress,
      setPhone,
      setWebsite,
      setBusinessHours,
      handleSaveProfile
    },
    
    // Promotions state and handlers
    promotionsState: {
      promotions,
      newPromoCode,
      newPromoDescription,
      setNewPromoCode,
      setNewPromoDescription,
      handleAddPromotion,
      handleDeletePromotion
    },
    
    // Drinks state and handlers
    drinksState: {
      drinks,
      handleAddDrink,
      handleUpdateDrink,
      handleDeleteDrink
    },
    
    // Visitor stats state
    visitorStats,
    
    // Bar crawls state and handlers
    swigCircuitsState: {
      swigCircuits,
      handleEndParticipation,
      handleAcceptRequest
    }
  };
};
