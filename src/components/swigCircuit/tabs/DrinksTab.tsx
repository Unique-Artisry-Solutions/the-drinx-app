
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipForward } from 'lucide-react';
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
          drinkHighlights={drinkHighlights}
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
          
          <div className="space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onContinue}
              className="flex items-center"
            >
              <SkipForward size={16} className="mr-2" />
              Skip
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
        </div>
      </CardContent>
    </Card>
  );
};

export default DrinksTab;
