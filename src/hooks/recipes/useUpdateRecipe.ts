import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';

export const useUpdateRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  
  const userId = user?.id || (isAdminBypass ? bypassUserId : null);

  const updateRecipe = useMutation({
    mutationFn: async (updatedRecipe: UserRecipe) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      console.log('Updating recipe:', updatedRecipe.id, 'for user:', userId);
      
      if (isAdminBypass || localStorage.getItem('DEMO_MODE') === 'true') {
        console.log('Using localStorage for recipe update (admin bypass or demo mode)');
        try {
          const existingRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
          const recipeIndex = existingRecipes.findIndex((recipe: UserRecipe) => recipe.id === updatedRecipe.id);
          
          if (recipeIndex === -1) {
            throw new Error(`Recipe with id ${updatedRecipe.id} not found`);
          }
          
          const updatedRecipeWithTimestamp = {
            ...updatedRecipe,
            updated_at: new Date().toISOString()
          };
          
          existingRecipes[recipeIndex] = updatedRecipeWithTimestamp;
          localStorage.setItem('user_recipes', JSON.stringify(existingRecipes));
          console.log('Recipe updated in localStorage:', updatedRecipeWithTimestamp);
          return updatedRecipeWithTimestamp;
        } catch (err) {
          console.error('Error updating recipe in localStorage:', err);
          throw new Error('Failed to update recipe in localStorage');
        }
      }
      
      const { data, error } = await supabase
        .from('user_recipes')
        .update({
          name: updatedRecipe.name,
          description: updatedRecipe.description,
          ingredients: updatedRecipe.ingredients,
          instructions: updatedRecipe.instructions,
          is_public: updatedRecipe.is_public,
          image_url: updatedRecipe.image_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedRecipe.id)
        .eq('user_id', userId)
        .select()
        .single();
      
      if (error) {
        console.error('Error response from Supabase:', error);
        throw error;
      }
      
      return data as UserRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes', userId] });
      toast({
        title: "Recipe updated",
        description: "Your mocktail recipe has been updated."
      });
    },
    onError: (error) => {
      console.error('Error updating recipe:', error);
      toast({
        title: "Error",
        description: "Failed to update recipe. Please try again.",
        variant: "destructive"
      });
    }
  });

  return updateRecipe;
};
