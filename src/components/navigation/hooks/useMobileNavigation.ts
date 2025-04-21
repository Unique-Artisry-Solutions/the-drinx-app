
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { NavigationType } from '../NavigationTypes';

export const useMobileNavigation = (
  type: NavigationType,
  userType: 'individual' | 'establishment' | 'promoter',
  forceGuestNavigation: boolean = false
) => {
  const location = useLocation();
  const navigate = useNavigate();
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
    console.log('MobileNavigation Rendered:', { 
      type, 
      userType: currentUserType, 
      user: !!user,
      forceGuestNavigation,
      path: location.pathname
    });
  }, [type, currentUserType, user, forceGuestNavigation, location.pathname]);

  const toggleExpand = () => setExpanded(!expanded);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      if (currentUserType === 'establishment') {
        navigate('/establishment/dashboard');
      } else if (currentUserType === 'promoter') {
        navigate('/promoter/dashboard');
      } else {
        navigate('/explore');
      }
    } else {
      navigate('/landing');
    }
    window.scrollTo(0, 0);
  };

  const getProfilePath = () => {
    return currentUserType === 'establishment' ? '/establishment/profile' : '/profile';
  };

  return {
    currentUserType,
    expanded,
    toggleExpand,
    handleHomeClick,
    getProfilePath,
  };
};
