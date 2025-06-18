
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string;
  color: string;
  isEnabled: boolean;
  onClick: () => void;
}

export const useQuickActions = () => {
  const navigate = useNavigate();

  const createQuickActions = useCallback((): QuickAction[] => {
    return [
      {
        id: 'check-in',
        title: 'Check In',
        description: 'Find nearby establishments and check in',
        iconName: 'MapPin',
        color: 'bg-blue-500',
        isEnabled: true,
        onClick: () => navigate('/establishments')
      },
      {
        id: 'discover',
        title: 'Discover',
        description: 'Explore new mocktails and flavors',
        iconName: 'Search',
        color: 'bg-green-500',
        isEnabled: true,
        onClick: () => navigate('/cocktails')
      },
      {
        id: 'create',
        title: 'Create Recipe',
        description: 'Share your own mocktail creation',
        iconName: 'Plus',
        color: 'bg-purple-500',
        isEnabled: true,
        onClick: () => navigate('/create-recipe')
      },
      {
        id: 'social',
        title: 'Social',
        description: 'Connect with other enthusiasts',
        iconName: 'Users',
        color: 'bg-orange-500',
        isEnabled: true,
        onClick: () => navigate('/social')
      },
      {
        id: 'share',
        title: 'Share',
        description: 'Share your latest discovery',
        iconName: 'Share',
        color: 'bg-pink-500',
        isEnabled: true,
        onClick: () => console.log('Share action')
      },
      {
        id: 'invite',
        title: 'Invite Friends',
        description: 'Invite friends to join you',
        iconName: 'UserPlus',
        color: 'bg-indigo-500',
        isEnabled: true,
        onClick: () => console.log('Invite friends')
      }
    ];
  }, [navigate]);

  return { createQuickActions };
};
