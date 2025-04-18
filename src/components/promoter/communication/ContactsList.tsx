
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { VenueContact } from '@/hooks/promoter/types';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useToast } from '@/hooks/use-toast';

interface ContactsListProps {
  onThreadCreated?: (threadId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ onThreadCreated }) => {
  const { contacts: initialContacts, isLoading, error: contactsError, refetch } = usePromoterContacts();
  const [contacts, setContacts] = useState<VenueContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingContact, setProcessingContact] = useState<string | null>(null);
  const { createThread } = useMessageSystem('promoter');
  const { toast } = useToast();
  
  useEffect(() => {
    if (initialContacts) {
      setContacts(initialContacts);
    }
  }, [initialContacts]);

  const filteredContacts = contacts.filter(
    contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               contact.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartConversation = async (contact: VenueContact) => {
    try {
      setProcessingContact(contact.id);
      const threadId = await createThread(contact.venueId);
      if (onThreadCreated && threadId) {
        onThreadCreated(threadId);
      }
      toast({
        title: "Success",
        description: `Started conversation with ${contact.venueName}`,
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingContact(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span>Venue Contacts</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-pulse flex flex-col gap-3 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-100 rounded-md w-full"></div>
              ))}
            </div>
          </div>
        ) : contactsError ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p className="text-gray-600 mb-2">Failed to load contacts</p>
            <p className="text-sm text-gray-500 mb-4">Please try again later</p>
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center p-6">
            {searchQuery ? (
              <p className="text-gray-500">No contacts match your search</p>
            ) : (
              <>
                <p className="text-gray-500 mb-2">No contacts found</p>
                <p className="text-sm text-gray-400">Connect with venues to see them here</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 rounded-md border hover:bg-gray-50 cursor-pointer"
                onClick={() => handleStartConversation(contact)}
              >
                <div>
                  <h3 className="font-medium">{contact.name}</h3>
                  <p className="text-sm text-gray-500">{contact.role} - {contact.venueName}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  disabled={processingContact === contact.id}
                >
                  {processingContact === contact.id ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  <span className="sr-only">Message</span>
                </Button>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 flex justify-end">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsList;
