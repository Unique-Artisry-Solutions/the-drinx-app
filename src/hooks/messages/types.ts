
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

export interface ThreadInfo {
  venueName: string;
  promoterName: string;
  subject: string;
}

export type UserType = 'promoter' | 'establishment';

export interface MessageThread {
  id: string;
  venue_id: string;
  promoter_id: string; // Making this required to match the usage in EstablishmentInbox
  subject?: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  venueName?: string;
  messages?: Message[];
  lastMessage?: string;
}
