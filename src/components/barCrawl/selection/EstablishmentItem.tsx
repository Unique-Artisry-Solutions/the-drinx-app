
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';

interface EstablishmentItemProps {
  establishment: Establishment;
  index: number;
  onRemove: (establishment: Establishment) => void;
}

const EstablishmentItem: React.FC<EstablishmentItemProps> = ({ 
  establishment, 
  index, 
  onRemove 
}) => {
  return (
    <div className="flex items-center justify-between p-2 border rounded-md bg-background">
      <div className="flex items-center flex-1 min-w-0">
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-spiritless-pink text-white flex items-center justify-center mr-2">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{establishment.name}</div>
          <div className="text-xs text-muted-foreground truncate">
            {establishment.distance || establishment.address}
          </div>
        </div>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(establishment)} 
        className="ml-2"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EstablishmentItem;
