
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';
import { Pairing } from '@/components/barCrawl/PairingOptions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export const useSwigCircuitCreation = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentTab, setCurrentTab] = useState("basics");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSubmitting(true);

    try {
      // For testing purposes: if user isn't authenticated, use localStorage fallback
      if (!user) {
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
          description: 'Your new Swig Circuit has been created successfully! (Saved to localStorage for testing)',
        });
        
        navigate(`/profile/my-creations/${newBarCrawlId}`);
        return;
      }

      // If authenticated, save to database
      const { data: swigCircuit, error: circuitError } = await supabase
        .from('swig_circuits')
        .insert({
          user_id: user.id,
          name,
          description,
          start_date: startDate,
          end_date: endDate,
          image_url: previewUrl,
          theme: selectedTheme,
          max_distance: maxDistance
        })
        .select()
        .single();

      if (circuitError) {
        throw new Error(circuitError.message);
      }

      // Insert the selected venues
      if (selectedEstablishments.length > 0) {
        const venueInserts = selectedEstablishments.map((est, index) => ({
          swig_circuit_id: swigCircuit.id,
          establishment_id: est.id,
          position: index
        }));

        const { error: venuesError } = await supabase
          .from('swig_circuit_venues')
          .insert(venueInserts);

        if (venuesError) {
          throw new Error(venuesError.message);
        }
      }

      // Insert drink highlights
      if (drinkHighlights.length > 0) {
        const highlightInserts = drinkHighlights.map(highlight => ({
          swig_circuit_id: swigCircuit.id,
          name: highlight.name,
          description: highlight.description
        }));

        const { error: highlightsError } = await supabase
          .from('swig_circuit_drink_highlights')
          .insert(highlightInserts);

        if (highlightsError) {
          throw new Error(highlightsError.message);
        }
      }

      // Insert pairings
      if (pairings.length > 0) {
        const pairingInserts = pairings.map(pairing => ({
          swig_circuit_id: swigCircuit.id,
          food: pairing.foodItem,
          drink: pairing.drinkName
        }));

        const { error: pairingsError } = await supabase
          .from('swig_circuit_pairings')
          .insert(pairingInserts);

        if (pairingsError) {
          throw new Error(pairingsError.message);
        }
      }

      toast({
        title: 'Swig Circuit Created',
        description: 'Your new Swig Circuit has been created successfully!',
      });
      
      navigate(`/profile/my-creations/${swigCircuit.id}`);
      
    } catch (error) {
      console.error('Error creating Swig Circuit:', error);
      toast({
        title: 'Error Creating Swig Circuit',
        description: error.message || 'An error occurred while creating your Swig Circuit.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    
    // Methods
    handleSaveEstablishments,
    isTabComplete,
    handleSubmit
  };
};

export default useSwigCircuitCreation;
