
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface RecipesTabContentProps {
  isPromoter?: boolean;
}

const RecipesTabContent: React.FC<RecipesTabContentProps> = ({ isPromoter = false }) => {
  // Different content for promoter vs regular user
  const emptyStateMessage = isPromoter
    ? "As a promoter, you can suggest signature mocktails for venues. Create your first recipe!"
    : "You haven't created any mocktail recipes yet. Create your first recipe!";
    
  const buttonClass = isPromoter
    ? "bg-purple-600 hover:bg-purple-700"
    : "";
    
  return (
    <div className="space-y-4">
      <Card className={isPromoter ? "border-purple-100" : ""}>
        <CardHeader>
          <CardTitle className="text-lg">My Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{emptyStateMessage}</p>
            <Button className={buttonClass}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Recipe
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecipesTabContent;
