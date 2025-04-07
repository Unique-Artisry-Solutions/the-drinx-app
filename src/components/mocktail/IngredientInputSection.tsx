
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, X, Asterisk } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

export interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

// Standard units of measure for cocktails
const UNITS_OF_MEASURE = [
  'oz', 'ml', 'cl', 'tbsp', 'tsp', 'dash', 'drop', 'cup', 'pcs', 'slice', 'sprig', 'leaves'
];

// Amount numbers for select
const AMOUNT_OPTIONS = [
  '0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.5', '3', '4', '5', '6', '8', '10'
];

interface IngredientInputSectionProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  newIngredient: string;
  setNewIngredient: React.Dispatch<React.SetStateAction<string>>;
  newAmount: string;
  setNewAmount: React.Dispatch<React.SetStateAction<string>>;
  newUnit?: string;
  setNewUnit?: React.Dispatch<React.SetStateAction<string>>;
}

const IngredientInputSection: React.FC<IngredientInputSectionProps> = ({
  ingredients,
  setIngredients,
  newIngredient,
  setNewIngredient,
  newAmount,
  setNewAmount,
  newUnit = 'oz',
  setNewUnit = () => {}
}) => {
  const { toast } = useToast();

  // Required field indicator component
  const RequiredField = () => (
    <Asterisk className="inline-block h-3 w-3 text-red-500 ml-1" />
  );

  const handleAddIngredient = () => {
    if (newIngredient.trim() && newAmount) {
      const formattedIngredient = {
        name: newIngredient.trim(),
        amount: newAmount,
        unit: newUnit
      };
      
      setIngredients([...ingredients, formattedIngredient]);
      setNewIngredient('');
      setNewAmount('1');
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
      <Label>
        Ingredients <RequiredField />
      </Label>
      
      <div className="flex space-x-2">
        <Select value={newAmount} onValueChange={setNewAmount}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Amount" />
          </SelectTrigger>
          <SelectContent>
            {AMOUNT_OPTIONS.map(amount => (
              <SelectItem key={amount} value={amount}>{amount}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={newUnit} onValueChange={setNewUnit}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {UNITS_OF_MEASURE.map(unit => (
              <SelectItem key={unit} value={unit}>{unit}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          value={newIngredient}
          onChange={(e) => setNewIngredient(e.target.value)}
          placeholder="Ingredient name"
          className="flex-2"
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
              {ingredient.amount} {ingredient.unit || ''} {ingredient.name}
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
