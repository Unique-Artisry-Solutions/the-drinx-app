import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RecipeFormState } from '@/components/profile/recipes/types';
import { Ingredient } from '@/types/DatabaseTypes';
import { UserRecipe } from '@/types/DatabaseTypes';

export function useRecipeForm() {
  // New recipe form state
  const [newRecipe, setNewRecipe] = useState<RecipeFormState>({
    name: '',
    description: '',
    ingredients: [],
    instructions: '',
    is_public: false
  });
  
  // Editing state for existing recipes
  const [editingRecipe, setEditingRecipe] = useState<UserRecipe | null>(null);
  
  // Form ingredient states
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const [newUnit, setNewUnit] = useState('oz');
  
  const { toast } = useToast();

  const handleAddIngredient = () => {
    if (newIngredient.trim() && newAmount.trim()) {
      const ingredient = { 
        name: newIngredient.trim(), 
        amount: newAmount.trim(),
        unit: newUnit
      };
      
      if (editingRecipe) {
        setEditingRecipe({
          ...editingRecipe,
          ingredients: [...editingRecipe.ingredients, ingredient]
        });
      } else {
        setNewRecipe({
          ...newRecipe,
          ingredients: [...newRecipe.ingredients, ingredient]
        });
      }
      setNewIngredient('');
      setNewAmount('1');
      // Keep newUnit as is since users typically use the same unit for multiple ingredients
    } else {
      toast({
        title: "Missing information",
        description: "Please enter both ingredient name and amount."
      });
    }
  };

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
    if (editingRecipe) {
      const updatedIngredients = [...editingRecipe.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
      setEditingRecipe({
        ...editingRecipe,
        ingredients: updatedIngredients
      });
    } else {
      const updatedIngredients = [...newRecipe.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value
      };
      setNewRecipe({
        ...newRecipe,
        ingredients: updatedIngredients
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    if (editingRecipe) {
      const updatedIngredients = [...editingRecipe.ingredients];
      updatedIngredients.splice(index, 1);
      setEditingRecipe({
        ...editingRecipe,
        ingredients: updatedIngredients
      });
    } else {
      const updatedIngredients = [...newRecipe.ingredients];
      updatedIngredients.splice(index, 1);
      setNewRecipe({
        ...newRecipe,
        ingredients: updatedIngredients
      });
    }
  };

  const resetForm = () => {
    setNewRecipe({
      name: '',
      description: '',
      ingredients: [],
      instructions: '',
      is_public: false
    });
    setNewIngredient('');
    setNewAmount('1');
    setNewUnit('oz');
  };

  // Form props for both create and edit forms
  const createFormProps = {
    formState: newRecipe,
    setFormState: setNewRecipe,
    newIngredient,
    setNewIngredient,
    newAmount,
    setNewAmount,
    newUnit,
    setNewUnit,
    handleAddIngredient,
    handleIngredientChange,
    handleRemoveIngredient
  };

  const getEditFormProps = () => {
    return editingRecipe ? {
      formState: {
        name: editingRecipe.name,
        description: editingRecipe.description || '',
        ingredients: editingRecipe.ingredients,
        instructions: editingRecipe.instructions,
        is_public: editingRecipe.is_public
      },
      setFormState: (formState: RecipeFormState) => {
        setEditingRecipe({
          ...editingRecipe,
          name: formState.name,
          description: formState.description,
          ingredients: formState.ingredients,
          instructions: formState.instructions,
          is_public: formState.is_public
        });
      },
      newIngredient,
      setNewIngredient,
      newAmount,
      setNewAmount,
      newUnit,
      setNewUnit,
      handleAddIngredient,
      handleIngredientChange,
      handleRemoveIngredient
    } : createFormProps;
  };

  return {
    newRecipe,
    editingRecipe,
    setEditingRecipe,
    resetForm,
    createFormProps,
    getEditFormProps
  };
}
