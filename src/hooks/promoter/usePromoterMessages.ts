
import { useState, useEffect, useCallback } from 'react';
import { MessageThread, Message } from './types';

export const usePromoterMessages = () => {
  const [conversations, setConversations] = useState<MessageThread[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);

  // Load mock conversation data
  useEffect(() => {
    // In a real implementation, this would fetch from API/database
    const mockConversations: MessageThread[] = [
      {
        id: 'thread1',
        venueName: 'Downtown Club',
        eventName: 'Summer Launch Party',
        lastMessage: 'Can we discuss the available dates for July?',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        isRead: false,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            text: 'Hi there! I\'m interested in hosting an event at your venue.',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg2',
            text: 'Hello! We\'d be happy to discuss. What kind of event are you planning?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
            isFromPromoter: false,
            senderName: 'Alex Johnson'
          },
          {
            id: 'msg3',
            text: 'I\'m planning a summer launch party for a new product. Looking for availability in July.',
            timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg4',
            text: 'Can we discuss the available dates for July?',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
            isFromPromoter: false,
            senderName: 'Alex Johnson'
          }
        ]
      },
      {
        id: 'thread2',
        venueName: 'Skyline Lounge',
        lastMessage: 'The booking has been confirmed for next Friday.',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        isRead: true,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            text: 'I\'d like to book your venue for a corporate event next Friday.',
            timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg2',
            text: 'We have availability that day. What time are you thinking?',
            timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
            isFromPromoter: false,
            senderName: 'Jamie Smith'
          },
          {
            id: 'msg3',
            text: 'Around 7pm until midnight. Will that work?',
            timestamp: new Date(Date.now() - 1000 * 60 * 150).toISOString(), // 2.5 hours ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg4',
            text: 'The booking has been confirmed for next Friday.',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
            isFromPromoter: false,
            senderName: 'Jamie Smith'
          }
        ]
      },
      {
        id: 'thread3',
        venueName: 'Harbor View',
        lastMessage: 'Thank you for your inquiry. Unfortunately, we are fully booked on that date.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: false,
        isArchived: false,
        messages: [
          {
            id: 'msg1',
            text: 'Do you have availability on June 15th for a private event?',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), // 25 hours ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg2',
            text: 'Thank you for your inquiry. Unfortunately, we are fully booked on that date.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
            isFromPromoter: false,
            senderName: 'Taylor Wilson'
          }
        ]
      },
      {
        id: 'thread4',
        venueName: 'Sunset Terrace',
        eventName: 'Networking Mixer',
        lastMessage: 'We look forward to hosting your event!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        isRead: true,
        isArchived: true,
        messages: [
          {
            id: 'msg1',
            text: 'I\'d like to confirm our networking mixer for next month.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg2',
            text: 'Yes, we have you down for the 20th from 6-9pm.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 60).toISOString(), // 2.5 days ago
            isFromPromoter: false,
            senderName: 'Casey Rodriguez'
          },
          {
            id: 'msg3',
            text: 'Perfect, thank you!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(), // ~2 days ago
            isFromPromoter: true,
            senderName: 'You'
          },
          {
            id: 'msg4',
            text: 'We look forward to hosting your event!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
            isFromPromoter: false,
            senderName: 'Casey Rodriguez'
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
      text,
      timestamp: new Date().toISOString(),
      isFromPromoter: true,
      senderName: 'You'
    };

    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === threadId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: text,
            timestamp: newMessage.timestamp
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
      venueName,
      eventName,
      lastMessage: initialMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
      isArchived: false,
      messages: [
        {
          id: `msg-${Date.now()}`,
          text: initialMessage,
          timestamp: new Date().toISOString(),
          isFromPromoter: true,
          senderName: 'You'
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
