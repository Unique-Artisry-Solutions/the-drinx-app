
import { useState } from 'react';
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';
import { Pairing } from '@/components/barCrawl/PairingOptions';
import { useToast } from '@/hooks/use-toast';
import { SwigCircuitFormState } from './types';

export const useSwigCircuitFormState = () => {
  const { toast } = useToast();
  
  // Basic form state
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentTab, setCurrentTab] = useState("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Theme and venues state
  const [selectedTheme, setSelectedTheme] = useState('');
  const [maxDistance, setMaxDistance] = useState(10);
  const [drinkHighlights, setDrinkHighlights] = useState<DrinkHighlight[]>([]);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>([]);
  
  const handleSaveEstablishments = (establishments: Establishment[]) => {
    setSelectedEstablishments(establishments);
    toast({
      title: 'Establishments Updated',
      description: `${establishments.length} establishments added to your Swig Circuit.`,
    });
  };

  const isTabComplete = (tabName: string): boolean => {
    switch (tabName) {
      case "basics":
        return !!name && !!startDate;
      case "theme":
        return !!selectedTheme;
      case "venues":
        return selectedEstablishments.length >= 2;
      case "drinks":
        return drinkHighlights.length > 0;
      case "pairings":
        return pairings.length > 0;
      default:
        return false;
    }
  };

  return {
    // Form state
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    description,
    setDescription,
    imageFile,
    setImageFile,
    previewUrl,
    setPreviewUrl,
    currentTab,
    setCurrentTab,
    selectedTheme,
    setSelectedTheme,
    maxDistance,
    setMaxDistance,
    drinkHighlights,
    setDrinkHighlights,
    pairings,
    setPairings,
    selectedEstablishments,
    setSelectedEstablishments,
    isSubmitting,
    setIsSubmitting,
    
    // Helper methods
    handleSaveEstablishments,
    isTabComplete,
  };
};
