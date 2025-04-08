import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Drink } from '@/components/establishment/DrinkProfileModal';
import { BusinessHour } from '@/components/establishment/BusinessHoursEditor';

interface Promotion {
  id: string;
  code: string;
  description: string;
}

interface BarCrawl {
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

export const useEstablishmentProfile = (establishmentId?: string) => {
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  
  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  
  // Drinks state
  const [drinks, setDrinks] = useState<Drink[]>([]);
  
  // Bar crawls state
  const [barCrawls, setBarCrawls] = useState<BarCrawl[]>([]);
  
  const { toast } = useToast();

  // Load initial data
  useEffect(() => {
    const fetchEstablishmentData = async () => {
      if (!establishmentId) {
        setIsLoading(false);
        setError("No establishment ID provided");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch establishment details
        const { data: establishment, error: estError } = await supabase
          .from('establishments')
          .select('*')
          .eq('id', establishmentId)
          .single();
          
        if (estError) throw estError;
        if (!establishment) throw new Error("Establishment not found");
        
        // Set basic profile data
        setName(establishment.name || '');
        setAddress(establishment.address || '');
        setPhone(establishment.phone || '');
        setWebsite(establishment.website || '');
        
        // Parse business hours if available
        if (establishment.hours) {
          try {
            const hourData = Array.isArray(establishment.hours) 
              ? establishment.hours 
              : typeof establishment.hours === 'object' 
                ? Object.entries(establishment.hours).map(([day, hours]) => ({
                    day,
                    openTime: typeof hours === 'string' ? hours.split('-')[0]?.trim() : '09:00',
                    closeTime: typeof hours === 'string' ? hours.split('-')[1]?.trim() : '17:00'
                  }))
                : [];
                
            setBusinessHours(hourData);
          } catch (e) {
            console.error('Error parsing hours:', e);
            // Fallback to default hours
            setBusinessHours([
              { day: 'Monday', openTime: '11:00', closeTime: '22:00' },
              { day: 'Tuesday', openTime: '11:00', closeTime: '22:00' },
              { day: 'Wednesday', openTime: '11:00', closeTime: '22:00' },
              { day: 'Thursday', openTime: '11:00', closeTime: '22:00' },
              { day: 'Friday', openTime: '11:00', closeTime: '00:00' },
              { day: 'Saturday', openTime: '11:00', closeTime: '00:00' },
              { day: 'Sunday', openTime: '12:00', closeTime: '21:00' }
            ]);
          }
        } else {
          // Default business hours
          setBusinessHours([
            { day: 'Monday', openTime: '11:00', closeTime: '22:00' },
            { day: 'Tuesday', openTime: '11:00', closeTime: '22:00' },
            { day: 'Wednesday', openTime: '11:00', closeTime: '22:00' },
            { day: 'Thursday', openTime: '11:00', closeTime: '22:00' },
            { day: 'Friday', openTime: '11:00', closeTime: '00:00' },
            { day: 'Saturday', openTime: '11:00', closeTime: '00:00' },
            { day: 'Sunday', openTime: '12:00', closeTime: '21:00' }
          ]);
        }
        
        // Fetch promotions
        const { data: promoData, error: promoError } = await supabase
          .from('establishment_promotions')
          .select('id, code, description')
          .eq('establishment_id', establishmentId)
          .eq('is_active', true);
          
        if (promoError) throw promoError;
        setPromotions(promoData || []);
        
        // Fetch drinks (cocktails)
        const { data: drinksData, error: drinksError } = await supabase
          .from('cocktails')
          .select('*')
          .eq('establishment_id', establishmentId);
          
        if (drinksError) throw drinksError;
        
        // Transform to Drink format
        const formattedDrinks = (drinksData || []).map(drink => ({
          id: drink.id,
          name: drink.name,
          description: drink.description,
          price: drink.price,
          ingredients: Array.isArray(drink.ingredients) 
            ? drink.ingredients 
            : typeof drink.ingredients === 'object'
              ? Object.keys(drink.ingredients || {})
              : [],
          photoUrl: drink.image_url || 'https://placehold.co/300x200'
        }));
        
        setDrinks(formattedDrinks);
        
        // Fetch bar crawls
        const { data: barCrawlsData, error: barCrawlsError } = await supabase
          .from('bar_crawl_establishments')
          .select(`
            bar_crawl_id,
            status,
            bar_crawls (
              id, 
              name, 
              description,
              start_date,
              end_date,
              organizer_id,
              profiles:organizer_id (
                display_name
              )
            )
          `)
          .eq('establishment_id', establishmentId);
          
        if (barCrawlsError) throw barCrawlsError;
        
        if (barCrawlsData && barCrawlsData.length > 0) {
          // Format bar crawls
          const formattedBarCrawls = barCrawlsData.map(item => ({
            id: item.bar_crawls?.id || '',
            name: item.bar_crawls?.name || '',
            date: item.bar_crawls?.start_date || '',
            participants: 0, // We'd need another query to get actual participants count
            organizer: item.bar_crawls?.profiles?.display_name || 'Unknown Organizer',
            startDate: item.bar_crawls?.start_date || '',
            endDate: item.bar_crawls?.end_date || '',
            status: item.status as 'accepted' | 'pending',
            otherEstablishments: [], // We'd need another query to get this
            description: item.bar_crawls?.description
          }));
          
          setBarCrawls(formattedBarCrawls);
        } else {
          // Empty array if no bar crawls
          setBarCrawls([]);
        }
        
      } catch (err: any) {
        console.error('Error fetching establishment data:', err);
        setError(err.message || 'Failed to load establishment data');
        
        // Fallback to sample data
        setName("Your Establishment");
        setAddress("123 Main St, Anytown USA");
        setPhone("555-123-4567");
        setWebsite("www.yourestablishment.com");
        setPromotions([
          {id: '1', code: 'WELCOME10', description: '10% off for first time visitors'},
          {id: '2', code: 'MOCKTAIL2023', description: 'Buy one get one free on signature mocktails'}
        ]);
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
        setBarCrawls([
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
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEstablishmentData();
  }, [establishmentId]);

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
      error,
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
    
    // Bar crawls state and handlers
    barCrawlsState: {
      barCrawls,
      handleEndParticipation,
      handleAcceptRequest
    }
  };
};
