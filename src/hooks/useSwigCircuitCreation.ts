
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';
import { Pairing } from '@/components/barCrawl/PairingOptions';

export const useSwigCircuitCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentTab, setCurrentTab] = useState("basics");
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) {
      toast({
        title: 'Missing basic information',
        description: 'Please fill out all required fields in the Basics tab',
        variant: 'destructive',
      });
      setCurrentTab("basics");
      return;
    }
    
    if (!selectedTheme) {
      toast({
        title: 'Missing theme',
        description: 'Please select a theme for your Swig Circuit',
        variant: 'destructive',
      });
      setCurrentTab("theme");
      return;
    }

    if (selectedEstablishments.length < 2) {
      toast({
        title: 'Not enough establishments',
        description: 'Please select at least 2 establishments for your Swig Circuit.',
        variant: 'destructive',
      });
      setCurrentTab("venues");
      return;
    }

    const newBarCrawlId = `bc-${Date.now()}`;
    
    const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    barCrawls.push({
      id: newBarCrawlId,
      name,
      startDate,
      endDate,
      description,
      imageUrl: previewUrl || 'https://placehold.co/600x300',
      establishments: selectedEstablishments,
      organizer: localStorage.getItem('user_name') || 'User',
      status: 'planned',
      created_at: new Date().toISOString(),
      theme: selectedTheme,
      maxDistance,
      drinkHighlights,
      pairings
    });
    localStorage.setItem('user_bar_crawls', JSON.stringify(barCrawls));
    
    toast({
      title: 'Swig Circuit Created',
      description: 'Your new Swig Circuit has been created successfully!',
    });
    
    navigate(`/profile/my-creations/${newBarCrawlId}`);
  };

  return {
    // State
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
    
    // Methods
    handleSaveEstablishments,
    isTabComplete,
    handleSubmit
  };
};
