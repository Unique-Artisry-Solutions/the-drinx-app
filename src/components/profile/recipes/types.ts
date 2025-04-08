
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';

export interface RecipeItemProps {
  recipe: UserRecipe;
  onEdit: (recipe: UserRecipe) => void;
  onDelete: (recipeId: string) => void;
  onShare: (recipe: UserRecipe) => void;
  onSuggestToEstablishment?: (recipe: UserRecipe) => void;
  isDeleting: boolean;
  deletingId?: string;
}

export interface RecipeFormProps {
  formState: RecipeFormState;
  setFormState: (state: RecipeFormState) => void;
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

export interface RecipeFormState {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  is_public: boolean;
}

export interface CreateRecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  formProps: RecipeFormProps;
}

export interface EditRecipeDialogProps {
  recipe: UserRecipe | null;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating: boolean;
  formProps: RecipeFormProps;
}
