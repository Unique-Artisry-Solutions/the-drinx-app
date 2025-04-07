
import { Ingredient } from '../IngredientInputSection';
import { useToast } from '@/hooks/use-toast';

export const validateMocktailForm = (
  name: string, 
  ingredients: Ingredient[], 
  instructions: string
): { isValid: boolean; errorMessage?: string } => {
  if (!name.trim()) {
    return { 
      isValid: false, 
      errorMessage: "Please enter a name for your mocktail."
    };
  }
  
  if (ingredients.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please add at least one ingredient."
    };
  }
  
  if (!instructions.trim()) {
    return {
      isValid: false,
      errorMessage: "Please enter instructions for your mocktail."
    };
  }
  
  return { isValid: true };
};

export const showFormValidationError = (errorMessage: string) => {
  const { toast } = useToast();
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive"
  });
};
