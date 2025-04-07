
import React from 'react';
import { Establishment } from '@/types/ProfileTypes';

interface SelectedVenuesListProps {
  selectedEstablishments: Establishment[];
}

const SelectedVenuesList: React.FC<SelectedVenuesListProps> = ({ selectedEstablishments }) => {
  if (selectedEstablishments.length === 0) return null;
  
  return (
    <div className="bg-muted/30 p-3 rounded border mt-4">
      <h3 className="font-medium mb-2">Selected Venues ({selectedEstablishments.length})</h3>
      <div className="space-y-2">
        {selectedEstablishments.map((est, index) => (
          <div key={est.id} className="bg-background p-2 rounded flex justify-between items-center">
            <div className="flex items-center">
              <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <span className="truncate">{est.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectedVenuesList;
