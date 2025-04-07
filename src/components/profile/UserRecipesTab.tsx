
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';
import { RecipeFormState } from './recipes/types';

// Import the new components
import AuthRequiredState from './recipes/AuthRequiredState';
import RecipesLoading from './recipes/RecipesLoading';
import EmptyRecipesState from './recipes/EmptyRecipesState';
import RecipesHeader from './recipes/RecipesHeader';
import RecipeItem from './recipes/RecipeItem';
import CreateRecipeDialog from './recipes/CreateRecipeDialog';
import EditRecipeDialog from './recipes/EditRecipeDialog';

const UserRecipesTab: React.FC = () => {
  const { recipes, isLoading, createRecipe, updateRecipe, deleteRecipe } = useUserRecipes();
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<UserRecipe | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  // New recipe form state
  const [newRecipe, setNewRecipe] = useState<RecipeFormState>({
    name: '',
    description: '',
    ingredients: [],
    instructions: '',
    is_public: false
  });

  const handleAddIngredient = () => {
    if (newIngredient.trim() && newAmount.trim()) {
      if (editingRecipe) {
        setEditingRecipe({
          ...editingRecipe,
          ingredients: [
            ...editingRecipe.ingredients,
            { name: newIngredient.trim(), amount: newAmount.trim() }
          ]
        });
      } else {
        setNewRecipe({
          ...newRecipe,
          ingredients: [
            ...newRecipe.ingredients,
            { name: newIngredient.trim(), amount: newAmount.trim() }
          ]
        });
      }
      setNewIngredient('');
      setNewAmount('');
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

  const handleCreateRecipe = async () => {
    if (!newRecipe.name || !newRecipe.instructions || newRecipe.ingredients.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the recipe.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your recipe."
      });
      return;
    }

    try {
      await createRecipe.mutateAsync({
        name: newRecipe.name,
        description: newRecipe.description,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
        is_public: newRecipe.is_public,
        image_url: `https://placehold.co/300x200/9DB2BF/FFFFFF?text=${encodeURIComponent(newRecipe.name)}`
      });

      // Reset form and close modal
      setNewRecipe({
        name: '',
        description: '',
        ingredients: [],
        instructions: '',
        is_public: false
      });
      setIsCreatingRecipe(false);
    } catch (error) {
      console.error('Failed to create recipe:', error);
      // Error is handled by the mutation
    }
  };

  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;

    if (!editingRecipe.name || !editingRecipe.instructions || editingRecipe.ingredients.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the recipe.",
        variant: "destructive"
      });
      return;
    }

    try {
      await updateRecipe.mutateAsync({
        id: editingRecipe.id,
        name: editingRecipe.name,
        description: editingRecipe.description || '',
        ingredients: editingRecipe.ingredients,
        instructions: editingRecipe.instructions,
        is_public: editingRecipe.is_public,
        image_url: editingRecipe.image_url
      });

      setEditingRecipe(null);
    } catch (error) {
      console.error('Failed to update recipe:', error);
      // Error is handled by the mutation
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe.mutateAsync(recipeId);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
        // Error is handled by the mutation
      }
    }
  };

  const handleShareRecipe = (recipe: UserRecipe) => {
    toast({
      title: "Share recipe",
      description: `Sharing ${recipe.name} recipe (this is a demo feature).`
    });
  };

  // Form props for both create and edit forms
  const createFormProps = {
    formState: newRecipe,
    setFormState: setNewRecipe,
    newIngredient,
    setNewIngredient,
    newAmount,
    setNewAmount,
    handleAddIngredient,
    handleIngredientChange,
    handleRemoveIngredient
  };

  const editFormProps = editingRecipe ? {
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
    handleAddIngredient,
    handleIngredientChange,
    handleRemoveIngredient
  } : createFormProps;

  if (!user) {
    return <AuthRequiredState />;
  }

  return (
    <div className="space-y-6">
      <RecipesHeader onCreateClick={() => setIsCreatingRecipe(true)} />
      
      <CreateRecipeDialog
        isOpen={isCreatingRecipe}
        onOpenChange={setIsCreatingRecipe}
        onSubmit={handleCreateRecipe}
        isSubmitting={createRecipe.isPending}
        formProps={createFormProps}
      />
      
      <EditRecipeDialog
        recipe={editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onUpdate={handleUpdateRecipe}
        isUpdating={updateRecipe.isPending}
        formProps={editFormProps}
      />
      
      {isLoading ? (
        <RecipesLoading />
      ) : recipes.length === 0 ? (
        <EmptyRecipesState onCreate={() => setIsCreatingRecipe(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recipes.map(recipe => (
            <RecipeItem 
              key={recipe.id}
              recipe={recipe}
              onEdit={setEditingRecipe}
              onDelete={handleDeleteRecipe}
              onShare={handleShareRecipe}
              isDeleting={deleteRecipe.isPending}
              deletingId={deleteRecipe.variables}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecipesTab;
