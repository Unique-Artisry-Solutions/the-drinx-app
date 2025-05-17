
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSavedPromotionCodes } from '@/hooks/useSavedPromotionCodes';
import { Promotion } from '@/types/PromotionTypes';
import { supabase } from '@/integrations/supabase/client'; // Direct supabase import

interface SavedCodesContextType {
  savedCodes: Promotion[];
  loading: boolean;
  error: Error | null;
  refreshSavedCodes: () => Promise<void>;
  removeSavedCode: (codeId: string) => Promise<void>;
  copyToClipboard: (code: string) => void;
}

const SavedCodesContext = createContext<SavedCodesContextType | undefined>(undefined);

export const SavedCodesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fix: Get user from Supabase directly
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const { savedCodes, loading, error, fetchSavedCodes, removeSavedCode: removeCode, copyToClipboard } = 
    useSavedPromotionCodes(userId);

  // Wrap removeSavedCode to ensure it returns a Promise
  const removeSavedCode = async (codeId: string): Promise<void> => {
    return removeCode(codeId);
  };

  const refreshSavedCodes = async () => {
    if (userId) {
      await fetchSavedCodes();
    }
  };

  return (
    <SavedCodesContext.Provider
      value={{
        savedCodes,
        loading,
        error,
        refreshSavedCodes,
        removeSavedCode,
        copyToClipboard,
      }}
    >
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
