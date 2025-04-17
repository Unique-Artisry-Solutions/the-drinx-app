
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, AlertCircle } from 'lucide-react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { VenueContact } from '@/hooks/promoter/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';

interface ChatWidgetProps {
  contact?: VenueContact;
  onClose: () => void;
  existingThreadId?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  contact,
  onClose,
  existingThreadId 
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createThread, sendMessage } = useMessageSystem('promoter');
  const { user } = useAuth();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!user) {
      setError("You must be logged in to send messages");
      return;
    }

    try {
      setSending(true);
      setError(null);
      
      let threadId = existingThreadId;
      
      if (!threadId && contact) {
        try {
          threadId = await createThread(contact.venueId);
        } catch (err) {
          console.error('Error creating thread:', err);
          setError('Failed to create conversation. Please try again later.');
          return;
        }
      }

      if (threadId) {
        await sendMessage(threadId, message);
        setMessage('');
      } else {
        setError('Could not determine where to send this message.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!user) {
    return (
      <Card className="w-[320px] shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Authentication Required
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You must be logged in to send messages.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[320px] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {contact ? `Message ${contact.venueName}` : 'New Message'}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-2 bg-gray-50 rounded">
            {error ? (
              <Alert variant="destructive" className="mb-2 p-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            ) : (
              <p className="text-sm text-gray-500 text-center">
                Start a new conversation
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={sending}
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || sending}
            >
              {sending ? (
                <span className="h-4 w-4 animate-spin">⌛</span>
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWidget;
