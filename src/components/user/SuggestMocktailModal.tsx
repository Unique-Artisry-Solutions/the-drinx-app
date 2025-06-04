import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { createMocktailSuggestion } from '@/services/mocktailService';
import { useToast } from "@/hooks/use-toast"

interface SuggestMocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishmentId: string;
  establishmentName: string;
}

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit?: string;
}

const SuggestMocktailModal: React.FC<SuggestMocktailModalProps> = ({
  isOpen,
  onClose,
  establishmentId,
  establishmentName
}) => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ id: '1', name: '', amount: '' }]);
  const [instructions, setInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createSuggestion = useMutation(createMocktailSuggestion, {
    onSuccess: () => {
      toast({
        title: "Suggestion submitted!",
        description: "Your mocktail suggestion has been sent to the establishment.",
      })
      onClose();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to submit suggestion. Please try again.",
      })
    },
  });

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: String(ingredients.length + 1), name: '', amount: '' }]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
  };

  const handleIngredientChange = (id: string, field: string, value: string) => {
    setIngredients(ingredients.map(ingredient =>
      ingredient.id === id ? { ...ingredient, [field]: value } : ingredient
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || ingredients.length === 0) return;

    setIsSubmitting(true);
    try {
      // Convert ingredients to string array format for database
      const ingredientStrings = ingredients.map(ing => 
        ing.unit ? `${ing.amount} ${ing.unit} ${ing.name}` : `${ing.amount} ${ing.name}`
      );

      await createSuggestion.mutateAsync({
        name: name.trim(),
        ingredients: ingredientStrings,
        instructions: instructions.trim(),
        establishment_id: establishmentId
      });

      toast({
        title: "Suggestion submitted!",
        description: "Your mocktail suggestion has been sent to the establishment.",
      });
      onClose();
      setName('');
      setIngredients([{ id: '1', name: '', amount: '' }]);
      setInstructions('');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Failed to submit suggestion. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Suggest a Mocktail</DialogTitle>
          <DialogDescription>
            Suggest a new mocktail to {establishmentName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Mocktail Name
              </Label>
              <Input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="col-span-4">
              <Label htmlFor="ingredients">Ingredients</Label>
              {ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex items-center space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'amount', e.target.value)}
                    className="w-24"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Unit (e.g., oz, ml)"
                    value={ingredient.unit || ''}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'unit', e.target.value)}
                    className="w-24"
                  />
                  <Input
                    type="text"
                    placeholder="Ingredient Name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)}
                    className="flex-1"
                    required
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddIngredient}>
                <Plus className="h-4 w-4 mr-2" />
                Add Ingredient
              </Button>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="instructions" className="text-right mt-2">
                Instructions
              </Label>
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestMocktailModal;
