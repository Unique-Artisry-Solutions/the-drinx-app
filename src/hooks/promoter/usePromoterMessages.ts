import { useState, useEffect, useCallback } from 'react';
import { MessageThread, Message } from '../messages/types';

export const usePromoterMessages = () => {
  const [conversations, setConversations] = useState<MessageThread[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Load mock conversation data
  useEffect(() => {
    const mockConversations: MessageThread[] = [
      {
        id: 'thread1',
        venue_id: 'venue1',
        venueName: 'Downtown Club',
        eventName: 'Summer Launch Party',
        lastMessage: 'Can we discuss the available dates for July?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        isRead: false,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            content: 'Hi there! I\'m interested in hosting an event at your venue.',
            sent_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg2',
            content: 'Hello! We\'d be happy to discuss. What kind of event are you planning?',
            sent_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            sender_id: 'user2',
            is_from_promoter: false,
            sender: { display_name: 'Alex Johnson' }
          },
          {
            id: 'msg3',
            content: 'I\'m planning a summer launch party for a new product. Looking for availability in July.',
            sent_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg4',
            content: 'Can we discuss the available dates for July?',
            sent_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            sender_id: 'user2',
            is_from_promoter: false,
            sender: { display_name: 'Alex Johnson' }
          }
        ]
      },
      {
        id: 'thread2',
        venue_id: 'venue2',
        venueName: 'Skyline Lounge',
        lastMessage: 'The booking has been confirmed for next Friday.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        isRead: true,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            content: 'I\'d like to book your venue for a corporate event next Friday.',
            sent_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg2',
            content: 'We have availability that day. What time are you thinking?',
            sent_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
            sender_id: 'user3',
            is_from_promoter: false,
            sender: { display_name: 'Jamie Smith' }
          },
          {
            id: 'msg3',
            content: 'Around 7pm until midnight. Will that work?',
            sent_at: new Date(Date.now() - 1000 * 60 * 150).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg4',
            content: 'The booking has been confirmed for next Friday.',
            sent_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            sender_id: 'user3',
            is_from_promoter: false,
            sender: { display_name: 'Jamie Smith' }
          }
        ]
      },
      {
        id: 'thread3',
        venue_id: 'venue3',
        venueName: 'Harbor View',
        lastMessage: 'Thank you for your inquiry. Unfortunately, we are fully booked on that date.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isRead: false,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            content: 'Do you have availability on June 15th for a private event?',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg2',
            content: 'Thank you for your inquiry. Unfortunately, we are fully booked on that date.',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            sender_id: 'user4',
            is_from_promoter: false,
            sender: { display_name: 'Taylor Wilson' }
          }
        ]
      },
      {
        id: 'thread4',
        venue_id: 'venue4',
        venueName: 'Sunset Terrace',
        eventName: 'Networking Mixer',
        lastMessage: 'We look forward to hosting your event!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        isRead: true,
        isArchived: true,
        messages: [
          {
            id: 'msg1',
            content: 'I\'d like to confirm our networking mixer for next month.',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg2',
            content: 'Yes, we have you down for the 20th from 6-9pm.',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(),
            sender_id: 'user5',
            is_from_promoter: false,
            sender: { display_name: 'Casey Rodriguez' }
          },
          {
            id: 'msg3',
            content: 'Perfect, thank you!',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
            sender_id: 'user1',
            is_from_promoter: true,
            sender: { display_name: 'You' }
          },
          {
            id: 'msg4',
            content: 'We look forward to hosting your event!',
            sent_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
            sender_id: 'user5',
            is_from_promoter: false,
            sender: { display_name: 'Casey Rodriguez' }
          }
        ]
      }
    ];
    
    setConversations(mockConversations);
  }, []);

  // Update unread count whenever conversations change
  useEffect(() => {
    const count = conversations.filter(conv => !conv.isRead && !conv.isArchived).length;
    setUnreadCount(count);
  }, [conversations]);

  // Mark a thread as read
  const markAsRead = useCallback((threadId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === threadId ? { ...conv, isRead: true } : conv
      )
    );
  }, []);

  // Archive a thread
  const archiveThread = useCallback((threadId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === threadId ? { ...conv, isArchived: true } : conv
      )
    );
  }, []);

  // Get a specific message thread
  const getMessageThread = useCallback((threadId: string) => {
    return conversations.find(conv => conv.id === threadId);
  }, [conversations]);

  // Send a new message in a thread
  const sendMessage = useCallback((threadId: string, text: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content: text,
      sent_at: new Date().toISOString(),
      sender_id: 'user1', // Assuming current user is sender
      is_from_promoter: true,
      sender: { display_name: 'You' }
    };

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === threadId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: text,
            timestamp: newMessage.sent_at
          };
        }
        return conv;
      })
    );
  }, []);
  
  // Create a new message thread
  const createThread = useCallback((venueName: string, eventName: string | undefined, initialMessage: string) => {
    const newThread: MessageThread = {
      id: `thread-${Date.now()}`,
      venue_id: 'venue5', // Mock venue ID
      venueName,
      eventName,
      lastMessage: initialMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      isArchived: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: initialMessage,
          sent_at: new Date().toISOString(),
          sender_id: 'user1',
          is_from_promoter: true,
          sender: { display_name: 'You' }
        }
      ]
    };

    setConversations(prev => [newThread, ...prev]);
    return newThread.id;
  }, []);

  return {
    conversations,
    unreadCount,
    activeTab,
    setActiveTab,
    markAsRead,
    archiveThread,
    getMessageThread,
    sendMessage,
    createThread
  };
};
