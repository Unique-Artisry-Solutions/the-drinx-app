
import { useState, useEffect } from 'react';

export interface Activity {
  id: number;
  type: 'review' | 'visit' | 'crawl' | 'order' | 'action';
  user: string;
  content: string;
  time: string;
  requires_action?: boolean;
  action_url?: string;
}

export const useActivitiesData = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    const fetchActivities = async () => {
      // Simulating API call
      setTimeout(() => {
        const mockActivities: Activity[] = [
          { 
            id: 1, 
            type: 'action', 
            user: 'Bar Crawl Request', 
            content: 'Holiday Mocktail Crawl needs your approval', 
            time: 'Now', 
            requires_action: true,
            action_url: '/establishment/bar-crawl-requests'
          },
          { 
            id: 2, 
            type: 'action', 
            user: 'Menu Update', 
            content: 'Your new mocktail "Summer Breeze" is pending approval', 
            time: '30m ago',
            requires_action: true,
            action_url: '/establishment/menu'
          },
          { 
            id: 3, 
            type: 'review', 
            user: 'Sarah J.', 
            content: 'Left a 5-star review: "The mocktails were amazing! Will definitely be back."', 
            time: '2h ago',
            requires_action: false
          },
          { 
            id: 4, 
            type: 'visit', 
            user: 'James W.', 
            content: 'Checked in with 3 friends', 
            time: '3h ago',
            requires_action: false
          },
          { 
            id: 5, 
            type: 'crawl', 
            user: 'Downtown Crawl', 
            content: 'Added your establishment to their weekend route', 
            time: '5h ago',
            requires_action: false
          },
          { 
            id: 6, 
            type: 'order', 
            user: 'Michael R.', 
            content: 'Ordered Blue Lagoon and gave it a thumbs up', 
            time: '6h ago',
            requires_action: false
          },
          { 
            id: 7, 
            type: 'action', 
            user: 'Profile Verification', 
            content: 'Your profile is 70% complete - add more details to improve visibility', 
            time: '1d ago',
            requires_action: true,
            action_url: '/establishment/profile'
          },
          { 
            id: 8, 
            type: 'review', 
            user: 'Emma T.', 
            content: 'Left a 4-star review: "Great atmosphere and friendly staff"', 
            time: '1d ago',
            requires_action: false
          },
          { 
            id: 9, 
            type: 'visit', 
            user: 'David K.', 
            content: 'Checked in for the second time this week', 
            time: '1d ago',
            requires_action: false
          }
        ];
        
        setActivities(mockActivities);
        setIsLoadingActivities(false);
      }, 500);
    };

    fetchActivities();
  }, []);

  return {
    activities,
    isLoadingActivities
  };
};
