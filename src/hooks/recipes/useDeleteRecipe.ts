import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';

export const useDeleteRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  const bypassUserId = localStorage.getItem('bypass_user_id');
  
  const userId = user?.id || (isAdminBypass ? bypassUserId : null);

  const deleteRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      console.log('Deleting recipe:', recipeId, 'for user:', userId);
      
      if (isAdminBypass || localStorage.getItem('DEMO_MODE') === 'true') {
        console.log('Using localStorage for recipe deletion (admin bypass or demo mode)');
        try {
          const existingRecipes = JSON.parse(localStorage.getItem('user_recipes') || '[]');
          const recipeIndex = existingRecipes.findIndex((recipe: UserRecipe) => recipe.id === recipeId);
          
          if (recipeIndex === -1) {
            throw new Error(`Recipe with id ${recipeId} not found`);
          }
          
          existingRecipes.splice(recipeIndex, 1);
          localStorage.setItem('user_recipes', JSON.stringify(existingRecipes));
          console.log('Recipe deleted from localStorage:', recipeId);
          return recipeId;
        } catch (err) {
          console.error('Error deleting recipe from localStorage:', err);
          throw new Error('Failed to delete recipe from localStorage');
        }
      }
      
      const { error } = await supabaseClient
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error response from Supabase:', error);
        throw error;
      }
      
      return recipeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes', userId] });
      toast({
        title: "Recipe deleted",
        description: "Your mocktail recipe has been deleted."
      });
    },
    onError: (error) => {
      console.error('Error deleting recipe:', error);
      toast({
        title: "Error",
        description: "Failed to delete recipe. Please try again.",
        variant: "destructive"
      });
    }
  });

  return deleteRecipe;
};
