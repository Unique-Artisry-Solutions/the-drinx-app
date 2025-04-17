import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Drink } from '@/components/establishment/DrinkProfileModal';
import { BusinessHour } from '@/components/establishment/BusinessHoursEditor';
import { PostgrestError } from '@supabase/supabase-js';

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

interface LoyaltyProgram {
  id?: string;
  name: string;
  description: string;
  pointsPerPurchase: number;
  pointsPerDollar: number;
  isActive: boolean;
  enrollmentBonus: number;
  referralBonus: number;
  birthMonthBonus: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  isActive: boolean;
  imageUrl?: string;
  expirationDays?: number;
}

interface LoyaltyStats {
  memberCount: number;
  activeMembers: number;
  redemptionRate: number;
  averagePoints: number;
  memberRetentionRate: number;
}

interface BarCrawlResponse {
  bar_crawl_id: string;
  status: 'accepted' | 'pending';
  bar_crawls: {
    id: string;
    name: string;
    description: string | null;
    start_date: string;
    end_date: string;
    organizer_id: string;
  };
}

interface UserProfile {
  id: string;
  display_name: string;
}

export const useEstablishmentProfile = (establishmentId?: string) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  
  const [drinks, setDrinks] = useState<Drink[]>([]);
  
  const [barCrawls, setBarCrawls] = useState<BarCrawl[]>([]);
  
  const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>({
    name: '',
    description: '',
    pointsPerPurchase: 10,
    pointsPerDollar: 1,
    isActive: false,
    enrollmentBonus: 100,
    referralBonus: 50,
    birthMonthBonus: 200
  });
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>([]);
  const [loyaltyStats, setLoyaltyStats] = useState<LoyaltyStats>({
    memberCount: 0,
    activeMembers: 0,
    redemptionRate: 0,
    averagePoints: 0,
    memberRetentionRate: 0
  });
  const [loyaltyIsLoading, setLoyaltyIsLoading] = useState(false);
  const [loyaltyError, setLoyaltyError] = useState<string | null>(null);
  
  const { toast } = useToast();

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
        const { data: establishment, error: estError } = await supabase
          .from('establishments')
          .select('*')
          .eq('id', establishmentId)
          .single();
          
        if (estError) throw estError;
        if (!establishment) throw new Error("Establishment not found");
        
        setName(establishment.name || '');
        setAddress(establishment.address || '');
        setPhone(establishment.phone || '');
        setWebsite(establishment.website || '');
        
        if (establishment.hours) {
          try {
            if (Array.isArray(establishment.hours)) {
              const formattedHours: BusinessHour[] = establishment.hours.map((hour: any) => ({
                day: String(hour.day || ''),
                openTime: String(hour.openTime || '09:00'),
                closeTime: String(hour.closeTime || '17:00')
              }));
              setBusinessHours(formattedHours);
            } 
            else if (typeof establishment.hours === 'object' && establishment.hours !== null) {
              const hourData: BusinessHour[] = Object.entries(establishment.hours).map(([day, hours]) => {
                let openTime = '09:00';
                let closeTime = '17:00';
                
                if (typeof hours === 'string' && hours.includes('-')) {
                  const parts = hours.split('-');
                  openTime = parts[0]?.trim() || openTime;
                  closeTime = parts[1]?.trim() || closeTime;
                }
                
                return { day, openTime, closeTime };
              });
              setBusinessHours(hourData);
            }
            else {
              setBusinessHours(defaultBusinessHours);
            }
          } catch (e) {
            console.error('Error parsing hours:', e);
            setBusinessHours(defaultBusinessHours);
          }
        } else {
          setBusinessHours(defaultBusinessHours);
        }
        
        const { data: promoData, error: promoError } = await supabase
          .from('establishment_promotions')
          .select('id, code, description')
          .eq('establishment_id', establishmentId)
          .eq('is_active', true);
          
        if (promoError) throw promoError;
        setPromotions(promoData || []);
        
        const { data: drinksData, error: drinksError } = await supabase
          .from('cocktails')
          .select('*')
          .eq('establishment_id', establishmentId);
          
        if (drinksError) throw drinksError;
        
        if (drinksData) {
          const formattedDrinks: Drink[] = drinksData.map(drink => ({
            id: drink.id,
            name: drink.name,
            description: drink.description,
            price: drink.price,
            ingredients: Array.isArray(drink.ingredients) 
              ? drink.ingredients.map(ing => String(ing))
              : typeof drink.ingredients === 'object' && drink.ingredients !== null
                ? Object.keys(drink.ingredients)
                : [],
            photoUrl: drink.image_url || 'https://placehold.co/300x200'
          }));
          
          setDrinks(formattedDrinks);
        }
        
        const { data: barCrawlsData, error: barCrawlsError } = await supabase
          .from('bar_crawl_establishments')
          .select<string, BarCrawlResponse>(`
            bar_crawl_id,
            status,
            bar_crawls (
              id, 
              name, 
              description,
              start_date,
              end_date,
              organizer_id
            )
          `)
          .eq('establishment_id', establishmentId);
          
        if (barCrawlsError) throw barCrawlsError;
        
        if (barCrawlsData && barCrawlsData.length > 0) {
          const formattedBarCrawls: BarCrawl[] = barCrawlsData.map(item => ({
            id: item.bar_crawls.id || '',
            name: item.bar_crawls.name || '',
            date: item.bar_crawls.start_date || '',
            participants: 0,
            organizer: 'Unknown Organizer',
            startDate: item.bar_crawls.start_date || '',
            endDate: item.bar_crawls.end_date || '',
            status: item.status || 'pending',
            otherEstablishments: [],
            description: item.bar_crawls.description || undefined
          }));
          
          for (let i = 0; i < formattedBarCrawls.length; i++) {
            if (barCrawlsData[i]?.bar_crawls?.organizer_id) {
              try {
                const { data: userData } = await supabase
                  .from('profiles')
                  .select<string, UserProfile>('display_name')
                  .eq('id', barCrawlsData[i].bar_crawls.organizer_id)
                  .single();
                  
                if (userData?.display_name) {
                  formattedBarCrawls[i].organizer = userData.display_name;
                }
              } catch (err) {
                console.error('Error fetching organizer:', err);
              }
            }
          }
          
          setBarCrawls(formattedBarCrawls);
        } else {
          setBarCrawls([]);
        }
        
        fetchLoyaltyProgramData(establishmentId);
      } catch (err: any) {
        console.error('Error fetching establishment data:', err);
        setError(err.message || 'Failed to load establishment data');
        
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

  const fetchLoyaltyProgramData = (establishmentId: string) => {
    setLoyaltyIsLoading(true);
    setLoyaltyError(null);

    setTimeout(() => {
      const sampleProgram: LoyaltyProgram = {
        id: `loyalty-${establishmentId}`,
        name: "Mocktail Rewards",
        description: "Earn points on every purchase to redeem for special rewards and exclusive offers.",
        pointsPerPurchase: 10,
        pointsPerDollar: 1,
        isActive: true,
        enrollmentBonus: 100,
        referralBonus: 50,
        birthMonthBonus: 200
      };

      const sampleRewards: LoyaltyReward[] = [
        {
          id: '1',
          name: 'Free Signature Mocktail',
          description: 'Enjoy a complimentary signature mocktail of your choice.',
          pointsRequired: 150,
          isActive: true,
          imageUrl: 'https://placehold.co/300x200?text=Mocktail'
        },
        {
          id: '2',
          name: 'Buy One Get One Free',
          description: 'Purchase any mocktail and get another one free.',
          pointsRequired: 250,
          isActive: true,
          imageUrl: 'https://placehold.co/300x200?text=BOGO'
        },
        {
          id: '3',
          name: 'VIP Experience',
          description: 'Skip the line, get a reserved table and exclusive mocktail tasting.',
          pointsRequired: 500,
          isActive: true,
          imageUrl: 'https://placehold.co/300x200?text=VIP'
        }
      ];

      const sampleStats: LoyaltyStats = {
        memberCount: 178,
        activeMembers: 93,
        redemptionRate: 42,
        averagePoints: 215,
        memberRetentionRate: 78
      };

      setLoyaltyProgram(sampleProgram);
      setLoyaltyRewards(sampleRewards);
      setLoyaltyStats(sampleStats);
      setLoyaltyIsLoading(false);
    }, 800);
  };

  const defaultBusinessHours: BusinessHour[] = [
    { day: 'Monday', openTime: '11:00', closeTime: '22:00' },
    { day: 'Tuesday', openTime: '11:00', closeTime: '22:00' },
    { day: 'Wednesday', openTime: '11:00', closeTime: '22:00' },
    { day: 'Thursday', openTime: '11:00', closeTime: '22:00' },
    { day: 'Friday', openTime: '11:00', closeTime: '00:00' },
    { day: 'Saturday', openTime: '11:00', closeTime: '00:00' },
    { day: 'Sunday', openTime: '12:00', closeTime: '21:00' }
  ];

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your establishment profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

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

  const handleSaveProgram = (updatedProgram: LoyaltyProgram) => {
    setLoyaltyIsLoading(true);
    
    setTimeout(() => {
      setLoyaltyProgram(updatedProgram);
      setLoyaltyIsLoading(false);
      
      toast({
        title: 'Loyalty Program Updated',
        description: 'Your loyalty program settings have been saved successfully.',
      });
    }, 800);
  };

  const handleAddReward = (newReward: Omit<LoyaltyReward, 'id'>) => {
    const rewardWithId: LoyaltyReward = {
      ...newReward,
      id: Date.now().toString()
    };
    
    setLoyaltyRewards([...loyaltyRewards, rewardWithId]);
    
    toast({
      title: 'Reward Added',
      description: `The reward "${newReward.name}" has been added successfully.`,
    });
  };

  const handleUpdateReward = (updatedReward: LoyaltyReward) => {
    setLoyaltyRewards(loyaltyRewards.map(reward => 
      reward.id === updatedReward.id ? updatedReward : reward
    ));
    
    toast({
      title: 'Reward Updated',
      description: `The reward "${updatedReward.name}" has been updated successfully.`,
    });
  };

  const handleDeleteReward = (id: string) => {
    setLoyaltyRewards(loyaltyRewards.filter(reward => reward.id !== id));
    
    toast({
      title: 'Reward Removed',
      description: 'The reward has been removed successfully.',
    });
  };

  return {
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
    
    promotionsState: {
      promotions,
      newPromoCode,
      newPromoDescription,
      setNewPromoCode,
      setNewPromoDescription,
      handleAddPromotion,
      handleDeletePromotion
    },
    
    drinksState: {
      drinks,
      handleAddDrink,
      handleUpdateDrink,
      handleDeleteDrink
    },
    
    barCrawlsState: {
      barCrawls,
      handleEndParticipation,
      handleAcceptRequest
    },
    
    loyaltyProgramState: {
      program: loyaltyProgram,
      rewards: loyaltyRewards,
      stats: loyaltyStats,
      isLoading: loyaltyIsLoading,
      error: loyaltyError,
      handleSaveProgram,
      handleAddReward,
      handleUpdateReward,
      handleDeleteReward
    }
  };
};
