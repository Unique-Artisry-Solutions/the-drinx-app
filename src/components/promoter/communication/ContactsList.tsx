
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Users } from 'lucide-react';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { VenueContact } from '@/hooks/promoter/types';
import { useNavigate } from 'react-router-dom';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useToast } from '@/hooks/use-toast';

interface ContactsListProps {
  onThreadCreated?: (threadId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ onThreadCreated }) => {
  const { contacts: initialContacts, isLoading } = usePromoterContacts();
  const [contacts, setContacts] = useState<VenueContact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
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
      const threadId = await createThread(contact.venueId);
      if (onThreadCreated) {
        onThreadCreated(threadId);
      }
    } catch (error) {
      console.error('Error creating thread:', error);
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>Venue Contacts</span>
        </CardTitle>
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
            <p>Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">No contacts found</p>
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
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
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
