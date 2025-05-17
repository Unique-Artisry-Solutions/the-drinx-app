
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useToast } from '@/components/ui/use-toast';

// Define types
type DiscountCodeWithId = {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  description: string;
  establishment_id?: string;
  establishment_name?: string;
  end_date?: string;
  is_active: boolean;
  saved_at?: string;
};

interface SavedCodesContextType {
  savedCodes: DiscountCodeWithId[];
  isLoading: boolean;
  error: Error | null;
  saveCode: (codeId: string) => Promise<void>;
  removeCode: (codeId: string) => Promise<void>;
  refreshCodes: () => Promise<void>;
  isSaved: (codeId: string) => boolean;
}

const SavedCodesContext = createContext<SavedCodesContextType>({
  savedCodes: [],
  isLoading: false,
  error: null,
  saveCode: async () => {},
  removeCode: async () => {},
  refreshCodes: async () => {},
  isSaved: () => false,
});

export const SavedCodesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [savedCodes, setSavedCodes] = useState<DiscountCodeWithId[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();
  const { toast } = useToast();

  const refreshCodes = async () => {
    if (!user) {
      setSavedCodes([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch all saved code IDs for the user
      const { data: savedCodeData, error: savedCodeError } = await supabase
        .from('user_saved_codes')
        .select('code_id, saved_at')
        .eq('user_id', user.id);

      if (savedCodeError) throw savedCodeError;

      if (!savedCodeData || savedCodeData.length === 0) {
        setSavedCodes([]);
        setIsLoading(false);
        return;
      }

      // Extract just the code IDs
      const codeIds = savedCodeData.map(item => item.code_id);

      // Fetch the actual promotion data for these codes
      const { data: codesData, error: codesError } = await supabase
        .from('establishment_promotions')
        .select(`
          id, 
          code, 
          discount_type, 
          discount_value, 
          description, 
          end_date, 
          is_active,
          establishment_id,
          establishments:establishment_id (name)
        `)
        .in('id', codeIds);

      if (codesError) throw codesError;

      // Combine the data
      const combinedData = codesData?.map(code => {
        const savedInfo = savedCodeData.find(item => item.code_id === code.id);
        return {
          ...code,
          establishment_name: code.establishments?.name,
          saved_at: savedInfo?.saved_at
        };
      }) || [];

      setSavedCodes(combinedData);
    } catch (err) {
      console.error('Error fetching saved codes:', err);
      setError(err instanceof Error ? err : new Error('Unknown error fetching saved codes'));
      toast({
        title: "Error",
        description: "Failed to load your saved discount codes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveCode = async (codeId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save discount codes.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_saved_codes')
        .insert([
          { user_id: user.id, code_id: codeId }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discount code saved to your collection.",
      });
      
      await refreshCodes();
    } catch (err) {
      console.error('Error saving code:', err);
      toast({
        title: "Error",
        description: "Failed to save discount code.",
        variant: "destructive"
      });
    }
  };

  const removeCode = async (codeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_saved_codes')
        .delete()
        .eq('user_id', user.id)
        .eq('code_id', codeId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Discount code removed from your collection.",
      });
      
      // Update local state
      setSavedCodes(prev => prev.filter(code => code.id !== codeId));
    } catch (err) {
      console.error('Error removing code:', err);
      toast({
        title: "Error",
        description: "Failed to remove discount code.",
        variant: "destructive"
      });
    }
  };

  const isSaved = (codeId: string) => {
    return savedCodes.some(code => code.id === codeId);
  };

  // Initial load and refresh when user changes
  useEffect(() => {
    refreshCodes();
  }, [user]);

  const contextValue: SavedCodesContextType = {
    savedCodes,
    isLoading,
    error,
    saveCode,
    removeCode,
    refreshCodes,
    isSaved
  };

  return (
    <SavedCodesContext.Provider value={contextValue}>
      {children}
    </SavedCodesContext.Provider>
  );
};

export const useSavedCodes = () => useContext(SavedCodesContext);
