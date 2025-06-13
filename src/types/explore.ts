
export interface Promoter {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  is_verified: boolean;
  category: string;
  tags: string[];
  follower_count: number;
  event_count: number;
  rating?: number;
  location?: string;
}

export interface SwigCircuit {
  id: string;
  name: string;
  description?: string;
  theme: string;
  difficulty: string;
  duration: string;
  stops: number;
  participants: number;
  date: string;
  establishments: any[];
}
