
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X } from 'lucide-react';
import { useMocktailSuggestions } from '@/hooks/useMocktailSuggestions';
import { useAuth } from '@/contexts/auth';

interface SuggestMocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: string;
  establishmentName: string;
}

const SuggestMocktailModal: React.FC<SuggestMocktailModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
  establishmentName
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [newIngredient, setNewIngredient] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string }[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const { suggestMocktail } = useMocktailSuggestions();

  const handleAddIngredient = () => {
    if (newIngredient.trim() && newAmount.trim()) {
      setIngredients([...ingredients, { 
        name: newIngredient.trim(), 
        amount: newAmount.trim() 
      }]);
      setNewIngredient('');
      setNewAmount('');
    } else {
      toast({ 
        title: "Missing information", 
        description: "Please enter both ingredient name and amount."
      });
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

    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to submit your suggestion." 
      });
      return;
    }

    try {
      await suggestMocktail.mutateAsync({
        name,
        description,
        ingredients,
        instructions,
        establishment_id: establishmentId,
        user_id: user.id
      });

      // Clear form and close modal
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to suggest mocktail:', error);
      // Error is handled by the mutation
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setInstructions('');
    setIngredients([]);
    setNewIngredient('');
    setNewAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Suggest a Mocktail</DialogTitle>
          <DialogDescription>
            Share your mocktail recipe idea with {establishmentName}. If they like it, they might add it to their menu!
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
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Ingredients</Label>
            
            <div className="flex space-x-2">
              <Input
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                placeholder="Ingredient name"
                className="flex-1"
              />
              <Input
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Amount"
                className="flex-1"
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
                    {ingredient.amount} {ingredient.name}
                    <button 
                      type="button"
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
            disabled={suggestMocktail.isPending}
          >
            {suggestMocktail.isPending ? "Submitting..." : "Submit Suggestion"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestMocktailModal;
