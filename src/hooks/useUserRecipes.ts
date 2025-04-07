
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';

export const useUserRecipes = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Create recipe mutation
  const createRecipe = useMutation({
    mutationFn: async (newRecipe: Omit<UserRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      console.log('Creating recipe for user:', user.id, 'Recipe data:', newRecipe);
      
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

  // Update recipe mutation
  const updateRecipe = useMutation({
    mutationFn: async (recipe: Pick<UserRecipe, 'id' | 'name' | 'description' | 'ingredients' | 'instructions' | 'image_url' | 'is_public'>) => {
      if (!user) throw new Error('User not authenticated');
      
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
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) throw error;
      return data as UserRecipe;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRecipes', user?.id] });
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

  // Delete recipe mutation
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
