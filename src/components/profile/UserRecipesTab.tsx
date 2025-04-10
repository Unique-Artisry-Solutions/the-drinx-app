
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface UserRecipesTabProps {
  isPromoter?: boolean;
}

const UserRecipesTab: React.FC<UserRecipesTabProps> = ({ isPromoter = false }) => {
  return (
    <Card className={isPromoter ? "border-purple-200" : ""}>
      <CardHeader>
        <CardTitle>My Mocktail Recipes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-10">
          <p className="text-gray-500 mb-5">
            {isPromoter 
              ? "As a promoter, you can create signature mocktail recipes for venues."
              : "You haven't created any recipes yet. Share your favorite mocktail creations!"}
          </p>
          <Button className={isPromoter ? "bg-purple-600 hover:bg-purple-700" : ""}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Recipe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserRecipesTab;
