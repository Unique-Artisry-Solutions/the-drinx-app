
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
        title: "Removed from bar crawl",
        description: `${establishment.name} removed from your bar crawl.`,
      });
    } else {
      // Add to the list
      setSelectedEstablishments([...selectedEstablishments, establishment]);
      toast({
        title: "Added to bar crawl",
        description: `${establishment.name} added to your bar crawl.`,
      });
    }
  };

  const saveBarCrawl = () => {
    if (selectedEstablishments.length < 2) {
      toast({
        title: "Not enough establishments",
        description: "Please select at least 2 establishments for your bar crawl.",
        variant: "destructive",
      });
      return;
    }

    onSaveBarCrawl(selectedEstablishments);
    setBarCrawlMode(false);
    setSelectedEstablishments([]);
    
    toast({
      title: "Bar crawl saved!",
      description: `Your bar crawl with ${selectedEstablishments.length} establishments has been saved.`,
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
            Cancel Bar Crawl
          </>
        ) : (
          <>
            <Route className="mr-2 h-4 w-4" />
            Create Bar Crawl
          </>
        )}
      </Button>

      {barCrawlMode && (
        <Card className="mb-4 border-2 border-material-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create Your Bar Crawl</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-material-on-surface-variant mb-4">
              Select establishments below to add them to your bar crawl route.
            </p>

            {selectedEstablishments.length > 0 ? (
              <>
                <div className="space-y-2 mb-4">
                  {selectedEstablishments.map((est, index) => (
                    <div key={est.id} className="flex items-center justify-between bg-material-primary-container/30 p-2 rounded-lg">
                      <div className="flex items-center">
                        <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                          {index + 1}
                        </div>
                        <span className="font-medium">{est.name}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => addToBarCrawl(est)}
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
                  Save Bar Crawl ({selectedEstablishments.length} stops)
                </Button>
              </>
            ) : (
              <p className="text-center py-4 italic text-material-on-surface-variant">
                Select establishments below to build your bar crawl
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarCrawlControl;
