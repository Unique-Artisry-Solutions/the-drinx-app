
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import { useMessageThread } from '@/hooks/messages/useMessageThread';
import MessageList from './messages/MessageList';
import MessageInput from './messages/MessageInput';
import ThreadHeader from './messages/ThreadHeader';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ 
  threadId, 
  userType = 'promoter' 
}) => {
  const { user } = useAuth();
  const { sendMessage } = useMessageSystem(userType as any);
  const { 
    messages, 
    loading, 
    error, 
    threadInfo, 
    handleArchiveThread, 
    fetchMessages 
  } = useMessageThread(threadId);

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please log in to view messages.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <ThreadHeader
          venueName={threadInfo.venueName}
          subject={threadInfo.subject}
          onArchive={handleArchiveThread}
          onRefresh={fetchMessages}
          loading={loading}
        />
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 mb-4 max-h-[500px]">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse flex flex-col gap-3 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-md w-3/4"></div>
              ))}
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages in this conversation yet</p>
            <p className="text-sm text-gray-400 mt-1">Type below to send the first message</p>
          </div>
        ) : (
          <MessageList messages={messages} userId={user.id} />
        )}
      </CardContent>

      <MessageInput
        onSendMessage={async (content) => {
          if (!threadId) return;
          await sendMessage(threadId, content);
          setTimeout(() => fetchMessages(), 500);
        }}
        disabled={loading}
      />
    </Card>
  );
};

export default MessageThread;
