
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { useRecipeForm } from '@/hooks/recipes/useRecipeForm';
import { UserRecipe } from '@/types/DatabaseTypes';
import RecipeItem from './recipes/RecipeItem';
import CreateRecipeDialog from './recipes/CreateRecipeDialog';
import EditRecipeDialog from './recipes/EditRecipeDialog';
import SuggestToEstablishmentModal from './recipes/SuggestToEstablishmentModal';
import EmptyRecipesState from './recipes/EmptyRecipesState';
import RecipesLoading from './recipes/RecipesLoading';

interface UserRecipesTabProps {
  isPromoter?: boolean;
}

const UserRecipesTab: React.FC<UserRecipesTabProps> = ({ isPromoter = false }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<UserRecipe | null>(null);
  
  const { toast } = useToast();
  const { recipes, isLoading, error, createRecipe, updateRecipe, deleteRecipe } = useUserRecipes();
  const { 
    newRecipe, 
    editingRecipe, 
    setEditingRecipe, 
    resetForm,
    createFormProps,
    getEditFormProps
  } = useRecipeForm();

  // Handler for creating a new recipe
  const handleCreateRecipe = async () => {
    try {
      await createRecipe.mutateAsync({
        name: newRecipe.name,
        description: newRecipe.description || '',
        ingredients: newRecipe.ingredients || [],
        instructions: newRecipe.instructions,
        is_public: newRecipe.is_public,
        image_url: `https://placehold.co/300x200/CCCCCC/666666?text=${encodeURIComponent(newRecipe.name)}`
      });
      
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
  };

  // Handler for updating an existing recipe
  const handleUpdateRecipe = async () => {
    if (!editingRecipe) return;
    
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
    }
  };

  // Handler for deleting a recipe
  const handleDeleteRecipe = async (recipeId: string) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await deleteRecipe.mutateAsync(recipeId);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  // Handler for sharing a recipe
  const handleShareRecipe = (recipe: UserRecipe) => {
    // For now, just copy a link to clipboard
    navigator.clipboard.writeText(`${window.location.origin}/recipes/${recipe.id}`);
    toast({
      title: "Link copied",
      description: "Recipe link copied to clipboard"
    });
  };

  // Handler for suggesting a recipe to an establishment
  const handleSuggestToEstablishment = (recipe: UserRecipe) => {
    setSelectedRecipe(recipe);
    setShowSuggestModal(true);
  };

  if (isLoading) {
    return <RecipesLoading />;
  }

  if (error) {
    return (
      <Card className={isPromoter ? "border-purple-200" : ""}>
        <CardHeader>
          <CardTitle>My Mocktail Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-10">
            <p className="text-red-500 mb-5">Error loading recipes. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={isPromoter ? "border-purple-200" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Mocktail Recipes</CardTitle>
        <Button 
          type="button"
          onClick={() => setIsDialogOpen(true)}
          className={isPromoter ? "bg-purple-600 hover:bg-purple-700" : ""}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Recipe
        </Button>
      </CardHeader>
      
      <CardContent>
        {recipes.length === 0 ? (
          <EmptyRecipesState isPromoter={isPromoter} onCreateNew={() => setIsDialogOpen(true)} />
        ) : (
          <div className="space-y-6">
            {recipes.map(recipe => (
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
      </CardContent>

      {/* Create Recipe Dialog */}
      <CreateRecipeDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateRecipe}
        isSubmitting={createRecipe.isPending}
        formProps={createFormProps}
      />

      {/* Edit Recipe Dialog */}
      <EditRecipeDialog
        recipe={editingRecipe}
        onClose={() => setEditingRecipe(null)}
        onUpdate={handleUpdateRecipe}
        isUpdating={updateRecipe.isPending}
        formProps={getEditFormProps()}
      />

      {/* Suggest to Establishment Modal */}
      {showSuggestModal && selectedRecipe && (
        <SuggestToEstablishmentModal
          recipe={selectedRecipe}
          onClose={() => {
            setShowSuggestModal(false);
            setSelectedRecipe(null);
          }}
        />
      )}
    </Card>
  );
};

export default UserRecipesTab;
