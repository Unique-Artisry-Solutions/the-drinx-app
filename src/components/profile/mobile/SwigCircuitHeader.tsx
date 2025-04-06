
import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Route } from 'lucide-react';

const SwigCircuitHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-start">
      <CardTitle className="text-base">
        <div className="flex items-center">
          <Route className="h-4 w-4 mr-1 text-spiritless-pink" />
          Active Swig Circuit
        </div>
      </CardTitle>
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs font-medium">
        In Progress
      </Badge>
    </div>
  );
};

export default SwigCircuitHeader;
