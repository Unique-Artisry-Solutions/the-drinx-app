import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassWater, PenSquare, Share2, Trash2, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type Ingredient = {
  name: string;
  amount: string;
};

type Recipe = {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string;
  image?: string;
  createdAt: Date;
};

const UserRecipesTab: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('user_recipes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Convert string dates back to Date objects
        return parsed.map((recipe: any) => ({
          ...recipe,
          createdAt: new Date(recipe.createdAt)
        }));
      } catch (e) {
        console.error('Failed to parse saved recipes', e);
        return [];
      }
    }
    return [{
      id: '1',
      name: 'Virgin Mojito',
      description: 'A refreshing non-alcoholic take on the classic mojito.',
      ingredients: [{
        name: 'Lime',
        amount: '1, cut into wedges'
      }, {
        name: 'Fresh mint leaves',
        amount: '10-12 leaves'
      }, {
        name: 'Sugar',
        amount: '2 tablespoons'
      }, {
        name: 'Club soda',
        amount: '1 cup'
      }, {
        name: 'Ice cubes',
        amount: 'as needed'
      }],
      instructions: 'Muddle the mint leaves with sugar and lime in a glass. Fill with ice cubes and top with club soda. Stir gently and garnish with additional mint leaves.',
      image: 'https://placehold.co/300x200/9DB2BF/FFFFFF?text=Virgin+Mojito',
      createdAt: new Date('2023-05-15')
    }, {
      id: '2',
      name: 'Berry Splash',
      description: 'A fruity, colorful mocktail perfect for summer days.',
      ingredients: [{
        name: 'Mixed berries',
        amount: '1/2 cup'
      }, {
        name: 'Lemon juice',
        amount: '2 tablespoons'
      }, {
        name: 'Simple syrup',
        amount: '1 ounce'
      }, {
        name: 'Sparkling water',
        amount: '1 cup'
      }, {
        name: 'Ice cubes',
        amount: 'as needed'
      }],
      instructions: 'Blend berries, lemon juice, and simple syrup until smooth. Strain into a glass filled with ice and top with sparkling water. Stir gently and garnish with fresh berries.',
      image: 'https://placehold.co/300x200/A367B1/FFFFFF?text=Berry+Splash',
      createdAt: new Date('2023-06-22')
    }];
  });

  const [newRecipe, setNewRecipe] = useState<Omit<Recipe, 'id' | 'createdAt'>>({
    name: '',
    description: '',
    ingredients: [{
      name: '',
      amount: ''
    }],
    instructions: '',
    image: 'https://placehold.co/300x200/CCCCCC/666666?text=New+Recipe'
  });

  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();

  const saveToLocalStorage = (updatedRecipes: Recipe[]) => {
    localStorage.setItem('user_recipes', JSON.stringify(updatedRecipes));
  };

  const handleAddIngredient = () => {
    if (editingRecipe) {
      setEditingRecipe({
        ...editingRecipe,
        ingredients: [...editingRecipe.ingredients, {
          name: '',
          amount: ''
        }]
      });
    } else {
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, {
          name: '',
          amount: ''
        }]
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

  const handleCreateRecipe = () => {
    if (!newRecipe.name || !newRecipe.instructions || newRecipe.ingredients.some(i => !i.name || !i.amount)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the recipe.",
        variant: "destructive"
      });
      return;
    }
    const recipeToAdd: Recipe = {
      id: Date.now().toString(),
      ...newRecipe,
      createdAt: new Date()
    };
    const updatedRecipes = [...recipes, recipeToAdd];
    setRecipes(updatedRecipes);
    saveToLocalStorage(updatedRecipes);

    setNewRecipe({
      name: '',
      description: '',
      ingredients: [{
        name: '',
        amount: ''
      }],
      instructions: '',
      image: 'https://placehold.co/300x200/CCCCCC/666666?text=New+Recipe'
    });
    setIsCreatingRecipe(false);
    toast({
      title: "Recipe created",
      description: "Your new recipe has been saved."
    });
  };

  const handleUpdateRecipe = () => {
    if (!editingRecipe) return;

    if (!editingRecipe.name || !editingRecipe.instructions || editingRecipe.ingredients.some(i => !i.name || !i.amount)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the recipe.",
        variant: "destructive"
      });
      return;
    }
    const updatedRecipes = recipes.map(recipe => recipe.id === editingRecipe.id ? editingRecipe : recipe);
    setRecipes(updatedRecipes);
    saveToLocalStorage(updatedRecipes);
    setEditingRecipe(null);
    toast({
      title: "Recipe updated",
      description: "Your recipe has been updated successfully."
    });
  };

  const handleDeleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    setRecipes(updatedRecipes);
    saveToLocalStorage(updatedRecipes);
    toast({
      title: "Recipe deleted",
      description: "Your recipe has been deleted."
    });
  };

  const handleShareRecipe = (recipe: Recipe) => {
    toast({
      title: "Share recipe",
      description: `Sharing ${recipe.name} recipe (this is a demo feature).`
    });
  };

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
                <Input id="name" className="col-span-3" value={newRecipe.name} onChange={e => setNewRecipe({
                ...newRecipe,
                name: e.target.value
              })} />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" className="col-span-3" value={newRecipe.description} onChange={e => setNewRecipe({
                ...newRecipe,
                description: e.target.value
              })} />
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Ingredients</Label>
                <div className="col-span-3 space-y-2">
                  {newRecipe.ingredients.map((ingredient, index) => <div key={index} className="flex gap-2 items-center">
                      <Input placeholder="Ingredient" value={ingredient.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className="flex-1" />
                      <Input placeholder="Amount" value={ingredient.amount} onChange={e => handleIngredientChange(index, 'amount', e.target.value)} className="flex-1" />
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)} disabled={newRecipe.ingredients.length === 1}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>)}
                  <Button variant="outline" size="sm" onClick={handleAddIngredient} className="mt-2">
                    Add Ingredient
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="instructions" className="text-right pt-2">Instructions</Label>
                <Textarea id="instructions" className="col-span-3" rows={4} value={newRecipe.instructions} onChange={e => setNewRecipe({
                ...newRecipe,
                instructions: e.target.value
              })} />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingRecipe(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRecipe}>
                Save Recipe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={!!editingRecipe} onOpenChange={open => !open && setEditingRecipe(null)}>
          <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
            {editingRecipe && <>
                <DialogHeader>
                  <DialogTitle>Edit Recipe</DialogTitle>
                  <DialogDescription>
                    Update your mocktail recipe.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">Name</Label>
                    <Input id="edit-name" className="col-span-3" value={editingRecipe.name} onChange={e => setEditingRecipe({
                  ...editingRecipe,
                  name: e.target.value
                })} />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-description" className="text-right">Description</Label>
                    <Textarea id="edit-description" className="col-span-3" value={editingRecipe.description} onChange={e => setEditingRecipe({
                  ...editingRecipe,
                  description: e.target.value
                })} />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <Label className="text-right pt-2">Ingredients</Label>
                    <div className="col-span-3 space-y-2">
                      {editingRecipe.ingredients.map((ingredient, index) => <div key={index} className="flex gap-2 items-center">
                          <Input placeholder="Ingredient" value={ingredient.name} onChange={e => handleIngredientChange(index, 'name', e.target.value)} className="flex-1" />
                          <Input placeholder="Amount" value={ingredient.amount} onChange={e => handleIngredientChange(index, 'amount', e.target.value)} className="flex-1" />
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveIngredient(index)} disabled={editingRecipe.ingredients.length === 1}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>)}
                      <Button variant="outline" size="sm" onClick={handleAddIngredient} className="mt-2">
                        Add Ingredient
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="edit-instructions" className="text-right pt-2">Instructions</Label>
                    <Textarea id="edit-instructions" className="col-span-3" rows={4} value={editingRecipe.instructions} onChange={e => setEditingRecipe({
                  ...editingRecipe,
                  instructions: e.target.value
                })} />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingRecipe(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateRecipe}>
                    Update Recipe
                  </Button>
                </DialogFooter>
              </>}
          </DialogContent>
        </Dialog>
      </div>
      
      {recipes.length === 0 ? (
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
                    src={recipe.image || 'https://placehold.co/300x200/CCCCCC/666666?text=Recipe+Image'} 
                    alt={recipe.name} 
                    className="h-40 sm:h-full w-full object-cover"
                  />
                </div>
                <div className="sm:w-2/3">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{recipe.name}</CardTitle>
                      <Badge variant="outline" className="bg-spiritless-pink/10 text-spiritless-pink">
                        Mocktail
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
                      Created: {recipe.createdAt.toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleShareRecipe(recipe)}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setEditingRecipe(recipe)}>
                        <PenSquare className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteRecipe(recipe.id)}>
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
