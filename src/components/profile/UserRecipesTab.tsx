
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import RecipeItem from './recipes/RecipeItem';
import CreateRecipeDialog from './recipes/CreateRecipeDialog';
import EditRecipeDialog from './recipes/EditRecipeDialog';
import { UserRecipe } from '@/types/DatabaseTypes';
import { useRecipeForm } from '@/hooks/recipes/useRecipeForm';
import { toast } from 'sonner';
import { useAppNavigation } from '@/hooks/useAppNavigation';

interface UserRecipesTabProps {
  isPromoter?: boolean;
  navigation?: ReturnType<typeof useAppNavigation>;
}

const UserRecipesTab: React.FC<UserRecipesTabProps> = ({ isPromoter = false, navigation }) => {
  const {
    recipes,
    isLoading,
    error,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    navigate
  } = useUserRecipes();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<UserRecipe | null>(null);

  const {
    formState: createFormState,
    setFormState: setCreateFormState,
    newIngredient: createNewIngredient,
    setNewIngredient: setCreateNewIngredient,
    newAmount: createNewAmount,
    setNewAmount: setCreateNewAmount,
    newUnit: createNewUnit,
    setNewUnit: setCreateNewUnit,
    handleAddIngredient: handleAddCreateIngredient,
    handleIngredientChange: handleCreateIngredientChange,
    handleRemoveIngredient: handleRemoveCreateIngredient,
    resetForm: resetCreateForm
  } = useRecipeForm();

  const {
    formState: editFormState,
    setFormState: setEditFormState,
    newIngredient: editNewIngredient,
    setNewIngredient: setEditNewIngredient,
    newAmount: editNewAmount,
    setNewAmount: setEditNewAmount,
    newUnit: editNewUnit,
    setNewUnit: setEditNewUnit,
    handleAddIngredient: handleAddEditIngredient,
    handleIngredientChange: handleEditIngredientChange,
    handleRemoveIngredient: handleRemoveEditIngredient,
    resetForm: resetEditForm
  } = useRecipeForm();

  // Handlers
  const handleCreateRecipe = async () => {
    try {
      await createRecipe.mutateAsync({
        name: createFormState.name,
        description: createFormState.description,
        ingredients: createFormState.ingredients,
        instructions: createFormState.instructions,
        is_public: createFormState.is_public,
        image_url: null
      });
      
      resetCreateForm();
      setCreateDialogOpen(false);
      toast.success("Recipe created successfully!");
    } catch (error) {
      console.error("Error creating recipe:", error);
      toast.error("Failed to create recipe. Please try again.");
    }
  };

  const handleOpenEdit = (recipe: UserRecipe) => {
    setEditingRecipe(recipe);
    setEditFormState({
      name: recipe.name,
      description: recipe.description || '',
      ingredients: recipe.ingredients || [],
      instructions: recipe.instructions || '',
      is_public: recipe.is_public
    });
  };

  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;
    
    try {
      await updateRecipe.mutateAsync({
        id: editingRecipe.id,
        name: editFormState.name,
        description: editFormState.description,
        ingredients: editFormState.ingredients,
        instructions: editFormState.instructions,
        is_public: editFormState.is_public,
        image_url: editingRecipe.image_url
      });
      
      setEditingRecipe(null);
      toast.success("Recipe updated successfully!");
    } catch (error) {
      console.error("Error updating recipe:", error);
      toast.error("Failed to update recipe. Please try again.");
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        await deleteRecipe.mutateAsync(recipeId);
        toast.success("Recipe deleted successfully!");
      } catch (error) {
        console.error("Error deleting recipe:", error);
        toast.error("Failed to delete recipe. Please try again.");
      }
    }
  };

  const handleShareRecipe = (recipe: UserRecipe) => {
    // Implement sharing functionality
    toast.info(`Sharing recipe: ${recipe.name}`);
  };

  const handleSuggestToEstablishment = (recipe: UserRecipe) => {
    // Implement establishment suggestion
    toast.info(`Recipe ${recipe.name} will be suggested to establishments`);
  };

  // If we are still loading or there's an error
  if (isLoading) {
    return (
      <Card className={isPromoter ? "border-purple-200" : ""}>
        <CardHeader>
          <CardTitle>My Mocktail Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-gray-500">Loading your recipes...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={isPromoter ? "border-purple-200" : ""}>
        <CardHeader>
          <CardTitle>My Mocktail Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-red-500">Error loading recipes. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If we have no recipes
  if (recipes.length === 0) {
    return (
      <Card className={isPromoter ? "border-purple-200" : ""}>
        <CardHeader>
          <CardTitle>My Mocktail Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-gray-500 mb-5">
              {isPromoter 
                ? "As a promoter, you can create signature mocktail recipes for venues."
                : "You haven't created any recipes yet. Share your favorite mocktail creations!"}
            </p>
            <Button 
              className={isPromoter ? "bg-purple-600 hover:bg-purple-700" : ""}
              onClick={() => setCreateDialogOpen(true)}
              type="button"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Display the recipes
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Recipes</h2>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className={isPromoter ? "bg-purple-600 hover:bg-purple-700" : ""}
          type="button"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Recipe
        </Button>
      </div>

      <div className="space-y-6">
        {recipes.map(recipe => (
          <RecipeItem
            key={recipe.id}
            recipe={recipe}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteRecipe}
            onShare={handleShareRecipe}
            onSuggestToEstablishment={handleSuggestToEstablishment}
            isDeleting={deleteRecipe.isPending}
            deletingId={deleteRecipe.variables}
          />
        ))}
      </div>

      {/* Create Recipe Dialog */}
      <CreateRecipeDialog
        isOpen={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateRecipe}
        isSubmitting={createRecipe.isPending}
        formProps={{
          formState: createFormState,
          setFormState: setCreateFormState,
          newIngredient: createNewIngredient,
          setNewIngredient: setCreateNewIngredient,
          newAmount: createNewAmount,
          setNewAmount: setCreateNewAmount,
          newUnit: createNewUnit,
          setNewUnit: setCreateNewUnit,
          handleAddIngredient: handleAddCreateIngredient,
          handleIngredientChange: handleCreateIngredientChange,
          handleRemoveIngredient: handleRemoveCreateIngredient,
        }}
      />

      {/* Edit Recipe Dialog */}
      <EditRecipeDialog
        recipe={editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onUpdate={handleUpdateRecipe}
        isUpdating={updateRecipe.isPending}
        formProps={{
          formState: editFormState,
          setFormState: setEditFormState,
          newIngredient: editNewIngredient,
          setNewIngredient: setEditNewIngredient,
          newAmount: editNewAmount,
          setNewAmount: setEditNewAmount,
          newUnit: editNewUnit,
          setNewUnit: setEditNewUnit,
          handleAddIngredient: handleAddEditIngredient,
          handleIngredientChange: handleEditIngredientChange,
          handleRemoveIngredient: handleRemoveEditIngredient,
        }}
      />
    </div>
  );
};

export default UserRecipesTab;
