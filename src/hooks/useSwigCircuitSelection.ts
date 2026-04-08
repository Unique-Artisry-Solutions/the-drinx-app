
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Establishment } from '@/types/ProfileTypes';

interface UseSwigCircuitSelectionOptions {
  initialSelections?: Establishment[];
  minEstablishments?: number;
  onSave?: (establishments: Establishment[]) => void;
}

export const useSwigCircuitSelection = ({
  initialSelections = [],
  minEstablishments = 2,
  onSave
}: UseSwigCircuitSelectionOptions = {}) => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>(initialSelections);
  const { toast } = useToast();

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode(prev => !prev);
    if (selectionMode && selectedEstablishments.length > 0) {
      setSelectedEstablishments([]);
    }
  }, [selectionMode, selectedEstablishments.length]);

  const toggleEstablishment = useCallback((establishment: Establishment) => {
    setSelectedEstablishments(current => {
      const isAlreadySelected = current.some(e => e.id === establishment.id);
      
      if (isAlreadySelected) {
        toast({
          title: "Removed from Swig Circuit",
          description: `${establishment.name} removed from your Swig Circuit.`,
        });
        return current.filter(e => e.id !== establishment.id);
      } else {
        toast({
          title: "Added to Swig Circuit",
          description: `${establishment.name} added to your Swig Circuit.`,
        });
        return [...current, establishment];
      }
    });
  }, [toast]);

  const saveSelections = useCallback(() => {
    if (selectedEstablishments.length < minEstablishments) {
      toast({
        title: "Not enough establishments",
        description: `Please select at least ${minEstablishments} establishments for your Swig Circuit.`,
        variant: "destructive",
      });
      return;
    }

    if (onSave) {
      onSave(selectedEstablishments);
    }
    
    setSelectionMode(false);
    
    toast({
      title: "Swig Circuit saved!",
      description: `Your Swig Circuit with ${selectedEstablishments.length} establishments has been saved.`,
    });
  }, [selectedEstablishments, minEstablishments, onSave, toast]);

  return {
    selectionMode,
    selectedEstablishments,
    toggleSelectionMode,
    toggleEstablishment,
    saveSelections,
    setSelectedEstablishments
  };
};

export default useSwigCircuitSelection;
