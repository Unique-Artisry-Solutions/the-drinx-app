
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabaseClient } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { MocktailSuggestion, Ingredient } from '@/types/DatabaseTypes';
import { useToast } from '@/hooks/use-toast';

export const useMocktailSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Function to fetch user's suggestions
  const fetchUserSuggestions = async () => {
    if (!user) {
      return [];
    }
    
    const { data, error } = await supabaseClient
      .from('mocktail_suggestions')
      .select('*, establishments(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching suggestions:', error);
      throw error;
    }
    
    return data.map((suggestion: any) => ({
      ...suggestion,
      establishment_name: suggestion.establishments?.name || 'Unknown Establishment'
    })) as (MocktailSuggestion & { establishment_name: string })[];
  };
  
  // Function to fetch establishment's suggestions
  const fetchEstablishmentSuggestions = async (establishmentId: string) => {
    if (!establishmentId) return [];
    
    const { data, error } = await supabaseClient
      .from('mocktail_suggestions')
      .select('*, profiles(username, display_name)')
      .eq('establishment_id', establishmentId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching establishment suggestions:', error);
      throw error;
    }
    
    return data.map((suggestion: any) => ({
      ...suggestion,
      user_name: suggestion.profiles?.display_name || suggestion.profiles?.username || 'Anonymous User'
    })) as (MocktailSuggestion & { user_name: string })[];
  };
  
  // Query for user's suggestions
  const {
    data: userSuggestions = [],
    isLoading: isLoadingUserSuggestions,
    error: userSuggestionsError,
    refetch: refetchUserSuggestions
  } = useQuery({
    queryKey: ['userMocktailSuggestions', user?.id],
    queryFn: fetchUserSuggestions,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Query factory for establishment suggestions
  const getEstablishmentSuggestions = (establishmentId: string) => {
    return useQuery({
      queryKey: ['establishmentMocktailSuggestions', establishmentId],
      queryFn: () => fetchEstablishmentSuggestions(establishmentId),
      enabled: !!establishmentId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };
  
  // Mutation to suggest a mocktail
  const suggestMocktail = useMutation({
    mutationFn: async (suggestion: Omit<MocktailSuggestion, 'id' | 'status' | 'created_at' | 'updated_at' | 'feedback'>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabaseClient
        .from('mocktail_suggestions')
        .insert({
          ...suggestion,
          user_id: user.id,
          status: 'pending'
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0] as MocktailSuggestion;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userMocktailSuggestions', user?.id] });
      toast({
        title: "Suggestion submitted",
        description: "Your mocktail suggestion has been sent to the establishment."
      });
    },
    onError: (error) => {
      console.error('Error submitting suggestion:', error);
      toast({
        title: "Error",
        description: "Failed to submit your suggestion. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Mutation to update a suggestion status (for establishment owners)
  const updateSuggestionStatus = useMutation({
    mutationFn: async ({ id, status, feedback }: { id: string, status: 'approved' | 'rejected', feedback?: string }) => {
      const { data, error } = await supabaseClient
        .from('mocktail_suggestions')
        .update({
          status,
          feedback,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();
        
      if (error) {
        throw error;
      }
      
      return data[0] as MocktailSuggestion;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['establishmentMocktailSuggestions']
      });
      
      // Also invalidate any potential user-specific queries
      queryClient.invalidateQueries({
        queryKey: ['userMocktailSuggestions']
      });
    },
    onError: (error) => {
      console.error('Error updating suggestion status:', error);
      toast({
        title: "Error",
        description: "Failed to update the suggestion status. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    userSuggestions,
    isLoadingUserSuggestions,
    userSuggestionsError,
    refetchUserSuggestions,
    getEstablishmentSuggestions,
    suggestMocktail,
    updateSuggestionStatus
  };
};
