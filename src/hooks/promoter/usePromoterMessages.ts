
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { MessageThread } from './types';

export const usePromoterMessages = () => {
  const { toast } = useToast();
  const [conversations, setConversations] = useState<MessageThread[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from API/database
    // For now, we're using mock data
    const mockConversations: MessageThread[] = [
      {
        id: '1',
        venueName: 'Downtown Club',
        eventName: 'Summer Mixer',
        lastMessage: 'Can we discuss the setup requirements for the event?',
        timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
        isRead: false,
        isArchived: false,
        messages: [
          {
            id: '101',
            text: 'Hello, I wanted to discuss the Summer Mixer event we have scheduled.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
            isFromPromoter: false,
            senderName: 'Alex (Downtown Club)'
          },
          {
            id: '102',
            text: 'Can we discuss the setup requirements for the event?',
            timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(), // 25 mins ago
            isFromPromoter: false,
            senderName: 'Alex (Downtown Club)'
          }
        ]
      },
      {
        id: '2',
        venueName: 'Skyline Lounge',
        lastMessage: 'We\'ve approved your event request for next month.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        isRead: true,
        isArchived: false,
        messages: [
          {
            id: '201',
            text: 'We\'ve approved your event request for next month.',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
            isFromPromoter: false,
            senderName: 'Jamie (Skyline Lounge)'
          }
        ]
      },
      {
        id: '3',
        venueName: 'Harbor View',
        eventName: 'Cocktail Fundraiser',
        lastMessage: 'Thank you for organizing such a successful event!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        isRead: true,
        isArchived: true,
        messages: [
          {
            id: '301',
            text: 'Thank you for organizing such a successful event!',
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
            isFromPromoter: false,
            senderName: 'Taylor (Harbor View)'
          }
        ]
      }
    ];

    setConversations(mockConversations);
    setUnreadCount(mockConversations.filter(c => !c.isRead).length);
    setIsLoading(false);
  }, []);

  const markAsRead = (conversationId: string) => {
    setConversations(prevConversations => 
      prevConversations.map(conversation => {
        if (conversation.id === conversationId && !conversation.isRead) {
          return { ...conversation, isRead: true };
        }
        return conversation;
      })
    );
    
    // Update unread count
    setUnreadCount(prevCount => Math.max(0, prevCount - 1));
  };

  const archiveConversation = (conversationId: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conversation => {
        if (conversation.id === conversationId) {
          return { ...conversation, isArchived: true };
        }
        return conversation;
      })
    );
    
    toast({
      title: 'Conversation archived',
      description: 'You can find it in the archived tab',
    });
  };

  const sendMessage = (conversationId: string, messageText: string) => {
    // In a real app, this would call an API
    const newMessage = {
      id: `msg_${Date.now()}`,
      text: messageText,
      timestamp: new Date().toISOString(),
      isFromPromoter: true,
      senderName: 'You'
    };

    setConversations(prevConversations =>
      prevConversations.map(conversation => {
        if (conversation.id === conversationId) {
          return {
            ...conversation,
            lastMessage: messageText,
            timestamp: newMessage.timestamp,
            messages: [...conversation.messages, newMessage]
          };
        }
        return conversation;
      })
    );

    toast({
      title: 'Message sent',
      description: 'Your message has been delivered',
    });

    return newMessage;
  };

  return {
    conversations,
    unreadCount,
    activeTab,
    isLoading,
    setActiveTab,
    markAsRead,
    archiveConversation,
    sendMessage
  };
};
