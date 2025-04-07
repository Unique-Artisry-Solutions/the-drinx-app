
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface RecipesHeaderProps {
  onCreateClick: () => void;
}

const RecipesHeader: React.FC<RecipesHeaderProps> = ({ onCreateClick }) => {
  return (
    <div className="space-y-2 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground">My Drink Recipes</h2>
        <p className="text-sm text-muted-foreground">Create and manage your own mocktail recipes</p>
      </div>
      
      <Button 
        className="w-full sm:w-auto mt-2 sm:mt-0 bg-spiritless-pink hover:bg-spiritless-pink/90"
        onClick={onCreateClick}
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Create Recipe
      </Button>
    </div>
  );
};

export default RecipesHeader;
