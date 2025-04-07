
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Ingredient } from './IngredientInputSection';
import IngredientInputSection from './IngredientInputSection';

interface BasicMocktailFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  instructions: string;
  setInstructions: React.Dispatch<React.SetStateAction<string>>;
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
  newIngredient: string;
  setNewIngredient: React.Dispatch<React.SetStateAction<string>>;
  newAmount: string;
  setNewAmount: React.Dispatch<React.SetStateAction<string>>;
}

const BasicMocktailForm: React.FC<BasicMocktailFormProps> = ({
  name,
  setName,
  description,
  setDescription,
  instructions,
  setInstructions,
  ingredients,
  setIngredients,
  newIngredient,
  setNewIngredient,
  newAmount,
  setNewAmount
}) => {
  return (
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
      
      <IngredientInputSection
        ingredients={ingredients}
        setIngredients={setIngredients}
        newIngredient={newIngredient}
        setNewIngredient={setNewIngredient}
        newAmount={newAmount}
        setNewAmount={setNewAmount}
      />
      
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
  );
};

export default BasicMocktailForm;
