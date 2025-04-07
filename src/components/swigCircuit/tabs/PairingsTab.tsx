
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PairingOptions, { Pairing } from '@/components/barCrawl/PairingOptions';
import { Loader2, ChevronRight } from 'lucide-react';

interface PairingsTabProps {
  pairings: Pairing[];
  setPairings: (pairings: Pairing[]) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitDisabled: boolean;
  isSubmitting?: boolean;
}

const PairingsTab: React.FC<PairingsTabProps> = ({
  pairings,
  setPairings,
  onBack,
  onSubmit,
  isSubmitDisabled,
  isSubmitting = false
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
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button 
            type="submit" 
            onClick={onSubmit}
            disabled={isSubmitDisabled || isSubmitting}
            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Swig Circuit
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PairingsTab;
