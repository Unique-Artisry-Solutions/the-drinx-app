
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X } from 'lucide-react';

export interface Ingredient {
  name: string;
  amount: string;
}

interface IngredientInputSectionProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  newIngredient: string;
  setNewIngredient: React.Dispatch<React.SetStateAction<string>>;
  newAmount: string;
  setNewAmount: React.Dispatch<React.SetStateAction<string>>;
}

const IngredientInputSection: React.FC<IngredientInputSectionProps> = ({
  ingredients,
  setIngredients,
  newIngredient,
  setNewIngredient,
  newAmount,
  setNewAmount
}) => {
  const { toast } = useToast();

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

  return (
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
  );
};

export default IngredientInputSection;
