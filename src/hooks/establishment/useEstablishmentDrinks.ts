
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Drink } from '@/components/establishment/DrinkProfileModal';

export const useEstablishmentDrinks = () => {
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulating API call to fetch establishment drinks
    setTimeout(() => {
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
    }, 500);
  }, []);

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

  return {
    drinks,
    handleAddDrink,
    handleUpdateDrink,
    handleDeleteDrink
  };
};
