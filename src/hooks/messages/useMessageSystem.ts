
import { useState, useEffect, useCallback } from 'react';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { MessageThread, UserType } from './types';
import { useThreads } from './useThreads';
import { useMessages } from './useMessages';
import { useThreadReadStatus } from './useThreadReadStatus';

export const useMessageSystem = (userType: UserType) => {
  const { user } = useAuthenticatedUser();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  const { threads, setThreads, loading, error, fetchThreads } = useThreads(userType, user?.id);
  const { fetchMessages, sendMessage } = useMessages(userType);
  const { updateThreadReadStatus, markThreadAsRead } = useThreadReadStatus(user?.id);

  useEffect(() => {
    if (user?.id) {
      fetchThreads();
    }
  }, [user?.id, fetchThreads]);

  useEffect(() => {
    if (threads.length > 0) {
      updateThreadReadStatus(threads).then(updatedThreads => {
        setThreads(updatedThreads);
      });
    }
  }, [threads, updateThreadReadStatus]);

  const handleSelectThread = useCallback(async (threadId: string) => {
    try {
      await markThreadAsRead(threadId);
      setSelectedThreadId(threadId);
      
      const messages = await fetchMessages(threadId);
      setThreads(prevThreads =>
        prevThreads.map(thread =>
          thread.id === threadId ? { ...thread, messages, isRead: true } : thread
        )
      );
    } catch (err) {
      console.error('Error handling thread selection:', err);
    }
  }, [markThreadAsRead, fetchMessages, setThreads]);

  const handleSendMessage = useCallback(async (threadId: string, content: string) => {
    if (!user?.id) return;
    
    await sendMessage(threadId, content, user.id);
    await fetchThreads();
  }, [user?.id, sendMessage, fetchThreads]);

  return {
    threads,
    loading,
    error,
    selectedThreadId,
    setSelectedThreadId: handleSelectThread,
    markThreadAsRead,
    sendMessage: handleSendMessage,
    refetchThreads: fetchThreads
  };
};

export type { Message, MessageThread } from './types';
