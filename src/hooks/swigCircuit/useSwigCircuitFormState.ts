
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/swigCircuit/DrinkHighlights';
import { Pairing } from '@/components/swigCircuit/PairingOptions';
import { useToast } from '@/hooks/use-toast';
import { SwigCircuitFormState, TicketTier } from './types';

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
  
  // New ticket and performance projection state
  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([]);
  const [projectedAttendance, setProjectedAttendance] = useState(0);
  const [projectedRevenue, setProjectedRevenue] = useState(0);
  
  const handleSaveEstablishments = (establishments: Establishment[]) => {
    setSelectedEstablishments(establishments);
    toast({
      title: 'Establishments Updated',
      description: `${establishments.length} establishments added to your Swig Circuit.`,
    });
  };

  const addTicketTier = (tier: TicketTier) => {
    const newTier = {
      ...tier,
      id: uuidv4()
    };
    setTicketTiers([...ticketTiers, newTier]);
  };

  const updateTicketTier = (index: number, tier: TicketTier) => {
    const updatedTiers = [...ticketTiers];
    updatedTiers[index] = tier;
    setTicketTiers(updatedTiers);
  };

  const removeTicketTier = (index: number) => {
    const updatedTiers = [...ticketTiers];
    updatedTiers.splice(index, 1);
    setTicketTiers(updatedTiers);
  };

  const calculateProjections = () => {
    // Simple calculation for projected attendance based on establishments and ticket tiers
    const baseAttendance = selectedEstablishments.length * 20;
    const tierMultiplier = 1 + (ticketTiers.length * 0.2);
    const newProjectedAttendance = Math.round(baseAttendance * tierMultiplier);
    setProjectedAttendance(newProjectedAttendance);
    
    // Calculate projected revenue based on ticket tiers and projected attendance
    let totalRevenue = 0;
    
    if (ticketTiers.length > 0) {
      // Distribute attendance across tiers based on pricing
      const totalPrice = ticketTiers.reduce((sum, tier) => sum + tier.price, 0);
      
      ticketTiers.forEach(tier => {
        // Higher priced tiers get fewer attendees
        const tierRatio = tier.price / totalPrice;
        const inverseTierRatio = 1 - (tierRatio * 0.5);
        const tierAttendance = Math.round(newProjectedAttendance * inverseTierRatio / ticketTiers.length);
        const tierRevenue = tierAttendance * tier.price;
        totalRevenue += tierRevenue;
      });
    }
    
    setProjectedRevenue(totalRevenue);
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
      case "tickets":
        return ticketTiers.length > 0;
      case "projections":
        return true; // Always complete as it's based on other data
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
    ticketTiers,
    setTicketTiers,
    projectedAttendance,
    setProjectedAttendance,
    projectedRevenue,
    setProjectedRevenue,
    isSubmitting,
    setIsSubmitting,
    
    // Helper methods
    handleSaveEstablishments,
    addTicketTier,
    updateTicketTier,
    removeTicketTier,
    calculateProjections,
    isTabComplete,
  };
};
