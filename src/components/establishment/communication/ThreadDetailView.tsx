import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useMessageThread } from '@/hooks/messages/useMessageThread';
import { useEstablishmentMessageSystem } from '@/hooks/establishment/useMessageSystem';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import ThreadHeader from '@/components/promoter/communication/messages/ThreadHeader';
import MessageList from '@/components/promoter/communication/messages/MessageList';
import MessageInput from '@/components/promoter/communication/messages/MessageInput';
import MessageErrorBoundary from '@/components/promoter/communication/messages/MessageErrorBoundary';
import MessageLoadingState from '@/components/promoter/communication/messages/MessageLoadingState';

interface ThreadDetailViewProps {
  threadId: string;
}

const ThreadDetailView: React.FC<ThreadDetailViewProps> = ({ threadId }) => {
  const navigate = useNavigate();
  const { user, userType } = useAuthenticatedUser();
  
  const {
    messages,
    loading,
    error,
    threadInfo,
    handleArchiveThread,
    fetchMessages,
    retryFetch
  } = useMessageThread(threadId);

  // Setup message sending with user-type aware system
  const { sendMessage: establishmentSendMessage } = useEstablishmentMessageSystem(userType);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!threadId || !content.trim()) return;
    
    try {
      await establishmentSendMessage(threadId, content);
      // Messages will be updated via real-time subscription
    } catch (error) {
      // Error handling is done in the hook
      console.error('Error in thread detail send message:', error);
    }
  }, [threadId, establishmentSendMessage]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleBackToAllActions = () => {
    navigate(`/${userType}/all-actions`);
  };

  const handleRefresh = () => {
    fetchMessages();
  };

  // Updated to use the direct handler
  const handleSendMessageWrapper = handleSendMessage;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={handleBackToAllActions}
          className="flex items-center gap-2 hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Actions
        </Button>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <ThreadHeader
            venueName={threadInfo.venueName}
            subject={threadInfo.subject}
            onArchive={handleArchiveThread}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </CardHeader>
        
        <CardContent className="p-0">
          <MessageErrorBoundary error={error} onRetry={retryFetch}>
            <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-6 space-y-4">
              {loading ? (
                <MessageLoadingState />
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No messages in this conversation yet.</p>
                </div>
              ) : (
                <MessageList 
                  messages={messages} 
                  userId={user?.id} 
                  showDeliveryStatus={true}
                />
              )}
            </div>
          </MessageErrorBoundary>

          {/* Message Input */}
          <div className="border-t bg-muted/30">
            <MessageInput 
              onSendMessage={handleSendMessageWrapper}
              disabled={loading}
              threadId={threadId}
              placeholder="Type your message..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreadDetailView;