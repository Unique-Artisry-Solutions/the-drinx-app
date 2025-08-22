
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sent_at: string;
  is_from_promoter?: boolean;
  sender?: {
    id?: string;
    display_name: string;
    username: string;
  };
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  isOptimistic?: boolean;
  read_at?: string;
}

export interface MessageThread {
  id: string;
  venue_id: string;
  promoter_id: string;
  subject: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  venueName?: string;
  lastMessage?: string;
}

export interface ThreadInfo {
  venueName: string;
  promoterName: string;
  subject: string;
  venueId: string;
}

export type UserType = 'promoter' | 'establishment';
