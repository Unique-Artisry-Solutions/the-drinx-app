
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, X, PlusCircle, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Establishment {
  id: string;
  name: string;
  address: string;
}

interface BarCrawlControlProps {
  establishments: Establishment[];
  onSaveBarCrawl: (establishments: Establishment[]) => void;
}

const BarCrawlControl: React.FC<BarCrawlControlProps> = ({ establishments, onSaveBarCrawl }) => {
  const [barCrawlMode, setBarCrawlMode] = useState(false);
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>([]);
  const { toast } = useToast();

  const toggleBarCrawlMode = () => {
    setBarCrawlMode(!barCrawlMode);
    if (barCrawlMode && selectedEstablishments.length > 0) {
      setSelectedEstablishments([]);
    }
  };

  const addToBarCrawl = (establishment: Establishment) => {
    if (selectedEstablishments.some(e => e.id === establishment.id)) {
      // Already added, so remove it
      setSelectedEstablishments(selectedEstablishments.filter(e => e.id !== establishment.id));
      toast({
        title: "Removed from Swig Circuit",
        description: `${establishment.name} removed from your Swig Circuit.`,
      });
    } else {
      // Add to the list
      setSelectedEstablishments([...selectedEstablishments, establishment]);
      toast({
        title: "Added to Swig Circuit",
        description: `${establishment.name} added to your Swig Circuit.`,
      });
    }
  };

  const saveBarCrawl = () => {
    if (selectedEstablishments.length < 2) {
      toast({
        title: "Not enough establishments",
        description: "Please select at least 2 establishments for your Swig Circuit.",
        variant: "destructive",
      });
      return;
    }

    onSaveBarCrawl(selectedEstablishments);
    setBarCrawlMode(false);
    setSelectedEstablishments([]);
    
    toast({
      title: "Swig Circuit saved!",
      description: `Your Swig Circuit with ${selectedEstablishments.length} establishments has been saved.`,
    });
  };

  return (
    <div className="mb-4">
      <Button 
        variant={barCrawlMode ? "destructive" : "default"}
        onClick={toggleBarCrawlMode}
        className="mb-4"
      >
        {barCrawlMode ? (
          <>
            <X className="mr-2 h-4 w-4" />
            Cancel Selection
          </>
        ) : (
          <>
            <Route className="mr-2 h-4 w-4" />
            Select Venues
          </>
        )}
      </Button>

      {barCrawlMode && (
        <Card className="mb-4 border-2 border-material-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create Your Swig Circuit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-material-on-surface-variant mb-4">
              Select establishments below to add them to your Swig Circuit route.
            </p>

            {selectedEstablishments.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {selectedEstablishments.map((est, index) => (
                    <div key={est.id} className="flex items-center justify-between bg-material-primary-container/30 p-2 rounded-lg">
                      <div className="flex items-center min-w-0">
                        <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="font-medium truncate">{est.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => addToBarCrawl(est)}
                        className="flex-shrink-0 ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full" 
                  variant="default"
                  onClick={saveBarCrawl}
                >
                  Save Swig Circuit ({selectedEstablishments.length} stops)
                </Button>
              </>
            ) : (
              <p className="text-center py-4 italic text-material-on-surface-variant">
                Select establishments below to build your Swig Circuit
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarCrawlControl;
