
import { useState, useEffect } from 'react';

export interface Activity {
  id: number;
  type: 'review' | 'visit' | 'crawl' | 'order';
  user: string;
  content: string;
  time: string;
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
          { id: 1, type: 'review', user: 'Sarah J.', content: 'Left a 5-star review: "The mocktails were amazing! Will definitely be back."', time: '2h ago' },
          { id: 2, type: 'visit', user: 'James W.', content: 'Checked in with 3 friends', time: '3h ago' },
          { id: 3, type: 'crawl', user: 'Downtown Crawl', content: 'Added your establishment to their weekend route', time: '5h ago' },
          { id: 4, type: 'order', user: 'Michael R.', content: 'Ordered Blue Lagoon and gave it a thumbs up', time: '6h ago' },
          { id: 5, type: 'review', user: 'Emma T.', content: 'Left a 4-star review: "Great atmosphere and friendly staff"', time: '1d ago' },
          { id: 6, type: 'visit', user: 'David K.', content: 'Checked in for the second time this week', time: '1d ago' }
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
