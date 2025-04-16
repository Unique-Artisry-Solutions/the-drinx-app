
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { SwigCircuitFormState } from './types';
import { 
  swigCircuits, 
  swigCircuitVenues, 
  swigCircuitDrinkHighlights, 
  swigCircuitPairings,
  swigCircuitTicketTiers,
  getCurrentUserId
} from '@/lib/typedSupabase';

export const useSwigCircuitSubmission = (formState: SwigCircuitFormState) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const saveToLocalStorage = () => {
    const newBarCrawlId = `bc-${Date.now()}`;
    
    const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    barCrawls.push({
      id: newBarCrawlId,
      name: formState.name,
      startDate: formState.startDate,
      endDate: formState.endDate,
      description: formState.description,
      imageUrl: formState.previewUrl || 'https://placehold.co/600x300',
      establishments: formState.selectedEstablishments,
      organizer: localStorage.getItem('user_name') || 'User',
      status: 'planned',
      created_at: new Date().toISOString(),
      theme: formState.selectedTheme,
      maxDistance: formState.maxDistance,
      drinkHighlights: formState.drinkHighlights,
      pairings: formState.pairings,
      ticketTiers: formState.ticketTiers,
      projectedAttendance: formState.projectedAttendance,
      projectedRevenue: formState.projectedRevenue
    });
    localStorage.setItem('user_bar_crawls', JSON.stringify(barCrawls));
    
    toast({
      title: 'Swig Circuit Created',
      description: 'Your new Swig Circuit has been created successfully! (Saved to localStorage for testing)',
    });
    
    navigate(`/profile/my-creations/${newBarCrawlId}`);
    return newBarCrawlId;
  };

  const saveToDatabase = async () => {
    // Get current user id for RLS policies
    const userId = await getCurrentUserId();
    
    if (!userId) {
      throw new Error('User ID is required to save to database');
    }

    // Create the main swig circuit record
    const { data: swigCircuit, error: circuitError } = await swigCircuits()
      .insert({
        user_id: userId,
        name: formState.name,
        description: formState.description,
        start_date: formState.startDate,
        end_date: formState.endDate,
        image_url: formState.previewUrl,
        theme: formState.selectedTheme,
        max_distance: formState.maxDistance,
        projected_attendance: formState.projectedAttendance,
        projected_revenue: formState.projectedRevenue
      })
      .select()
      .single();

    if (circuitError) {
      console.error("Circuit insert error:", circuitError);
      throw new Error(circuitError.message);
    }

    // Insert the selected venues
    if (formState.selectedEstablishments.length > 0) {
      const venueInserts = formState.selectedEstablishments.map((est, index) => ({
        swig_circuit_id: swigCircuit.id,
        establishment_id: est.id,
        position: index
      }));

      const { error: venuesError } = await swigCircuitVenues()
        .insert(venueInserts);

      if (venuesError) {
        console.error("Venues insert error:", venuesError);
        throw new Error(venuesError.message);
      }
    }

    // Insert drink highlights
    if (formState.drinkHighlights.length > 0) {
      const highlightInserts = formState.drinkHighlights.map(highlight => ({
        swig_circuit_id: swigCircuit.id,
        name: highlight.name,
        description: highlight.description
      }));

      const { error: highlightsError } = await swigCircuitDrinkHighlights()
        .insert(highlightInserts);

      if (highlightsError) {
        console.error("Highlights insert error:", highlightsError);
        throw new Error(highlightsError.message);
      }
    }

    // Insert pairings
    if (formState.pairings.length > 0) {
      const pairingInserts = formState.pairings.map(pairing => ({
        swig_circuit_id: swigCircuit.id,
        food: pairing.foodItem,
        drink: pairing.drinkName
      }));

      const { error: pairingsError } = await swigCircuitPairings()
        .insert(pairingInserts);

      if (pairingsError) {
        console.error("Pairings insert error:", pairingsError);
        throw new Error(pairingsError.message);
      }
    }
    
    // Insert ticket tiers
    if (formState.ticketTiers.length > 0) {
      const ticketTierInserts = formState.ticketTiers.map(tier => ({
        swig_circuit_id: swigCircuit.id,
        name: tier.name,
        price: tier.price,
        description: tier.description,
        ticket_limit: tier.limit || null,
        benefits: tier.benefits
      }));

      const { error: ticketTiersError } = await swigCircuitTicketTiers()
        .insert(ticketTierInserts);

      if (ticketTiersError) {
        console.error("Ticket tiers insert error:", ticketTiersError);
        throw new Error(ticketTiersError.message);
      }
    }

    toast({
      title: 'Swig Circuit Created',
      description: 'Your new Swig Circuit has been created successfully!',
    });
    
    return swigCircuit.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);

    try {
      let circuitId;
      
      // For testing purposes: if user isn't authenticated, use localStorage fallback
      if (!user) {
        circuitId = saveToLocalStorage();
      } else {
        // If authenticated, save to database
        circuitId = await saveToDatabase();
      }
      
      navigate(`/profile/my-creations/${circuitId}`);
    } catch (error: any) {
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
    handleSubmit,
    isSubmitting
  };
};
