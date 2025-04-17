
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, UserPlus } from 'lucide-react';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';

interface ContactsListProps {
  onSelectContact: (contactId: string) => void;
}

const ContactsList: React.FC<ContactsListProps> = ({ onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { contacts, isLoading } = usePromoterContacts();
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.venueName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Venue Contacts</span>
          <Button size="sm" variant="outline" className="h-8">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
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
          <div className="py-8 text-center">Loading contacts...</div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No contacts found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className="p-3 rounded-lg border border-border flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Avatar>
                  <AvatarFallback>
                    {contact.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.role} at {contact.venueName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContactsList;
