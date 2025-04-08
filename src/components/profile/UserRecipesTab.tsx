
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { UserRecipe } from '@/types/DatabaseTypes';

// Import the new hook
import { useRecipeForm } from '@/hooks/recipes/useRecipeForm';

// Import the components
import AuthRequiredState from './recipes/AuthRequiredState';
import RecipesLoading from './recipes/RecipesLoading';
import EmptyRecipesState from './recipes/EmptyRecipesState';
import RecipesHeader from './recipes/RecipesHeader';
import RecipeItem from './recipes/RecipeItem';
import CreateRecipeDialog from './recipes/CreateRecipeDialog';
import EditRecipeDialog from './recipes/EditRecipeDialog';
import SuggestToEstablishmentModal from './recipes/SuggestToEstablishmentModal';

const UserRecipesTab: React.FC = () => {
  const { recipes = [], isLoading, createRecipe, updateRecipe, deleteRecipe } = useUserRecipes();
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [selectedRecipeForSuggestion, setSelectedRecipeForSuggestion] = useState<UserRecipe | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdminBypass = localStorage.getItem('admin_bypass') === 'true';
  
  // Use our custom hook for form logic
  const {
    newRecipe,
    editingRecipe,
    setEditingRecipe,
    resetForm,
    createFormProps,
    getEditFormProps
  } = useRecipeForm();

  const handleCreateRecipe = async () => {
    if (!newRecipe.name || !newRecipe.instructions || !newRecipe.ingredients || newRecipe.ingredients.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields for the recipe.",
        variant: "destructive"
      });
      return;
    }

    if (!user && !isAdminBypass) {
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
      resetForm();
      setIsCreatingRecipe(false);
    } catch (error) {
      console.error('Failed to create recipe:', error);
      // Error is handled by the mutation
    }
  };

  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;

    if (!editingRecipe.name || !editingRecipe.instructions || !editingRecipe.ingredients || editingRecipe.ingredients.length === 0) {
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
        ingredients: editingRecipe.ingredients || [],
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

  const handleSuggestToEstablishment = (recipe: UserRecipe) => {
    setSelectedRecipeForSuggestion(recipe);
    setIsSuggestModalOpen(true);
  };

  // Allow access for either authenticated users or admin bypass
  if (!user && !isAdminBypass) {
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
        formProps={getEditFormProps()}
      />
      
      <SuggestToEstablishmentModal
        open={isSuggestModalOpen}
        onOpenChange={setIsSuggestModalOpen}
        recipe={selectedRecipeForSuggestion}
      />
      
      {isLoading ? (
        <RecipesLoading />
      ) : recipes && recipes.length === 0 ? (
        <EmptyRecipesState onCreate={() => setIsCreatingRecipe(true)} />
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recipes && recipes.map(recipe => (
            <RecipeItem 
              key={recipe.id}
              recipe={recipe}
              onEdit={setEditingRecipe}
              onDelete={handleDeleteRecipe}
              onShare={handleShareRecipe}
              onSuggestToEstablishment={handleSuggestToEstablishment}
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
