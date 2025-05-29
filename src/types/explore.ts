
export type ActivityFilterType = 'all' | 'friends' | 'nearby';

export type ActivityFilterHandler = (value: ActivityFilterType) => void;

export interface RealtimeActivity {
  id: string;
  type: 'check-in' | 'review' | 'recipe' | 'achievement' | 'bar-crawl' | 'photo-share';
  description: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  location?: string;
  likes: number;
  isLiked: boolean;
  imageUrl?: string;
}

export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event';
  title: string;
  description: string;
  confidence: number;
  imageUrl?: string;
}
