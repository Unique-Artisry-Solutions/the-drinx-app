
import React from 'react';
import { Link } from 'react-router-dom';
import SwigCircuitDetails from './SwigCircuitDetails';
import JoinSwigCircuitButton from './JoinSwigCircuitButton';

interface SwigCircuitHeaderProps {
  name: string;
  organizer: string;
  date: string;
  stops: number;
  description?: string;
  id?: string;
  showJoinButton?: boolean; // New prop to control join button visibility
}

const SwigCircuitHeader: React.FC<SwigCircuitHeaderProps> = ({
  name,
  organizer,
  date,
  stops,
  description,
  id,
  showJoinButton = true // Default to true for backward compatibility
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div>
          <h1 className="text-2xl font-bold mb-1">{name}</h1>
          <SwigCircuitDetails
            organizer={organizer}
            date={date}
            stops={stops}
          />
        </div>
        {id && showJoinButton && (
          <JoinSwigCircuitButton swigCircuitId={id} />
        )}
      </div>
      
      {description && (
        <p className="text-gray-700 mb-3">{description}</p>
      )}
    </div>
  );
};

export default SwigCircuitHeader;
