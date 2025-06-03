
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Establishment } from '@/types/ProfileTypes';
import SelectedEstablishmentsList from './SelectedEstablishmentsList';
import { sampleEstablishments } from '@/data/sampleData';
import EstablishmentGrid from '@/components/barCrawl/EstablishmentGrid';
import useBarCrawlSelection from '@/hooks/useBarCrawlSelection';

interface BarCrawlControlWithSampleDataProps {
  onSaveBarCrawl: (establishments: Establishment[]) => void;
  initialSelections?: Establishment[];
  minEstablishments?: number;
}

const BarCrawlControlWithSampleData = ({ 
  onSaveBarCrawl,
  initialSelections = [],
  minEstablishments = 2
}: BarCrawlControlWithSampleDataProps) => {
  const {
    selectionMode, 
    selectedEstablishments,
    toggleSelectionMode,
    toggleEstablishment,
    saveSelections
  } = useBarCrawlSelection({
    initialSelections,
    minEstablishments,
    onSave: onSaveBarCrawl
  });

  // Convert sample data to Establishment type format
  const testEstablishments = React.useMemo(() => {
    return sampleEstablishments.map(est => ({
      id: est.id,
      name: est.name,
      address: est.address,
      distance: est.distance,
      image: est.image,
      cocktailCount: est.cocktailCount,
      latitude: est.latitude,
      longitude: est.longitude
    }));
  }, []);

  return (
    <div className="mb-4">
      <Button 
        variant={selectionMode ? "destructive" : "default"}
        onClick={toggleSelectionMode}
        className="mb-4"
      >
        {selectionMode ? (
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

      {selectionMode && (
        <Card className="mb-4 border-2 border-material-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Create Your Swig Circuit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-material-on-surface-variant mb-4">
              Select establishments below to add them to your Swig Circuit route.
            </p>

            <SelectedEstablishmentsList
              establishments={selectedEstablishments}
              onRemove={toggleEstablishment}
              onSave={saveSelections}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Available Test Venues</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click on a venue to add it to your Swig Circuit
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {testEstablishments.map((establishment) => (
                  <div
                    key={establishment.id}
                    onClick={() => toggleEstablishment(establishment)}
                    className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                      selectedEstablishments.some(e => e.id === establishment.id)
                        ? 'bg-material-primary-container border-material-primary'
                        : 'bg-muted/30 hover:bg-muted/50 border-transparent'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-md mr-3 flex-shrink-0 overflow-hidden">
                        {establishment.image && (
                          <img 
                            src={establishment.image} 
                            alt={establishment.name} 
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{establishment.name}</h4>
                        <p className="text-xs text-muted-foreground">{establishment.distance}</p>
                        <p className="text-xs text-muted-foreground mt-1">{establishment.cocktailCount} mocktails</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BarCrawlControlWithSampleData;
