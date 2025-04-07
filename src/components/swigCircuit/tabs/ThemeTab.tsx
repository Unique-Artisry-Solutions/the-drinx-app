
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ThemeSelection from '@/components/barCrawl/ThemeSelection';

interface ThemeTabProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  onBack: () => void;
  onContinue: () => void;
}

const ThemeTab: React.FC<ThemeTabProps> = ({
  selectedTheme,
  setSelectedTheme,
  onBack,
  onContinue
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ThemeSelection 
          selectedTheme={selectedTheme} 
          onThemeSelect={setSelectedTheme} 
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
            disabled={!selectedTheme}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Continue to Venue Selection
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeTab;
