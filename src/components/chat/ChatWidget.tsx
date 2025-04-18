
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X, AlertCircle, Loader2, Search } from 'lucide-react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { VenueContact } from '@/hooks/promoter/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth';
import VenueSelectionCard from '../promoter/communication/VenueSelectionCard';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { usePromoterRole } from '@/hooks/promoter/usePromoterRole';

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
  const [isCreatingThread, setIsCreatingThread] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<VenueContact | undefined>(contact);
  const [searchQuery, setSearchQuery] = useState('');
  const { createThread, sendMessage } = useMessageSystem('promoter');
  const { user } = useAuth();
  const { contacts, isLoading } = usePromoterContacts();
  const { ensurePromoterRole, isActivating } = usePromoterRole();

  const filteredContacts = contacts.filter(c => 
    c.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !selectedVenue) return;

    try {
      setSending(true);
      setError(null);
      
      let threadId = existingThreadId;
      
      if (!threadId) {
        setIsCreatingThread(true);
        
        try {
          console.log('Starting conversation creation process');
          // First activate the promoter role
          await ensurePromoterRole();
          
          console.log('Role activated, creating thread');
          // Add a delay to ensure role switch is propagated
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const createdThreadId = await createThread(selectedVenue.venueId);
          console.log('Thread created:', createdThreadId);
          
          if (!createdThreadId) throw new Error("Failed to create conversation thread");
          threadId = createdThreadId;
        } catch (err: any) {
          console.error('Error creating thread:', err);
          setError(err.message || 'Failed to create conversation. Please try again later.');
          return;
        } finally {
          setIsCreatingThread(false);
        }
      }

      if (threadId) {
        console.log('Sending message to thread:', threadId);
        await sendMessage(threadId, message);
        setMessage('');
        onClose(); // Close the widget after sending
      } else {
        setError('Could not determine where to send this message.');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message. Please try again.');
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
    <Card className="w-[400px] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {selectedVenue ? `Message ${selectedVenue.venueName}` : 'New Message'}
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
          {!selectedVenue && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  </div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((venue) => (
                    <VenueSelectionCard
                      key={venue.id}
                      venueName={venue.venueName}
                      isSelected={selectedVenue?.id === venue.id}
                      onClick={() => setSelectedVenue(venue)}
                    />
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    No venues found
                  </p>
                )}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {selectedVenue && (
            <>
              <div className="min-h-[100px] max-h-[200px] overflow-y-auto p-2 bg-gray-50 rounded">
                {isCreatingThread || isActivating ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                    <p className="text-sm text-gray-500 mt-2">
                      {isActivating ? 'Activating promoter role...' : 'Creating conversation...'}
                    </p>
                  </div>
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
                  disabled={sending || isCreatingThread || isActivating}
                />
                <Button
                  size="icon"
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sending || isCreatingThread || isActivating}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatWidget;
