
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface EnhancedQuickAction {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon: React.ReactNode to iconName: string
  color: string;
  isEnabled: boolean;
  requiresAuth?: boolean;
  badge?: string;
  shortcut?: string;
  recentlyUsed?: boolean;
  onClick: () => void | Promise<void>;
}

export const useEnhancedQuickActions = () => {
  const navigate = useNavigate();
  const { trackAction } = useAnalytics();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleActionClick = async (action: EnhancedQuickAction) => {
    if (!action.isEnabled) return;
    
    setIsLoading(action.id);
    
    try {
      await trackAction('quick_action_used', { action_id: action.id });
      await action.onClick();
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(null);
    }
  };

  const checkInNearby = async () => {
    // Mock check-in logic with geolocation
    await new Promise(resolve => setTimeout(resolve, 1000));
    navigate('/establishments');
  };

  const findEvents = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate('/events');
  };

  const createRecipe = async () => {
    navigate('/create-recipe');
  };

  const startBarCrawl = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate('/bar-crawls');
  };

  const shareAchievement = async () => {
    // Mock sharing logic
    await new Promise(resolve => setTimeout(resolve, 600));
    console.log('Achievement shared!');
  };

  const findFriends = async () => {
    navigate('/social/friends');
  };

  return {
    isLoading,
    handleActionClick,
    actions: {
      checkInNearby,
      findEvents,
      createRecipe,
      startBarCrawl,
      shareAchievement,
      findFriends
    }
  };
};
