
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType } from '../NavigationTypes';
import { useAppNavigation } from '@/hooks/useAppNavigation';

export const useMobileNavigation = (
  type: NavigationType,
  userType: 'individual' | 'establishment' | 'promoter' | 'admin',
  forceGuestNavigation: boolean = false
) => {
  const location = useLocation();
  const { navigate } = useAppNavigation();
  const [currentUserType, setCurrentUserType] = useState<'individual' | 'establishment' | 'promoter' | 'admin'>(userType);
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const userTypeFromStorage = localStorage.getItem('user_type');
    const isAdminAuth = localStorage.getItem('admin_authenticated') === 'true';
    
    if (isAdminAuth) {
      setCurrentUserType('admin');
    } else if (userTypeFromStorage === 'establishment') {
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
    switch (currentUserType) {
      case 'establishment':
        return '/establishment/profile';
      case 'promoter':
        return '/promoter/profile';
      case 'admin':
        return '/admin/profile';
      default:
        return '/profile';
    }
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
