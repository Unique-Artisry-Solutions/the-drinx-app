
import { useQuery } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';

export const useFetchRecipes = (user: User | null) => {
  // Function to fetch user recipes from Supabase
  const fetchUserRecipes = async (): Promise<UserRecipe[]> => {
    if (!user) {
      console.log('No user authenticated, returning empty recipes array');
      return [];
    }

    try {
      console.log('Fetching recipes for user:', user.id);
      const { data, error } = await supabaseClient
        .from('user_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user recipes:', error);
        throw new Error('Failed to fetch recipes');
      }

      console.log('Recipes fetched successfully:', data);
      
      // Transform the JSONB ingredients data to our Ingredient type
      return data.map(recipe => ({
        ...recipe,
        ingredients: recipe.ingredients as unknown as Ingredient[]
      })) as UserRecipe[];
    } catch (error) {
      console.error('Exception in fetchUserRecipes:', error);
      return [];
    }
  };

  // Use React Query to fetch recipes
  const {
    data: recipes = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['userRecipes', user?.id],
    queryFn: fetchUserRecipes,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    recipes,
    isLoading,
    error,
    refetch
  };
};
