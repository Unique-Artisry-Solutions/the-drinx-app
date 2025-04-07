
import React from 'react';
import { Button } from '@/components/ui/button';
import { Establishment } from '@/types/ProfileTypes';

interface NavigationButtonsProps {
  onBack: () => void;
  onContinue: () => void;
  selectedEstablishments: Establishment[];
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onBack,
  onContinue,
  selectedEstablishments
}) => {
  return (
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
        disabled={selectedEstablishments.length < 2}
        className="bg-spiritless-pink hover:bg-spiritless-pink/90"
      >
        Continue to Drink Highlights
      </Button>
    </div>
  );
};

export default NavigationButtons;
