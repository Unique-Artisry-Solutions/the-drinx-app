import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useEstablishmentProfileData } from './useEstablishmentProfileData';
import { useEstablishmentPromotions } from './useEstablishmentPromotions';
import { PromotionFormData } from '@/types/PromotionTypes';

export const useEstablishmentProfile = (establishmentId?: string) => {
  const profileData = useEstablishmentProfileData();
  
  // Mock data for promotions
  const [promotions, setPromotions] = useState([
    { 
      id: '1', 
      code: 'SUMMER10', 
      description: '10% off during summer', 
      discount_type: 'percentage',
      discount_value: 10,
      start_date: '2025-06-01',
      end_date: '2025-08-31',
      is_active: true,
      used_count: 0
    },
    { 
      id: '2', 
      code: 'WELCOME20', 
      description: '$20 off for new customers', 
      discount_type: 'fixed',
      discount_value: 20,
      start_date: '2025-01-01',
      end_date: null,
      is_active: true,
      used_count: 5
    }
  ]);
  
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  
  // Mock data for drinks - ensure all drinks have ingredients array
  const [drinks, setDrinks] = useState([
    {
      id: '1',
      name: 'Virgin Mojito',
      description: 'Fresh mint, lime, soda water',
      price: '$8.99',
      image: '/mocktail1.jpg',
      ingredients: ['Fresh mint', 'Lime juice', 'Soda water', 'Sugar']
    },
    {
      id: '2',
      name: 'Shirley Temple',
      description: 'Ginger ale, grenadine, maraschino cherry',
      price: '$6.99',
      image: '/mocktail2.jpg',
      ingredients: ['Ginger ale', 'Grenadine', 'Maraschino cherry']
    }
  ]);
  
  // Mock data for bar crawls
  const [barCrawls, setBarCrawls] = useState([
    {
      id: '1',
      name: 'Downtown Tour',
      date: '2025-06-25',
      status: 'Approved',
      establishments: ['Bar A', 'Bar B', 'Bar C']
    },
    {
      id: '2',
      name: 'Beach Hopping',
      date: '2025-07-15',
      status: 'Pending',
      establishments: ['Beach Bar 1', 'Beach Bar 2']
    }
  ]);
  
  // Mock data for loyalty program
  const [loyaltyProgram, setLoyaltyProgram] = useState({
    isActive: true,
    pointsPerDollar: 10,
    tiers: [
      { name: 'Bronze', pointsNeeded: 0, perks: ['Free birthday drink'] },
      { name: 'Silver', pointsNeeded: 500, perks: ['Free birthday drink', '5% off purchases'] },
      { name: 'Gold', pointsNeeded: 1000, perks: ['Free birthday drink', '10% off purchases', 'Priority seating'] }
    ],
    totalMembers: 152,
    activeMembers: 87
  });
  
  const { toast } = useToast();
  
  // Promotion handlers
  const handleAddPromotion = () => {
    if (newPromoCode.trim() === '' || newPromoDescription.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }
    
    const newPromotion = {
      id: (promotions.length + 1).toString(),
      code: newPromoCode,
      description: newPromoDescription,
      discount_type: 'percentage',
      discount_value: 10,
      start_date: new Date().toISOString(),
      end_date: null,
      is_active: true,
      used_count: 0
    };
    
    setPromotions([...promotions, newPromotion]);
    setNewPromoCode('');
    setNewPromoDescription('');
    
    toast({
      title: 'Promotion added',
      description: `Promotion code "${newPromoCode}" has been added`,
    });
  };
  
  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
    
    toast({
      title: 'Promotion deleted',
      description: 'The promotion has been deleted successfully',
    });
  };

  const handleUpdatePromotion = (id: string, data: PromotionFormData) => {
    const updatedPromotions = promotions.map(promo => 
      promo.id === id ? { ...promo, code: data.code, description: data.description } : promo
    );
    
    setPromotions(updatedPromotions);
    
    toast({
      title: 'Promotion updated',
      description: `The promotion has been updated successfully`,
    });
  };
  
  // Drink handlers
  const handleAddDrink = (drink: any) => {
    setDrinks([...drinks, drink]);
    
    toast({
      title: 'Drink added',
      description: `${drink.name} has been added to your menu`,
    });
  };

  const handleUpdateDrink = (updatedDrink: any) => {
    setDrinks(drinks.map(drink => 
      drink.id === updatedDrink.id ? updatedDrink : drink
    ));
    
    toast({
      title: 'Drink updated',
      description: `${updatedDrink.name} has been updated`,
    });
  };
  
  const handleDeleteDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
    
    toast({
      title: 'Drink removed',
      description: 'The drink has been removed from your menu',
    });
  };
  
  // Bar crawl handlers
  const handleApproveBarCrawl = (id: string) => {
    setBarCrawls(barCrawls.map(crawl => 
      crawl.id === id ? { ...crawl, status: 'Approved' } : crawl
    ));
    
    toast({
      title: 'Bar crawl approved',
      description: 'You have approved this bar crawl',
    });
  };
  
  const handleRejectBarCrawl = (id: string) => {
    setBarCrawls(barCrawls.map(crawl => 
      crawl.id === id ? { ...crawl, status: 'Rejected' } : crawl
    ));
    
    toast({
      title: 'Bar crawl rejected',
      description: 'You have rejected this bar crawl',
    });
  };
  
  // Loyalty program handlers
  const handleToggleLoyaltyProgram = () => {
    setLoyaltyProgram(prev => ({ ...prev, isActive: !prev.isActive }));
    
    toast({
      title: loyaltyProgram.isActive ? 'Loyalty program deactivated' : 'Loyalty program activated',
      description: loyaltyProgram.isActive 
        ? 'Your loyalty program is now deactivated'
        : 'Your loyalty program is now activated',
    });
  };
  
  const handleUpdateLoyaltySettings = (settings: any) => {
    setLoyaltyProgram(prev => ({ ...prev, ...settings }));
    
    toast({
      title: 'Settings updated',
      description: 'Loyalty program settings have been updated',
    });
  };
  
  return {
    // Profile state and handlers
    profileState: {
      ...profileData
    },
    
    // Promotions state and handlers
    promotionsState: {
      promotions,
      newPromoCode,
      newPromoDescription,
      setNewPromoCode,
      setNewPromoDescription,
      handleAddPromotion,
      handleDeletePromotion,
      handleUpdatePromotion
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
      handleApproveBarCrawl,
      handleRejectBarCrawl
    },
    
    // Loyalty program state and handlers
    loyaltyProgramState: {
      ...loyaltyProgram,
      handleToggleLoyaltyProgram,
      handleUpdateLoyaltySettings
    }
  };
};
