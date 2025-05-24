
import { useState, useEffect } from 'react';
import { MockDataService } from '@/services/MockDataService';
import { UserType } from '@/types/navigation';

/**
 * Hook for easily accessing mock data in dev mode
 */
export const useMockData = () => {
  const [isMockMode, setIsMockMode] = useState(false);
  const [currentUserType, setCurrentUserType] = useState<UserType | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkMockMode = () => {
      const shouldUseMock = MockDataService.shouldUseMockData();
      const userType = MockDataService.getCurrentDevUserType();
      const userId = MockDataService.getCurrentDevUserId();
      
      setIsMockMode(shouldUseMock);
      setCurrentUserType(userType);
      setCurrentUserId(userId);
    };

    checkMockMode();

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dev_user_type') {
        checkMockMode();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isMockMode,
    currentUserType,
    currentUserId,
    
    // Data getters
    getEstablishments: (userType?: UserType, userId?: string) => 
      MockDataService.getEstablishments(userType, userId),
    
    getCocktails: (establishmentId?: string) => 
      MockDataService.getCocktails(establishmentId),
    
    getEvents: (userType?: UserType, userId?: string) => 
      MockDataService.getEvents(userType, userId),
    
    getSwigCircuits: (userId?: string) => 
      MockDataService.getSwigCircuits(userId),
    
    getProfile: (userId: string) => 
      MockDataService.getProfile(userId),
    
    getReviews: (cocktailId?: string) => 
      MockDataService.getReviews(cocktailId),
    
    getAnalytics: (userType: UserType, userId: string) => 
      MockDataService.getAnalytics(userType, userId),
    
    getNotifications: (userId: string) => 
      MockDataService.getNotifications(userId)
  };
};

export default useMockData;
