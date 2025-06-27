
export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
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

export type UserType = 'promoter' | 'establishment';
