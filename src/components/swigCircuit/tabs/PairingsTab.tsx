
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PairingOptions, { Pairing } from '@/components/swigCircuit/PairingOptions';
import { Loader2 } from 'lucide-react';

interface PairingsTabProps {
  pairings: Pairing[];
  setPairings: (pairings: Pairing[]) => void;
  onBack: () => void;
  onContinue: () => void;
}

const PairingsTab: React.FC<PairingsTabProps> = ({
  pairings,
  setPairings,
  onBack,
  onContinue
}) => {
  return (
    <Card className="flex-1">
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
            type="button" 
            onClick={onContinue}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingsTab;
