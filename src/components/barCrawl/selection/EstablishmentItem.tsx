
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';

interface EstablishmentItemProps {
  establishment: Establishment;
  index: number;
  onRemove: (establishment: Establishment) => void;
}

// Memoized component to prevent unnecessary re-renders
const EstablishmentItem = React.memo(({ 
  establishment, 
  index, 
  onRemove 
}: EstablishmentItemProps) => {
  return (
    <div className="flex items-center justify-between bg-material-primary-container/30 p-2 rounded-lg">
      <div className="flex items-center min-w-0">
        <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
          {index + 1}
        </div>
        <span className="font-medium truncate">{establishment.name}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={() => onRemove(establishment)}
        className="flex-shrink-0 ml-2"
        aria-label={`Remove ${establishment.name}`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
});

EstablishmentItem.displayName = 'EstablishmentItem';

export default EstablishmentItem;
