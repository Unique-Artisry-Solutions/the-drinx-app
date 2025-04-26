
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { MessageThread, UserType } from './types';
import { useThreads } from './useThreads';
import { useMessages } from './useMessages';
import { useThreadReadStatus } from './useThreadReadStatus';
import { useThreadCreation } from './useThreadCreation';
import { useThreadSelection } from './useThreadSelection';
import { useMessageSending } from './useMessageSending';

export const useMessageSystem = (userType: UserType) => {
  const { user } = useAuthenticatedUser();
  const { threads, setThreads, loading, error, fetchThreads } = useThreads(userType, user?.id);
  const { fetchMessages, sendMessage } = useMessages(userType);
  const threadReadStatus = useThreadReadStatus(user?.id);
  const { createThread, isCreating } = useThreadCreation();
  
  const { selectedThreadId, setSelectedThreadId } = useThreadSelection(
    setThreads,
    threadReadStatus.markThreadAsRead,
    fetchMessages
  );

  return {
    threads,
    loading,
    error,
    selectedThreadId,
    setSelectedThreadId,
    markThreadAsRead: threadReadStatus.markThreadAsRead,
    sendMessage,
    createThread,
    isCreating,
    refetchThreads: fetchThreads
  };
};

export type { Message, MessageThread } from './types';
