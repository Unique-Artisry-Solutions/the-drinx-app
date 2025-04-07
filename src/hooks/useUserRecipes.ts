
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { RecipeHookReturn } from './recipes/types';
import { useFetchRecipes } from './recipes/useFetchRecipes';
import { useCreateRecipe } from './recipes/useCreateRecipe';
import { useUpdateRecipe } from './recipes/useUpdateRecipe';
import { useDeleteRecipe } from './recipes/useDeleteRecipe';

export const useUserRecipes = (): RecipeHookReturn => {
  const { user } = useAuth();
  
  // Fetch recipes
  const { recipes, isLoading, error, refetch } = useFetchRecipes(user);
  
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
    deleteRecipe
  };
};
