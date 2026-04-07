
import React from 'react';
import { Users, Calendar, Clock } from 'lucide-react';

interface SwigCircuitDetailsProps {
  organizer: string;
  date: string;
  stops: number;
}

const SwigCircuitDetails: React.FC<SwigCircuitDetailsProps> = ({
  organizer,
  date,
  stops
}) => {
  return (
    <div className="flex flex-wrap gap-2 text-gray-600">
      <div className="flex items-center">
        <Users className="h-4 w-4 mr-1" />
        <span>Organizer: {organizer}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-1" />
        <span>Date: {date}</span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        <span>{stops} stops</span>
      </div>
    </div>
  );
};

export default SwigCircuitDetails;
