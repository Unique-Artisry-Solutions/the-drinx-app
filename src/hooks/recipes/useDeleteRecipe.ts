
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export const useDeleteRecipe = (user: User | null) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteRecipe = useMutation({
    mutationFn: async (recipeId: string) => {
      const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
      
      if (!user && !isAdminBypass) {
        throw new Error('User not authenticated');
      }
      
      const userId = user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass';
      
      const { error } = await supabaseClient
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', userId);
      
      if (error) throw error;
      return recipeId;
    },
    onSuccess: (recipeId) => {
      const userId = user?.id || localStorage.getItem('bypass_user_id') || 'admin-bypass';
      queryClient.invalidateQueries({ queryKey: ['userRecipes', userId] });
      toast({
        title: "Recipe deleted",
        description: "Your mocktail recipe has been removed."
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
