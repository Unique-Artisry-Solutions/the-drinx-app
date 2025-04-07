
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DrinkHighlights, { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';

interface DrinksTabProps {
  drinkHighlights: DrinkHighlight[];
  setDrinkHighlights: (highlights: DrinkHighlight[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

const DrinksTab: React.FC<DrinksTabProps> = ({
  drinkHighlights,
  setDrinkHighlights,
  onBack,
  onContinue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Featured Drinks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DrinkHighlights 
          highlights={drinkHighlights}
          onHighlightsChange={setDrinkHighlights}
        />
        
        <div className="flex justify-between space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button 
            type="button"
            onClick={onContinue}
            disabled={drinkHighlights.length === 0}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Continue to Pairings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrinksTab;
