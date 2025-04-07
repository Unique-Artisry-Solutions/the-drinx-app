
import { Ingredient, UserRecipe } from '@/types/DatabaseTypes';

export type CreateRecipeInput = Omit<UserRecipe, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export type UpdateRecipeInput = Pick<UserRecipe, 'id' | 'name' | 'description' | 'ingredients' | 'instructions' | 'image_url' | 'is_public'>;

export interface RecipeHookReturn {
  recipes: UserRecipe[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  createRecipe: {
    mutateAsync: (recipe: CreateRecipeInput) => Promise<UserRecipe>;
    isPending: boolean;
  };
  updateRecipe: {
    mutateAsync: (recipe: UpdateRecipeInput) => Promise<UserRecipe>;
    isPending: boolean;
  };
  deleteRecipe: {
    mutateAsync: (recipeId: string) => Promise<string>;
    isPending: boolean;
    variables?: string;
  };
}
