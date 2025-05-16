
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';
import { DiscountCode } from '@/utils/discountCodeUtils';

interface SavedCodesContextType {
  savedCodes: DiscountCode[];
  isLoading: boolean;
  saveCode: (code: DiscountCode) => Promise<boolean>;
  removeCode: (codeId: string) => Promise<boolean>;
  isSaved: (codeId: string) => boolean;
  refreshSavedCodes: () => Promise<void>;
}

const SavedCodesContext = createContext<SavedCodesContextType | undefined>(undefined);

export const SavedCodesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCodes, setSavedCodes] = useState<DiscountCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load saved codes from localStorage or database
  useEffect(() => {
    const loadSavedCodes = async () => {
      setIsLoading(true);
      
      try {
        if (user) {
          // User is logged in, fetch from database
          const { data, error } = await supabase
            .from('user_saved_codes')
            .select(`
              id,
              user_id,
              code_id,
              saved_at,
              establishment_promotions (
                id,
                code,
                description,
                discount_type,
                discount_value,
                start_date,
                end_date,
                is_active,
                establishment_id,
                usage_limit,
                usage_count,
                valid_days,
                valid_hours,
                user_segment,
                combinable,
                min_purchase_amount
              )
            `)
            .eq('user_id', user.id);
          
          if (error) {
            throw error;
          }
          
          // Transform the data structure
          const formattedCodes = data.map(item => ({
            ...item.establishment_promotions
          }));
          
          setSavedCodes(formattedCodes);
        } else {
          // User is not logged in, use localStorage
          const savedCodesString = localStorage.getItem('savedPromotionCodes');
          if (savedCodesString) {
            const parsedCodes = JSON.parse(savedCodesString);
            setSavedCodes(parsedCodes);
          }
        }
      } catch (error) {
        console.error('Error loading saved codes:', error);
        toast({
          title: 'Failed to load saved codes',
          description: 'There was a problem retrieving your saved discount codes',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedCodes();
  }, [user, toast]);

  // Save a promotion code
  const saveCode = async (code: DiscountCode): Promise<boolean> => {
    try {
      if (user) {
        // Check if already saved
        if (isSaved(code.id)) {
          return true;
        }
        
        // User is logged in, save to database
        const { error } = await supabase
          .from('user_saved_codes')
          .insert({
            user_id: user.id,
            code_id: code.id,
            saved_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        // Update state
        setSavedCodes(prev => [...prev, code]);
      } else {
        // User is not logged in, use localStorage
        const updatedCodes = [...savedCodes, code];
        localStorage.setItem('savedPromotionCodes', JSON.stringify(updatedCodes));
        setSavedCodes(updatedCodes);
      }
      
      toast({
        title: 'Code saved',
        description: `Promotion code "${code.code}" has been saved`,
      });
      
      return true;
    } catch (error) {
      console.error('Error saving code:', error);
      toast({
        title: 'Failed to save code',
        description: 'There was a problem saving this promotion code',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Remove a saved promotion code
  const removeCode = async (codeId: string): Promise<boolean> => {
    try {
      if (user) {
        // User is logged in, remove from database
        const { error } = await supabase
          .from('user_saved_codes')
          .delete()
          .eq('user_id', user.id)
          .eq('code_id', codeId);
        
        if (error) {
          throw error;
        }
      } else {
        // User is not logged in, use localStorage
        const updatedCodes = savedCodes.filter(code => code.id !== codeId);
        localStorage.setItem('savedPromotionCodes', JSON.stringify(updatedCodes));
      }
      
      // Update state
      setSavedCodes(prev => prev.filter(code => code.id !== codeId));
      
      toast({
        title: 'Code removed',
        description: 'Promotion code has been removed from saved codes',
      });
      
      return true;
    } catch (error) {
      console.error('Error removing code:', error);
      toast({
        title: 'Failed to remove code',
        description: 'There was a problem removing this promotion code',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Check if a code is saved
  const isSaved = (codeId: string): boolean => {
    return savedCodes.some(code => code.id === codeId);
  };

  // Refresh saved codes
  const refreshSavedCodes = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      if (user) {
        // User is logged in, fetch from database
        const { data, error } = await supabase
          .from('user_saved_codes')
          .select(`
            id,
            user_id,
            code_id,
            saved_at,
            establishment_promotions (
              id,
              code,
              description,
              discount_type,
              discount_value,
              start_date,
              end_date,
              is_active,
              establishment_id,
              usage_limit,
              usage_count,
              valid_days,
              valid_hours,
              user_segment,
              combinable,
              min_purchase_amount
            )
          `)
          .eq('user_id', user.id);
        
        if (error) {
          throw error;
        }
        
        // Transform the data structure
        const formattedCodes = data.map(item => ({
          ...item.establishment_promotions
        }));
        
        setSavedCodes(formattedCodes);
      }
    } catch (error) {
      console.error('Error refreshing saved codes:', error);
      toast({
        title: 'Failed to refresh codes',
        description: 'There was a problem retrieving your saved discount codes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SavedCodesContext.Provider value={{
      savedCodes,
      isLoading,
      saveCode,
      removeCode,
      isSaved,
      refreshSavedCodes
    }}>
      {children}
    </SavedCodesContext.Provider>
  );
};

export const useSavedCodes = (): SavedCodesContextType => {
  const context = useContext(SavedCodesContext);
  
  if (context === undefined) {
    throw new Error('useSavedCodes must be used within a SavedCodesProvider');
  }
  
  return context;
};
