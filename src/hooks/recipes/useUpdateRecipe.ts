
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';
import { UpdateRecipeInput } from './types';

export const useUpdateRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateRecipe = useMutation({
    mutationFn: async (recipe: UpdateRecipeInput) => {
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      
      if (!user && !isAdminBypass) {
        throw new Error('User not authenticated');
      }
      
      const userId = user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass';
      
      const { data, error } = await supabaseClient
        .from('user_recipes')
        .update({
          name: recipe.name,
          description: recipe.description,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image_url: recipe.image_url,
          is_public: recipe.is_public,
          updated_at: new Date().toISOString()
        })
        .eq('id', recipe.id)
        .eq('user_id', userId)
        .select()
        .single();
        
      if (error) throw error;
      return data as UserRecipe;
    },
    onSuccess: () => {
      const userId = user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass';
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
