
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Cocktail, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateMocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateMocktailModal: React.FC<CreateMocktailModalProps> = ({
  isOpen,
  onClose
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate form
    if (!name.trim()) {
      toast({ title: "Error", description: "Please enter a name for your mocktail." });
      return;
    }
    if (ingredients.length === 0) {
      toast({ title: "Error", description: "Please add at least one ingredient." });
      return;
    }
    if (!instructions.trim()) {
      toast({ title: "Error", description: "Please enter instructions for your mocktail." });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to save the mocktail recipe
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Recipe created",
        description: "Your mocktail recipe has been saved successfully."
      });

      // Clear form and close modal
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIngredients([]);
    setNewIngredient('');
    setInstructions('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cocktail className="h-5 w-5 text-spiritless-pink" />
            Create Mocktail Recipe
          </DialogTitle>
          <DialogDescription>
            Share your mocktail recipe with the community. Be creative!
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Mocktail Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a catchy name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the flavors and experience"
              rows={2}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Ingredients</Label>
            
            <div className="flex space-x-2">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Add an ingredient"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient();
                  }
                }}
              />
              <Button 
                type="button" 
                onClick={handleAddIngredient}
                variant="outline"
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
            
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {ingredients.map((ingredient, index) => (
                  <div 
                    key={index} 
                    className="bg-material-secondary-container text-material-on-secondary-container px-2 py-1 rounded-full text-sm flex items-center"
                  >
                    {ingredient}
                    <button 
                      onClick={() => handleRemoveIngredient(index)}
                      className="ml-1 text-material-on-secondary-container/70 hover:text-material-on-secondary-container"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="How to prepare the mocktail"
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            {isSubmitting ? "Saving..." : "Save Recipe"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMocktailModal;
