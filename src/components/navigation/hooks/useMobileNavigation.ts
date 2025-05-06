
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType } from '../NavigationTypes';
import { useAppNavigation } from '@/hooks/useAppNavigation';

export const useMobileNavigation = (
  type: NavigationType,
  userType: 'individual' | 'establishment' | 'promoter',
  forceGuestNavigation: boolean = false
) => {
  const location = useLocation();
  const { navigate } = useAppNavigation();
  const [currentUserType, setCurrentUserType] = useState<'individual' | 'establishment' | 'promoter'>(userType);
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem('user_type');
    if (userTypeFromStorage === 'establishment') {
      setCurrentUserType('establishment');
    } else if (userTypeFromStorage === 'promoter') {
      setCurrentUserType('promoter');
    } else {
      setCurrentUserType('individual');
    }
  }, [user, location.pathname]);

  useEffect(() => {
    console.log('MobileNavigation State:', { 
      type, 
      userType: currentUserType, 
      user: !!user,
      forceGuestNavigation,
      path: location.pathname
    });
  }, [type, currentUserType, user, forceGuestNavigation, location.pathname]);

  const toggleExpand = () => setExpanded(!expanded);

  const getProfilePath = () => {
    return currentUserType === 'establishment' ? '/establishment/profile' : '/profile';
  };

  const navigateToProfile = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigate(getProfilePath());
  };

  return {
    currentUserType,
    expanded,
    toggleExpand,
    getProfilePath,
    navigateToProfile
  };
};
