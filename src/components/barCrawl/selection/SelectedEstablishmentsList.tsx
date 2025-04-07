
import React from 'react';
import { Button } from '@/components/ui/button';
import { Establishment } from '@/types/ProfileTypes';
import EstablishmentItem from './EstablishmentItem';

interface SelectedEstablishmentsListProps {
  establishments: Establishment[];
  onRemove: (establishment: Establishment) => void;
  onSave: () => void;
}

const SelectedEstablishmentsList = ({ 
  establishments, 
  onRemove, 
  onSave 
}: SelectedEstablishmentsListProps) => {
  if (establishments.length === 0) {
    return (
      <p className="text-center py-4 italic text-material-on-surface-variant">
        Select establishments below to build your Swig Circuit
      </p>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-4">
        {establishments.map((est, index) => (
          <EstablishmentItem
            key={est.id}
            establishment={est}
            index={index}
            onRemove={onRemove}
          />
        ))}
      </div>
      <Button 
        className="w-full" 
        variant="default"
        onClick={onSave}
      >
        Save Swig Circuit ({establishments.length} stops)
      </Button>
    </>
  );
};

export default SelectedEstablishmentsList;
