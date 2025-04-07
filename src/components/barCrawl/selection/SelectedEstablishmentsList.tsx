
import React from 'react';
import { Button } from '@/components/ui/button';
import { Establishment } from '@/types/ProfileTypes';
import EstablishmentItem from './EstablishmentItem';
import { Save } from 'lucide-react';

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
      <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed">
        <p className="text-material-on-surface-variant">
          Select establishments below to build your Swig Circuit
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 mb-4">
        <h4 className="font-medium text-sm flex items-center">
          <span className="w-5 h-5 rounded-full bg-spiritless-pink text-white flex items-center justify-center text-xs mr-1.5">{establishments.length}</span>
          Selected Venues
        </h4>
        <div className="space-y-2 max-h-[240px] overflow-y-auto p-1">
          {establishments.map((est, index) => (
            <EstablishmentItem
              key={est.id}
              establishment={est}
              index={index}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
      <Button 
        className="w-full" 
        variant="default"
        onClick={onSave}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Swig Circuit ({establishments.length} stops)
      </Button>
    </>
  );
};

export default SelectedEstablishmentsList;
