
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Promotion {
  id: string;
  code: string;
  description: string;
}

export const useEstablishmentPromotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulating API call to fetch establishment promotions
    setTimeout(() => {
      setPromotions([
        {id: '1', code: 'WELCOME10', description: '10% off for first time visitors'},
        {id: '2', code: 'MOCKTAIL2023', description: 'Buy one get one free on signature mocktails'}
      ]);
    }, 500);
  }, []);

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

  return {
    promotions,
    newPromoCode,
    newPromoDescription,
    setNewPromoCode,
    setNewPromoDescription,
    handleAddPromotion,
    handleDeletePromotion
  };
};
