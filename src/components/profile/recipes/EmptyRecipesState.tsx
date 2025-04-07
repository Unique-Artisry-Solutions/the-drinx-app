
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassWater } from 'lucide-react';

interface EmptyRecipesStateProps {
  onCreate: () => void;
}

const EmptyRecipesState: React.FC<EmptyRecipesStateProps> = ({ onCreate }) => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 text-center">
        <GlassWater className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No recipes yet</h3>
        <p className="text-muted-foreground mt-2 mb-6">You haven't created any mocktail recipes yet.</p>
        <Button onClick={onCreate}>Create Your First Recipe</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyRecipesState;
