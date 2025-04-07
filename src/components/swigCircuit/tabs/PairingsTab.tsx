
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PairingOptions, { Pairing } from '@/components/barCrawl/PairingOptions';

interface PairingsTabProps {
  pairings: Pairing[];
  setPairings: (pairings: Pairing[]) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitDisabled: boolean;
}

const PairingsTab: React.FC<PairingsTabProps> = ({
  pairings,
  setPairings,
  onBack,
  onSubmit,
  isSubmitDisabled
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Food & Drink Pairings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <PairingOptions
          pairings={pairings}
          onPairingsChange={setPairings}
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
            type="submit" 
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Create Swig Circuit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingsTab;
