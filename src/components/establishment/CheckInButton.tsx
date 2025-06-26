import React, { useState } from 'react';
import { Check, MapPin, X } from 'lucide-react';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface CheckInButtonProps {
  establishmentId: string;
  establishmentName: string;
}

const CheckInButton: React.FC<CheckInButtonProps> = ({ establishmentId, establishmentName }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const { verifyLocationAndRecordVisit, recordVisit, isLoading } = useUserVisits();
  const { userLocation, isLoading: locationLoading, error: locationError } = useUserLocation();
  const { toast } = useToast();

  const handleCheckIn = async () => {
    try {
      let result;
      
      if (userLocation && userLocation.latitude && userLocation.longitude) {
        result = await verifyLocationAndRecordVisit(
          establishmentId,
          userLocation.latitude,
          userLocation.longitude,
          { rating, note, establishmentName }
        );
      } else {
        result = await recordVisit(establishmentId, { rating, note, establishmentName });
      }
      
      if (result?.success) {
        setIsDialogOpen(false);
        setRating(null);
        setNote('');
      }
    } catch (error) {
      console.error('Check-in error:', error);
      toast({
        title: "Check-in failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="default"
        className="bg-spiritless-pink hover:bg-spiritless-pink/90"
        size="sm"
      >
        <MapPin size={16} className="mr-1" /> Check In
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check In to {establishmentName}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">How was your experience?</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      rating === value
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Add a note (optional)</label>
              <Textarea
                placeholder="Share your thoughts about this place..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full"
              />
            </div>
            
            {locationError && (
              <div className="bg-red-50 text-red-700 p-2 rounded text-sm flex items-start">
                <X size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  Location access is required for check-in verification. 
                  Please enable location access in your browser.
                </span>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckIn}
              disabled={isLoading || (locationLoading && !locationError)}
            >
              {isLoading ? (
                <><span className="animate-spin mr-1">●</span> Checking In...</>
              ) : (
                <><Check size={16} className="mr-1" /> Check In</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckInButton;
