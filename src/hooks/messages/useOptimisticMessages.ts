import { useState, useCallback } from 'react';
import { Message } from './types';

interface OptimisticMessage extends Message {
  status?: 'sending' | 'sent' | 'failed';
  isOptimistic?: boolean;
}

export const useOptimisticMessages = () => {
  const [optimisticMessages, setOptimisticMessages] = useState<Map<string, OptimisticMessage>>(new Map());

  const addOptimisticMessage = useCallback((message: OptimisticMessage) => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      newMap.set(message.id, { ...message, isOptimistic: true, status: 'sending' });
      return newMap;
    });
  }, []);

  const updateOptimisticMessage = useCallback((messageId: string, status: 'sent' | 'failed') => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(messageId);
      if (existing) {
        newMap.set(messageId, { ...existing, status });
      }
      return newMap;
    });
  }, []);

  const removeOptimisticMessage = useCallback((messageId: string) => {
    setOptimisticMessages(prev => {
      const newMap = new Map(prev);
      newMap.delete(messageId);
      return newMap;
    });
  }, []);

  const mergeWithRealMessages = useCallback((realMessages: Message[]): OptimisticMessage[] => {
    const optimisticArray = Array.from(optimisticMessages.values());
    
    // Filter out optimistic messages that have been confirmed (exist in real messages)
    const pendingOptimistic = optimisticArray.filter(opt => 
      !realMessages.some(real => 
        real.content === opt.content && 
        real.sender_id === opt.sender_id &&
        Math.abs(new Date(real.sent_at).getTime() - new Date(opt.sent_at).getTime()) < 5000 // Within 5 seconds
      )
    );

    // Convert real messages to OptimisticMessage format and combine
    const realAsOptimistic: OptimisticMessage[] = realMessages.map(msg => ({
      ...msg,
      status: (['sending', 'sent', 'failed'].includes(msg.status || '')) 
        ? (msg.status as 'sending' | 'sent' | 'failed') 
        : 'sent',
      isOptimistic: false
    }));

    const combined = [...realAsOptimistic, ...pendingOptimistic];
    return combined.sort((a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime());
  }, [optimisticMessages]);

  const clearOptimisticMessages = useCallback(() => {
    setOptimisticMessages(new Map());
  }, []);

  return {
    optimisticMessages,
    addOptimisticMessage,
    updateOptimisticMessage,
    removeOptimisticMessage,
    mergeWithRealMessages,
    clearOptimisticMessages
  };
};