
import { useState, useEffect } from 'react';
import { useThreadFetch } from '../messages/useThreadFetch';
import { useMessageSend } from '../messages/useMessageSend';
import { useThreadReadStatus } from '../messages/useThreadReadStatus';
import { MessageThread } from '../messages/types';

export const useMessageSystem = (userType: 'establishment') => {
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const {
    threads,
    setThreads,
    loading,
    error,
    fetchThreads
  } = useThreadFetch(userType);

  const sendMessage = useMessageSend(fetchThreads);
  const markThreadAsRead = useThreadReadStatus(setThreads, setSelectedThreadId);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  return {
    threads,
    loading,
    error,
    sendMessage,
    markThreadAsRead,
    refetchThreads: fetchThreads,
    selectedThreadId,
    setSelectedThreadId
  };
};
