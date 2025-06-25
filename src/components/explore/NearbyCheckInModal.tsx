
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, Star, Clock, Check, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
  onViewMap?: () => void;
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
            <DialogTitle>Location Access Required</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground mb-4">
              To find nearby establishments, please enable location access in your browser.
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
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nearby Check-ins
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Finding nearby establishments...</span>
            </div>
          ) : establishments.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No establishments found within 5 miles of your location.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {establishments.map((establishment) => (
                <Card key={establishment.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {establishment.image ? (
                          <img 
                            src={establishment.image} 
                            alt={establishment.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm leading-tight">{establishment.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {establishment.address}
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{establishment.distance}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{establishment.cocktailCount} cocktails</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {establishment.isCheckedIn ? (
                          <Button variant="outline" size="sm" disabled className="text-green-600 border-green-200">
                            <Check className="h-3 w-3 mr-1" />
                            Checked In
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => onCheckIn(establishment)}
                            disabled={isCheckingIn === establishment.id}
                            className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                          >
                            {isCheckingIn === establishment.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Checking In...
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Check In
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="flex gap-2 pt-4 border-t">
          {onViewMap && (
            <Button variant="outline" onClick={onViewMap} className="flex-1">
              <MapPin className="h-4 w-4 mr-2" />
              View All on Map
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
