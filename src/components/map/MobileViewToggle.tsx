
import React from 'react';
import { Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileViewToggleProps {
  onToggle: () => void;
}

const MobileViewToggle = ({ onToggle }: MobileViewToggleProps) => {
  return (
    <div className="fixed bottom-20 right-4">
      <Button 
        onClick={onToggle}
        className="bg-material-primary text-white p-3 rounded-full shadow-lg"
        aria-label="Toggle view mode"
      >
        <Grid size={24} />
      </Button>
    </div>
  );
};

export default MobileViewToggle;
