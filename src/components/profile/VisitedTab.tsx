
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { VisitedTabProps } from '@/types/ProfileTypes';

const VisitedTab: React.FC<VisitedTabProps> = ({ visitedEstablishments }) => {
  return (
    <div className="space-y-4">
      <h2 className="font-medium">Places I've Visited</h2>
      
      {visitedEstablishments.map((est) => (
        <Card key={est.id} className="relative">
          <CardContent className="p-4 flex items-center">
            <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center mr-3">
              <Check size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{est.name}</h3>
              <div className="flex items-center text-sm text-material-on-surface-variant">
                <span>Visited on {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VisitedTab;
