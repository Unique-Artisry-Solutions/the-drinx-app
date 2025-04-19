
export interface Message {
  id: string;
  content: string;
  sent_at: string;
  sender_id: string;
  is_from_promoter: boolean;
  sender?: {
    display_name?: string;
    username?: string;
  };
}

export interface MessageThread {
  id: string;
  venue_id: string;
  promoter_id?: string;
  subject?: string;
  lastMessage?: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  venueName?: string;
  eventName?: string;
  messages?: Message[];
}

export type UserType = 'promoter' | 'establishment';
