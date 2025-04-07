
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Asterisk } from 'lucide-react';
import { RecipeFormProps } from './types';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

// Standard units of measure for cocktails
const UNITS_OF_MEASURE = [
  'oz', 'ml', 'cl', 'tbsp', 'tsp', 'dash', 'drop', 'cup', 'pcs', 'slice', 'sprig', 'leaves'
];

// Amount numbers for select
const AMOUNT_OPTIONS = [
  '0.25', '0.5', '0.75', '1', '1.25', '1.5', '1.75', '2', '2.5', '3', '4', '5', '6', '8', '10'
];

const RecipeForm: React.FC<RecipeFormProps> = ({
  formState,
  setFormState,
  newIngredient,
  setNewIngredient,
  newAmount,
  setNewAmount,
  handleAddIngredient,
  handleIngredientChange,
  handleRemoveIngredient,
  newUnit = 'oz',
  setNewUnit = () => {}
}) => {
  // Required field indicator component
  const RequiredField = () => (
    <Asterisk className="inline-block h-3 w-3 text-red-500 ml-1" />
  );

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name <RequiredField />
        </Label>
        <Input 
          id="name" 
          className="col-span-3" 
          value={formState.name} 
          onChange={e => setFormState({
            ...formState,
            name: e.target.value
          })} 
          required
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">Description</Label>
        <Textarea 
          id="description" 
          className="col-span-3" 
          value={formState.description} 
          onChange={e => setFormState({
            ...formState,
            description: e.target.value
          })} 
        />
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        <Label className="text-right pt-2">
          Ingredients <RequiredField />
        </Label>
        <div className="col-span-3 space-y-2">
          <div className="flex gap-2">
            <Select 
              value={newAmount} 
              onValueChange={setNewAmount}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Amount" />
              </SelectTrigger>
              <SelectContent>
                {AMOUNT_OPTIONS.map(amount => (
                  <SelectItem key={amount} value={amount}>{amount}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select 
              value={newUnit} 
              onValueChange={setNewUnit}
            >
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                {UNITS_OF_MEASURE.map(unit => (
                  <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input 
              placeholder="Ingredient" 
              value={newIngredient} 
              onChange={e => setNewIngredient(e.target.value)} 
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
          
          {formState.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input 
                placeholder="Amount" 
                value={ingredient.amount} 
                onChange={e => handleIngredientChange(index, 'amount', e.target.value)} 
                className="w-24" 
              />
              <Input 
                placeholder="Unit" 
                value={ingredient.unit || 'oz'} 
                onChange={e => handleIngredientChange(index, 'unit', e.target.value)} 
                className="w-24" 
              />
              <Input 
                placeholder="Ingredient" 
                value={ingredient.name} 
                onChange={e => handleIngredientChange(index, 'name', e.target.value)} 
                className="flex-1" 
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => handleRemoveIngredient(index)} 
                disabled={formState.ingredients.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="instructions" className="text-right pt-2">
          Instructions <RequiredField />
        </Label>
        <Textarea 
          id="instructions" 
          className="col-span-3" 
          rows={4} 
          value={formState.instructions} 
          onChange={e => setFormState({
            ...formState,
            instructions: e.target.value
          })} 
          required
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-start-2 col-span-3 flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_public"
            checked={formState.is_public}
            onChange={(e) => setFormState({
              ...formState,
              is_public: e.target.checked
            })}
            className="rounded border-gray-300 text-spiritless-pink"
          />
          <Label htmlFor="is_public">Make this recipe public for everyone to see</Label>
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
