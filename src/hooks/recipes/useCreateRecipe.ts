import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';
import { CreateRecipeInput } from './types';
import { v4 as uuidv4 } from 'uuid';

export const useCreateRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  
  // Use either the authenticated user ID or bypass user ID
  const userId = user?.id || (isAdminBypass ? bypassUserId : null);

  const createRecipe = useMutation({
    mutationFn: async (newRecipe: CreateRecipeInput) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      console.log('Creating recipe for user:', userId, 'Recipe data:', newRecipe);
      
      // For admin bypass or demo mode, use localStorage
      if (isAdminBypass || localStorage.getItem('DEMO_MODE') === 'true') {
        console.log('Using localStorage for recipe creation (admin bypass or demo mode)');
        const mockId = uuidv4();
        const mockRecipe: UserRecipe = {
          ...newRecipe,
          id: mockId,
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage
        try {
          const existingRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
          existingRecipes.push(mockRecipe);
          localStorage.setItem('user_recipes', JSON.stringify(existingRecipes));
          console.log('Recipe saved to localStorage:', mockRecipe);
          return mockRecipe;
        } catch (err) {
          console.error('Error saving recipe to localStorage:', err);
          throw new Error('Failed to save recipe to localStorage');
        }
      }
      
      // Otherwise use Supabase
      const recipeToInsert = {
        ...newRecipe,
        user_id: userId,
      };
      
      const { data, error } = await supabase
        .from('user_recipes')
        .insert(recipeToInsert)
        .select()
        .single();
        
      if (error) {
        console.error('Error response from Supabase:', error);
        throw error;
      }
      
      console.log('Recipe created successfully:', data);
      return data as UserRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes', userId] });
      toast({
        title: "Recipe created",
        description: "Your mocktail recipe has been saved."
      });
    },
    onError: (error) => {
      console.error('Error creating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to create recipe. Please try again.",
        variant: "destructive"
      });
    }
  });

  return createRecipe;
};
