
import { useContext } from 'react';
import { AuthContext } from '@/contexts/auth/AuthProvider';
import { SessionStorageManager } from '@/utils/sessionStorage';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Add dev auth bypass functionality
  const getDevUserType = () => {
    return SessionStorageManager.getItem<string>('dev_user_type');
  };

  const setDevUserType = (userType: string | null) => {
    if (userType) {
      SessionStorageManager.setItem('dev_user_type', userType);
    } else {
      SessionStorageManager.removeItem('dev_user_type');
    }
  };

  const isUsingDevBypass = !!getDevUserType();

  return {
    ...context,
    isUsingDevBypass,
    getDevUserType,
    setDevUserType
  };
};
