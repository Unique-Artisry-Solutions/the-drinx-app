
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyRecipesStateProps {
  isPromoter?: boolean;
  onCreateNew: () => void;
}

const EmptyRecipesState: React.FC<EmptyRecipesStateProps> = ({ isPromoter = false, onCreateNew }) => {
  return (
    <div className="text-center py-10">
      <p className="text-gray-500 mb-5">
        {isPromoter 
          ? "As a promoter, you can create signature mocktail recipes for venues."
          : "You haven't created any recipes yet. Share your favorite mocktail creations!"}
      </p>
      <Button 
        type="button"
        onClick={onCreateNew}
        className={isPromoter ? "bg-purple-600 hover:bg-purple-700" : ""}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Create New Recipe
      </Button>
    </div>
  );
};

export default EmptyRecipesState;
