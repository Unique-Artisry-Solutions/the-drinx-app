
export interface Recommendation {
  id: string;
  type: 'establishment' | 'cocktail' | 'event' | 'recipe';
  title: string;
  description: string;
  reason: string;
  imageUrl?: string;
  rating?: number;
  distance?: string;
  date?: string;
  time?: string;
  attendees?: number;
  location?: string;
}
