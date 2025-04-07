
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { 
  swigCircuits, 
  swigCircuitVenues, 
  swigCircuitDrinkHighlights, 
  swigCircuitPairings 
} from '@/lib/typedSupabase';

export interface SwigCircuit {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  image_url?: string;
  theme: string;
  max_distance: number;
  created_at: string;
  venues?: { establishment_id: string; position: number }[];
  drink_highlights?: { id: string; name: string; description: string }[];
  pairings?: { id: string; food: string; drink: string }[];
}

export const useSwigCircuits = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [swigCircuits, setSwigCircuits] = useState<SwigCircuit[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchSwigCircuits = async () => {
      setIsLoading(true);
      
      try {
        // For testing without auth, use localStorage
        if (!user) {
          const storedCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
          setSwigCircuits(storedCircuits);
          setIsLoading(false);
          return;
        }

        // Use Supabase if authenticated
        const { data: circuits, error } = await swigCircuits()
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching circuits:", error);
          throw error;
        }

        // Fetch related data for each circuit
        const enhancedCircuits = await Promise.all(circuits.map(async (circuit) => {
          // Fetch venues
          const { data: venues } = await swigCircuitVenues()
            .select('establishment_id, position')
            .eq('swig_circuit_id', circuit.id)
            .order('position');

          // Fetch drink highlights
          const { data: drinkHighlights } = await swigCircuitDrinkHighlights()
            .select('id, name, description')
            .eq('swig_circuit_id', circuit.id);

          // Fetch pairings
          const { data: pairings } = await swigCircuitPairings()
            .select('id, food, drink')
            .eq('swig_circuit_id', circuit.id);

          return {
            ...circuit,
            venues: venues || [],
            drink_highlights: drinkHighlights || [],
            pairings: pairings || []
          };
        }));

        setSwigCircuits(enhancedCircuits as SwigCircuit[]);
      } catch (error: any) {
        console.error('Error fetching swig circuits:', error);
        toast({
          title: 'Error fetching Swig Circuits',
          description: 'Failed to load your Swig Circuits. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSwigCircuits();
  }, [user, toast]);

  return {
    swigCircuits,
    isLoading
  };
};

export default useSwigCircuits;
