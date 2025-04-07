
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';
import { CreateRecipeInput } from './types';

export const useCreateRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createRecipe = useMutation({
    mutationFn: async (newRecipe: CreateRecipeInput) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Creating recipe for user:', user.id, 'Recipe data:', newRecipe);
      
      // Use localStorage for testing when in demo/non-auth mode
      if (localStorage.getItem('DEMO_MODE') === 'true' || !user.id) {
        const mockId = `local-${Date.now()}`;
        const mockRecipe = {
          ...newRecipe,
          id: mockId,
          user_id: 'local-user',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage
        const existingRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
        existingRecipes.push(mockRecipe);
        localStorage.setItem('user_recipes', JSON.stringify(existingRecipes));
        
        return mockRecipe;
      }
      
      const recipeToInsert = {
        ...newRecipe,
        user_id: user.id,
      };
      
      const { data, error } = await supabaseClient
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
      queryClient.invalidateQueries({ queryKey: ['userRecipes', user?.id] });
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
