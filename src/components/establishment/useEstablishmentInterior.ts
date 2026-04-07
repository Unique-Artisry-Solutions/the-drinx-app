
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useEstablishmentInterior = (establishment: any) => {
  const [isSwigCircuitModalOpen, setIsSwigCircuitModalOpen] = useState(false);
  const [activeUsers, setActiveUsers] = useState(establishment.activeUsers || Math.floor(Math.random() * 11));
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [isPromoter, setIsPromoter] = useState(false);
  const { toast } = useToast();
  
  // Check if the user is a promoter on component mount
  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    setIsPromoter(userType === 'promoter');
  }, []);

  // Sort cocktails by rating for top-rated display
  const getSortedTopCocktails = (cocktails: any[]) => {
    return [...cocktails]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 3);
  };
  
  const handleCheckIn = () => {
    if (!localStorage.getItem('user_authenticated')) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to check in at this establishment',
        variant: 'destructive'
      });
      return;
    }
    setHasCheckedIn(true);
    setActiveUsers(prev => prev + 1);
    toast({
      title: 'Checked In!',
      description: `You've checked in at ${establishment.name}`
    });
  };
  
  const handleSwigCircuitRequest = () => {
    setIsSwigCircuitModalOpen(true);
  };

  // Handle business hours display
  const formatBusinessHours = () => {
    // First check if we have structured business hours
    if (establishment.businessHours && Array.isArray(establishment.businessHours)) {
      const hours = establishment.businessHours;
      
      // Group days with the same hours
      const groupedHours: Record<string, string[]> = {};
      
      hours.forEach(hour => {
        const timeString = `${hour.openTime} - ${hour.closeTime}`;
        if (!groupedHours[timeString]) {
          groupedHours[timeString] = [];
        }
        groupedHours[timeString].push(hour.day);
      });
      
      // Format grouped hours for display
      return Object.entries(groupedHours).map(([hours, days]) => {
        // If there are consecutive days with the same hours, group them
        if (days.length > 1) {
          return { 
            days: `${days[0]} - ${days[days.length - 1]}`, 
            hours 
          };
        }
        return { days: days[0], hours };
      });
    }
    
    // Fallback to default display if no structured hours
    return [
      { days: 'Monday - Thursday', hours: '11:00 AM - 10:00 PM' },
      { days: 'Friday - Saturday', hours: '11:00 AM - 12:00 AM' },
      { days: 'Sunday', hours: '12:00 PM - 9:00 PM' }
    ];
  };

  return {
    isSwigCircuitModalOpen,
    setIsSwigCircuitModalOpen,
    activeUsers,
    hasCheckedIn,
    isPromoter,
    getSortedTopCocktails,
    handleCheckIn,
    handleSwigCircuitRequest,
    formatBusinessHours
  };
};
