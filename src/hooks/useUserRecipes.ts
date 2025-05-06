
import { useAuth } from '@/contexts/auth';
import { RecipeHookReturn } from './recipes/types';
import { useFetchRecipes } from './recipes/useFetchRecipes';
import { useCreateRecipe } from './recipes/useCreateRecipe';
import { useUpdateRecipe } from './recipes/useUpdateRecipe';
import { useDeleteRecipe } from './recipes/useDeleteRecipe';
import { useAppNavigation } from '@/hooks/useAppNavigation';

export const useUserRecipes = (): RecipeHookReturn => {
  const { user } = useAuth();
  const { navigate } = useAppNavigation();
  
  // Fetch recipes
  const { data: recipes = [], isLoading, error, refetch } = useFetchRecipes(user);
  
  // Recipe mutations
  const createRecipe = useCreateRecipe(user);
  const updateRecipe = useUpdateRecipe(user);
  const deleteRecipe = useDeleteRecipe(user);

  return {
    recipes,
    isLoading,
    error,
    refetch,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    navigate
  };
};
