
export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderName: string;
  isFromPromoter: boolean;
  senderId?: string;
}

export interface MessageThread {
  id: string;
  venueName: string;
  eventName?: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isArchived: boolean;
  messages: Message[];
}

export interface VenueContact {
  id: string;
  name: string;
  role: string;
  venueId: string;
  venueName: string;
}
