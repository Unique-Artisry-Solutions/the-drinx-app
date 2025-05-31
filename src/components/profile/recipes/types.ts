
/**
 * Recipe component types using shared base interfaces with consistent naming conventions
 * 
 * Namespace: Recipe
 * Naming Conventions Applied:
 * - Props: Component interfaces
 * - Data: Data structures for recipes and ingredients
 * - Config: Configuration objects
 */

import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';
import { BaseFormProps, BaseFormModalProps } from '@/types/shared/FormInterfaces';
import { BaseActionProps } from '@/types/shared/BaseInterfaces';

// ===== RECIPE DATA STRUCTURES =====
// Recipe form state data structure
export interface RecipeFormData {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  is_public: boolean;
}

// ===== RECIPE COMPONENT PROPS =====
// Recipe item props using shared action patterns
export interface RecipeItemProps {
  recipe: UserRecipe;
  onEdit: (recipe: UserRecipe) => void;
  onDelete: (recipeId: string) => void;
  onShare: (recipe: UserRecipe) => void;
  onSuggestToEstablishment?: (recipe: UserRecipe) => void;
  isDeleting: boolean;
  deletingId?: string;
}

// Recipe form props using shared form interface
export interface RecipeFormProps extends BaseFormProps<RecipeFormData> {
  newIngredient: string;
  setNewIngredient: (value: string) => void;
  newAmount: string;
  setNewAmount: (value: string) => void;
  newUnit: string;
  setNewUnit: (value: string) => void;
  handleAddIngredient: () => void;
  handleIngredientChange: (index: number, field: keyof Ingredient, value: string) => void;
  handleRemoveIngredient: (index: number) => void;
}

// Recipe dialog props using shared modal interface
export interface CreateRecipeDialogProps extends BaseFormModalProps<RecipeFormData> {
  formProps: RecipeFormProps;
}

export interface EditRecipeDialogProps {
  recipe: UserRecipe | null;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating: boolean;
  formProps: RecipeFormProps;
}

// ===== LEGACY COMPATIBILITY =====
/** @deprecated Use RecipeFormData instead */
export type RecipeFormState = RecipeFormData;
