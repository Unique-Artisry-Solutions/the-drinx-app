
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Star, Clock, Loader2 } from 'lucide-react';

interface NearbyEstablishment {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceValue: number;
  latitude: number;
  longitude: number;
  cocktailCount: number;
  image?: string;
  isCheckedIn?: boolean;
}

interface NearbyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishments: NearbyEstablishment[];
  isLoading: boolean;
  hasError: boolean;
  isCheckingIn: string | null;
  onCheckIn: (establishment: NearbyEstablishment) => void;
  onViewMap: () => void;
}

export const NearbyCheckInModal: React.FC<NearbyCheckInModalProps> = ({
  isOpen,
  onClose,
  establishments,
  isLoading,
  hasError,
  isCheckingIn,
  onCheckIn,
  onViewMap
}) => {
  if (hasError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Location Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Please enable location access to find nearby establishments for check-in.
            </p>
            <Button onClick={onClose} className="w-full">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Check In Nearby
          </DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">Finding nearby places...</span>
          </div>
        ) : establishments.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              No nearby establishments found within 5 miles.
            </p>
            <Button onClick={onViewMap} variant="outline">
              View Map
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="max-h-80">
              <div className="space-y-3">
                {establishments.map((establishment) => (
                  <div key={establishment.id} className="p-3 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{establishment.name}</h4>
                        <p className="text-xs text-muted-foreground">{establishment.address}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{establishment.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{establishment.cocktailCount} mocktails</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => onCheckIn(establishment)}
                      disabled={isCheckingIn === establishment.id || establishment.isCheckedIn}
                    >
                      {isCheckingIn === establishment.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          Checking in...
                        </>
                      ) : establishment.isCheckedIn ? (
                        'Checked In'
                      ) : (
                        'Check In'
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="pt-4 border-t">
              <Button onClick={onViewMap} variant="outline" className="w-full">
                View All on Map
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
