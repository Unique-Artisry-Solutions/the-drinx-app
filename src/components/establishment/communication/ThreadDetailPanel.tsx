import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useMessageThread } from '@/hooks/messages/useMessageThread';
import { useEstablishmentMessageSystem } from '@/hooks/establishment/useMessageSystem';
import ThreadHeader from '@/components/promoter/communication/messages/ThreadHeader';
import MessageList from '@/components/promoter/communication/messages/MessageList';
import MessageInput from '@/components/promoter/communication/messages/MessageInput';
import MessageErrorBoundary from '@/components/promoter/communication/messages/MessageErrorBoundary';
import MessageLoadingState from '@/components/promoter/communication/messages/MessageLoadingState';

interface ThreadDetailPanelProps {
  threadId: string;
  onBack?: () => void;
  isMobile: boolean;
}

const ThreadDetailPanel: React.FC<ThreadDetailPanelProps> = ({ 
  threadId, 
  onBack,
  isMobile 
}) => {
  const { user } = useAuth();
  const { 
    messages, 
    loading, 
    error, 
    threadInfo, 
    handleArchiveThread, 
    fetchMessages,
    retryFetch 
  } = useMessageThread(threadId);
  
  const { sendMessage } = useEstablishmentMessageSystem('establishment');

  const handleSendMessage = async (content: string) => {
    if (!user?.id) return;
    await sendMessage(threadId, content);
    await fetchMessages(); // Refresh messages after sending
  };

  useEffect(() => {
    if (threadId) {
      fetchMessages();
    }
  }, [threadId, fetchMessages]);

  const handleSendMessageWrapper = async (content: string) => {
    await handleSendMessage(content);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="h-full">
          <MessageLoadingState />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive mb-2">Error loading conversation</p>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={retryFetch} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          {isMobile && onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <div className="flex-1">
            <ThreadHeader
              venueName={threadInfo.venueName || 'Unknown Venue'}
              subject={threadInfo.subject}
              onArchive={handleArchiveThread}
              onRefresh={() => fetchMessages()}
              loading={loading}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden">
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto border rounded-md bg-muted/20 mb-4">
          <MessageErrorBoundary error={error} onRetry={retryFetch}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-muted-foreground">No messages yet</p>
                  <p className="text-sm text-muted-foreground">Start the conversation below</p>
                </div>
              </div>
            ) : (
              <MessageList 
                messages={messages} 
                userId={user?.id} 
                showDeliveryStatus={true}
              />
            )}
          </MessageErrorBoundary>
        </div>

        {/* Message Input */}
        <div className="border-t bg-muted/30 -mx-6 -mb-6">
          <MessageInput 
            onSendMessage={handleSendMessageWrapper}
            disabled={loading}
            threadId={threadId}
            placeholder="Type your message..."
            autoFocus={false}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreadDetailPanel;