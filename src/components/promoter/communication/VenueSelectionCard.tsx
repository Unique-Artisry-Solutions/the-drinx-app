
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, MessageSquare, Building } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VenueSelectionCardProps {
  venueName: string;
  address?: string;
  isSelected?: boolean;
  onClick: () => void;
}

const VenueSelectionCard: React.FC<VenueSelectionCardProps> = ({
  venueName,
  address,
  isSelected = false,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        "border-2",
        isSelected ? "border-purple-500 bg-purple-50" : "hover:border-purple-200"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-purple-100 p-2">
            <Building className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-base">{venueName}</h3>
            {address && (
              <p className="text-sm text-muted-foreground flex items-center mt-1 gap-1">
                <MapPin className="h-3 w-3" />
                {address}
              </p>
            )}
          </div>
          <MessageSquare 
            className={cn(
              "h-5 w-5 transition-colors",
              isSelected ? "text-purple-600" : "text-gray-400"
            )} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueSelectionCard;
