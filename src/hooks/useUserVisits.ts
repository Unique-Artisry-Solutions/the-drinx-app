
import { useState, useEffect } from 'react';
import { fromTable } from '@/lib/supabaseClient';
import { UserVisit, VisitWithEstablishment, UserVisitStats } from '@/types/VisitTypes';
import { 
  UserVisitTable, 
  VisitNoteTable, 
  TriedMocktailTable, 
  UserVisitAnalyticsTable 
} from '@/types/SupabaseTables';
import { Establishment } from '@/types/DatabaseTypes';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

export const useUserVisits = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<VisitWithEstablishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<UserVisitStats | null>(null);
  const { toast } = useToast();

  const fetchVisits = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get visits with establishment details
      const { data: visitData, error: visitError } = await fromTable('user_visits')
        .select(`
          *,
          establishment:establishments(*)
        `)
        .eq('user_id', user.id)
        .order('visit_date', { ascending: false });
      
      if (visitError) {
        throw visitError;
      }
      
      // Get visit notes
      const { data: notesData, error: notesError } = await fromTable('visit_notes')
        .select('*')
        .in('visit_id', visitData.map((visit: any) => visit.id));
      
      if (notesError) {
        throw notesError;
      }
      
      // Get tried mocktails
      const { data: mocktailsData, error: mocktailsError } = await fromTable('tried_mocktails')
        .select('*')
        .in('visit_id', visitData.map((visit: any) => visit.id));
      
      if (mocktailsError) {
        throw mocktailsError;
      }
      
      // Combine data
      const visitsWithDetails = visitData.map((visit: UserVisitTable & { establishment: Establishment }) => ({
        ...visit,
        notes: notesData?.filter((note: VisitNoteTable) => note.visit_id === visit.id) || [],
        tried_mocktails: mocktailsData?.filter((mocktail: TriedMocktailTable) => mocktail.visit_id === visit.id) || []
      }));
      
      setVisits(visitsWithDetails);
      
      // Get statistics
      const { data: statsData, error: statsError } = await fromTable('user_visit_analytics')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (statsError && statsError.code !== 'PGRST116') {
        throw statsError;
      }
      
      if (statsData) {
        setStats(statsData as UserVisitStats);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user visits:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const recordVisit = async (
    establishmentId: string, 
    options?: { 
      rating?: number, 
      note?: string, 
      mocktails?: { id: string, rating?: number, notes?: string }[]
    }
  ) => {
    if (!user?.id) return null;
    
    try {
      // Insert visit record
      const { data: visitData, error: visitError } = await fromTable('user_visits')
        .insert({
          user_id: user.id,
          establishment_id: establishmentId,
          rating: options?.rating
        })
        .select()
        .single();
      
      if (visitError) throw visitError;
      
      // Insert note if provided
      if (options?.note) {
        const { error: noteError } = await fromTable('visit_notes')
          .insert({
            visit_id: visitData.id,
            note: options.note
          });
        
        if (noteError) throw noteError;
      }
      
      // Insert mocktails if provided
      if (options?.mocktails && options.mocktails.length > 0) {
        const mocktailRecords = options.mocktails.map(mocktail => ({
          visit_id: visitData.id,
          cocktail_id: mocktail.id,
          rating: mocktail.rating,
          notes: mocktail.notes
        }));
        
        const { error: mocktailsError } = await fromTable('tried_mocktails')
          .insert(mocktailRecords);
        
        if (mocktailsError) throw mocktailsError;
      }
      
      toast({
        title: "Visit recorded",
        description: "Your visit has been successfully recorded!"
      });
      
      // Refresh visits data
      await fetchVisits();
      
      return visitData;
    } catch (err: any) {
      toast({
        title: "Error recording visit",
        description: err.message,
        variant: "destructive"
      });
      console.error('Error recording visit:', err);
      return null;
    }
  };

  const verifyLocationAndRecordVisit = async (
    establishmentId: string,
    userLat: number,
    userLng: number,
    options?: { 
      rating?: number, 
      note?: string, 
      mocktails?: { id: string, rating?: number, notes?: string }[]
    }
  ) => {
    if (!user?.id) return null;
    
    try {
      // For now, we'll bypass location verification and proceed with the check-in
      // In a full implementation, you should use a proper geolocation verification method
      
      // Fallback to regular check-in
      return await recordVisit(establishmentId, options);
    } catch (err: any) {
      toast({
        title: "Error verifying location",
        description: err.message,
        variant: "destructive"
      });
      console.error('Error verifying location:', err);
      return null;
    }
  };

  // Add a note to an existing visit
  const addNoteToVisit = async (visitId: string, note: string) => {
    try {
      const { data, error } = await fromTable('visit_notes')
        .insert({
          visit_id: visitId,
          note
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Note added",
        description: "Your note has been added to this visit"
      });
      
      await fetchVisits();
      return data;
    } catch (err: any) {
      toast({
        title: "Error adding note",
        description: err.message,
        variant: "destructive"
      });
      console.error('Error adding note:', err);
      return null;
    }
  };

  // Add a mocktail to an existing visit
  const addMocktailToVisit = async (
    visitId: string, 
    cocktailId: string, 
    rating?: number, 
    notes?: string
  ) => {
    try {
      const { data, error } = await fromTable('tried_mocktails')
        .insert({
          visit_id: visitId,
          cocktail_id: cocktailId,
          rating,
          notes
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Mocktail added",
        description: "The mocktail has been added to your visit"
      });
      
      await fetchVisits();
      return data;
    } catch (err: any) {
      toast({
        title: "Error adding mocktail",
        description: err.message,
        variant: "destructive"
      });
      console.error('Error adding mocktail:', err);
      return null;
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchVisits();
    }
  }, [user?.id]);

  return {
    visits,
    stats,
    isLoading,
    error,
    fetchVisits,
    recordVisit,
    verifyLocationAndRecordVisit,
    addNoteToVisit,
    addMocktailToVisit
  };
};
