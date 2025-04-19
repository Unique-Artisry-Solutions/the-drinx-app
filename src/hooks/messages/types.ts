
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
