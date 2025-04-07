
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useDeleteRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabaseClient
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      return recipeId;
    },
    onSuccess: (recipeId) => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes', user?.id] });
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
