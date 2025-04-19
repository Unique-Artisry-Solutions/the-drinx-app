
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  Send,
  X,
  Loader2
} from 'lucide-react';
import { VenueContact } from '@/hooks/promoter/types';

interface MessageComposerProps {
  onClose: () => void;
  onSendMessage: (venueId: string, message: string) => Promise<void>;
  contacts: VenueContact[];
  isLoading?: boolean;
}

const MessageComposer: React.FC<MessageComposerProps> = ({
  onClose,
  onSendMessage,
  contacts,
  isLoading
}) => {
  const [selectedVenue, setSelectedVenue] = useState<VenueContact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const filteredContacts = contacts.filter(contact =>
    contact.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = async () => {
    if (!selectedVenue || !message.trim() || sending) return;
    
    setSending(true);
    try {
      await onSendMessage(selectedVenue.venueId, message.trim());
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="w-[400px] shadow-lg">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">New Message</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {!selectedVenue ? (
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
              
              <div className="max-h-[200px] overflow-y-auto space-y-2 rounded-md border bg-background p-2">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                  </div>
                ) : filteredContacts.length > 0 ? (
                  filteredContacts.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => setSelectedVenue(venue)}
                      className="w-full p-3 text-left rounded-md hover:bg-accent transition-colors flex items-center justify-between group"
                    >
                      <span>{venue.venueName}</span>
                      <span className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100">
                        Select
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">
                    {searchQuery ? 'No matching venues found' : 'No venues available'}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">To:</p>
                  <p className="font-medium">{selectedVenue.venueName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedVenue(null)}
                >
                  Change
                </Button>
              </div>

              <Textarea
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px]"
              />

              <div className="flex justify-end">
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageComposer;
