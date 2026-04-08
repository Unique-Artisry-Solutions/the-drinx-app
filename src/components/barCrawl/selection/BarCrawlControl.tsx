
import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Route } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Establishment } from '@/types/ProfileTypes';
import SelectedEstablishmentsList from './SelectedEstablishmentsList';

interface SwigCircuitControlProps {
  establishments: Establishment[];
  onSaveSwigCircuit: (establishments: Establishment[]) => void;
  initialSelections?: Establishment[];
  minEstablishments?: number;
}

const SwigCircuitControl = ({ 
  establishments, 
  onSaveSwigCircuit,
  initialSelections = [],
  minEstablishments = 2
}: SwigCircuitControlProps) => {
  const [swigCircuitMode, setSwigCircuitMode] = useState(false);
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>(initialSelections);
  const { toast } = useToast();

  const toggleSwigCircuitMode = useCallback(() => {
    setSwigCircuitMode(prevMode => {
      // If we're exiting selection mode and have selections, ask for confirmation
      if (prevMode && selectedEstablishments.length > 0) {
        const confirmed = window.confirm("Are you sure you want to cancel? Your current selections will be lost.");
        if (!confirmed) return prevMode;
        
        setSelectedEstablishments([]);
        return false;
      }
      return !prevMode;
    });
  }, [selectedEstablishments]);

  const addToSwigCircuit = useCallback((establishment: Establishment) => {
    setSelectedEstablishments(current => {
      const isAlreadySelected = current.some(e => e.id === establishment.id);
      
      if (isAlreadySelected) {
        // Remove the establishment
        toast({
          title: "Removed from Swig Circuit",
          description: `${establishment.name} removed from your Swig Circuit.`,
        });
        return current.filter(e => e.id !== establishment.id);
      } else {
        // Add the establishment
        toast({
          title: "Added to Swig Circuit",
          description: `${establishment.name} added to your Swig Circuit.`,
        });
        return [...current, establishment];
      }
    });
  }, [toast]);

  const saveSwigCircuit = useCallback(() => {
    if (selectedEstablishments.length < minEstablishments) {
      toast({
        title: "Not enough establishments",
        description: `Please select at least ${minEstablishments} establishments for your Swig Circuit.`,
        variant: "destructive",
      });
      return;
    }

    onSaveSwigCircuit(selectedEstablishments);
    setSwigCircuitMode(false);
    
    toast({
      title: "Swig Circuit saved!",
      description: `Your Swig Circuit with ${selectedEstablishments.length} establishments has been saved.`,
    });
  }, [selectedEstablishments, minEstablishments, onSaveSwigCircuit, toast]);

  return (
    <div className="mb-4">
      <Button 
        variant={swigCircuitMode ? "destructive" : "default"}
        onClick={toggleSwigCircuitMode}
        className="mb-4"
      >
        {swigCircuitMode ? (
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

      {swigCircuitMode && (
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
              onRemove={addToSwigCircuit}
              onSave={saveSwigCircuit}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SwigCircuitControl;
