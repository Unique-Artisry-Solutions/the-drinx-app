
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';
import { BaseFormProps, BaseFormModalProps } from '@/types/shared/FormInterfaces';
import { BaseListItem, BaseActionProps } from '@/types/shared/BaseInterfaces';

// Recipe form state using shared patterns
export interface RecipeFormState {
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  is_public: boolean;
}

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
export interface RecipeFormProps extends BaseFormProps<RecipeFormState> {
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
export interface CreateRecipeDialogProps extends BaseFormModalProps<RecipeFormState> {
  formProps: RecipeFormProps;
}

export interface EditRecipeDialogProps {
  recipe: UserRecipe | null;
  onClose: () => void;
  onUpdate: () => void;
  isUpdating: boolean;
  formProps: RecipeFormProps;
}
