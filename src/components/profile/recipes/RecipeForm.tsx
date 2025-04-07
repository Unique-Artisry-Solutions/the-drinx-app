
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { RecipeFormProps } from './types';

const RecipeForm: React.FC<RecipeFormProps> = ({
  formState,
  setFormState,
  newIngredient,
  setNewIngredient,
  newAmount,
  setNewAmount,
  handleAddIngredient,
  handleIngredientChange,
  handleRemoveIngredient
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Name</Label>
        <Input 
          id="name" 
          className="col-span-3" 
          value={formState.name} 
          onChange={e => setFormState({
            ...formState,
            name: e.target.value
          })} 
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
          
          {formState.ingredients.map((ingredient, index) => (
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
                disabled={formState.ingredients.length === 1}
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
          value={formState.instructions} 
          onChange={e => setFormState({
            ...formState,
            instructions: e.target.value
          })} 
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
