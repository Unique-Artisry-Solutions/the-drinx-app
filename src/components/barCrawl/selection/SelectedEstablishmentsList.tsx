
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, X } from 'lucide-react';

interface Establishment {
  id: string;
  name: string;
  address: string;
  type: string;
  hours: string;
  position?: number;
}

interface SelectedEstablishmentsListProps {
  establishments: Establishment[];
  onRemove: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

const SelectedEstablishmentsList: React.FC<SelectedEstablishmentsListProps> = ({
  establishments,
  onRemove,
  // onReorder // Commented out to preserve future functionality
}) => {
  if (establishments.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No establishments selected yet. Add some to get started!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle>Selected Establishments ({establishments.length})</CardTitle>
      </CardHeader>
      
      {establishments.map((establishment, index) => (
        <Card key={establishment.id} className="relative">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">Stop {index + 1}</Badge>
                  <h3 className="font-semibold">{establishment.name}</h3>
                  <Badge variant="secondary">{establishment.type}</Badge>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {establishment.address}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {establishment.hours}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(establishment.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SelectedEstablishmentsList;
