
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassWater, PenSquare, Share2, Trash2, PlusCircle, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { UserRecipe, Ingredient } from '@/types/DatabaseTypes';
import { useAuth } from '@/contexts/auth';

const UserRecipesTab: React.FC = () => {
  const { recipes, isLoading, createRecipe, updateRecipe, deleteRecipe } = useUserRecipes();
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<UserRecipe | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // New recipe form state
  const [newRecipe, setNewRecipe] = useState<{
    name: string;
    description: string;
    ingredients: Ingredient[];
    instructions: string;
    is_public: boolean;
  }>({
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (!user) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center">
          <GlassWater className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium">Authentication Required</h3>
          <p className="text-muted-foreground mt-2 mb-6">Please log in to view and manage your recipes.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">My Drink Recipes</h2>
          <p className="text-sm text-muted-foreground">Create and manage your own mocktail recipes</p>
        </div>
        
        <Dialog open={isCreatingRecipe} onOpenChange={setIsCreatingRecipe}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto mt-2 sm:mt-0 bg-spiritless-pink hover:bg-spiritless-pink/90">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Recipe</DialogTitle>
              <DialogDescription>
                Share your mocktail creation with the community.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  className="col-span-3" 
                  value={newRecipe.name} 
                  onChange={e => setNewRecipe({
                    ...newRecipe,
                    name: e.target.value
                  })} 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea 
                  id="description" 
                  className="col-span-3" 
                  value={newRecipe.description} 
                  onChange={e => setNewRecipe({
                    ...newRecipe,
                    description: e.target.value
                  })} 
                />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Ingredients</Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Ingredient" 
                      value={newIngredient} 
                      onChange={e => setNewIngredient(e.target.value)} 
                      className="flex-1" 
                    />
                    <Input 
                      placeholder="Amount" 
                      value={newAmount} 
                      onChange={e => setNewAmount(e.target.value)} 
                      className="flex-1" 
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleAddIngredient}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {newRecipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input 
                        placeholder="Ingredient" 
                        value={ingredient.name} 
                        onChange={e => handleIngredientChange(index, 'name', e.target.value)} 
                        className="flex-1" 
                      />
                      <Input 
                        placeholder="Amount" 
                        value={ingredient.amount} 
                        onChange={e => handleIngredientChange(index, 'amount', e.target.value)} 
                        className="flex-1" 
                      />
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleRemoveIngredient(index)} 
                        disabled={newRecipe.ingredients.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="instructions" className="text-right pt-2">Instructions</Label>
                <Textarea 
                  id="instructions" 
                  className="col-span-3" 
                  rows={4} 
                  value={newRecipe.instructions} 
                  onChange={e => setNewRecipe({
                    ...newRecipe,
                    instructions: e.target.value
                  })} 
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-start-2 col-span-3 flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_public"
                    checked={newRecipe.is_public}
                    onChange={(e) => setNewRecipe({
                      ...newRecipe,
                      is_public: e.target.checked
                    })}
                    className="rounded border-gray-300 text-spiritless-pink"
                  />
                  <Label htmlFor="is_public">Make this recipe public for everyone to see</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreatingRecipe(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateRecipe} 
                disabled={createRecipe.isPending}
              >
                {createRecipe.isPending ? "Saving..." : "Save Recipe"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog 
          open={!!editingRecipe} 
          onOpenChange={(open) => !open && setEditingRecipe(null)}
        >
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            {editingRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Recipe</DialogTitle>
                  <DialogDescription>
                    Update your mocktail recipe.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                    <Input 
                      id="edit-name" 
                      className="col-span-3" 
                      value={editingRecipe.name} 
                      onChange={e => setEditingRecipe({
                        ...editingRecipe,
                        name: e.target.value
                      })} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">Description</Label>
                    <Textarea 
                      id="edit-description" 
                      className="col-span-3" 
                      value={editingRecipe.description || ''} 
                      onChange={e => setEditingRecipe({
                        ...editingRecipe,
                        description: e.target.value
                      })} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right pt-2">Ingredients</Label>
                    <div className="col-span-3 space-y-2">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Ingredient" 
                          value={newIngredient} 
                          onChange={e => setNewIngredient(e.target.value)} 
                          className="flex-1" 
                        />
                        <Input 
                          placeholder="Amount" 
                          value={newAmount} 
                          onChange={e => setNewAmount(e.target.value)} 
                          className="flex-1" 
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={handleAddIngredient}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {editingRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Input 
                            placeholder="Ingredient" 
                            value={ingredient.name} 
                            onChange={e => handleIngredientChange(index, 'name', e.target.value)} 
                            className="flex-1" 
                          />
                          <Input 
                            placeholder="Amount" 
                            value={ingredient.amount} 
                            onChange={e => handleIngredientChange(index, 'amount', e.target.value)} 
                            className="flex-1" 
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveIngredient(index)} 
                            disabled={editingRecipe.ingredients.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="edit-instructions" className="text-right pt-2">Instructions</Label>
                    <Textarea 
                      id="edit-instructions" 
                      className="col-span-3" 
                      rows={4} 
                      value={editingRecipe.instructions} 
                      onChange={e => setEditingRecipe({
                        ...editingRecipe,
                        instructions: e.target.value
                      })} 
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="col-start-2 col-span-3 flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="edit_is_public"
                        checked={editingRecipe.is_public}
                        onChange={(e) => setEditingRecipe({
                          ...editingRecipe,
                          is_public: e.target.checked
                        })}
                        className="rounded border-gray-300 text-spiritless-pink"
                      />
                      <Label htmlFor="edit_is_public">Make this recipe public for everyone to see</Label>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setEditingRecipe(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleUpdateRecipe}
                    disabled={updateRecipe.isPending}
                  >
                    {updateRecipe.isPending ? "Saving..." : "Update Recipe"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spiritless-pink"></div>
        </div>
      ) : recipes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <GlassWater className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium">No recipes yet</h3>
            <p className="text-muted-foreground mt-2 mb-6">You haven't created any mocktail recipes yet.</p>
            <Button onClick={() => setIsCreatingRecipe(true)}>Create Your First Recipe</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {recipes.map(recipe => (
            <Card key={recipe.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="sm:flex">
                <div className="sm:w-1/3">
                  <img 
                    src={recipe.image_url || 'https://placehold.co/300x200/CCCCCC/666666?text=Recipe+Image'} 
                    alt={recipe.name} 
                    className="h-40 sm:h-full w-full object-cover"
                  />
                </div>
                <div className="sm:w-2/3">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{recipe.name}</CardTitle>
                      <Badge variant="outline" className={`${recipe.is_public ? 'bg-green-50 text-green-700' : 'bg-spiritless-pink/10 text-spiritless-pink'}`}>
                        {recipe.is_public ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                    <CardDescription>{recipe.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Ingredients:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient.amount} {ingredient.name}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">Instructions:</h4>
                        <p className="text-sm text-muted-foreground">
                          {recipe.instructions}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4 pb-4">
                    <div className="text-xs text-muted-foreground">
                      Created: {formatDate(recipe.created_at)}
                      {recipe.updated_at && recipe.updated_at !== recipe.created_at && (
                        <> · Updated: {formatDate(recipe.updated_at)}</>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleShareRecipe(recipe)}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingRecipe(recipe)}
                      >
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        disabled={deleteRecipe.isPending && deleteRecipe.variables === recipe.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRecipesTab;
