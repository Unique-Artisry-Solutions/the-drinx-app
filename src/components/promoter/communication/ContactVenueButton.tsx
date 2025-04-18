
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { VenueContact } from '@/hooks/promoter/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChatWidget from '@/components/chat/ChatWidget';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { usePromoterRole } from '@/hooks/promoter/usePromoterRole';

interface ContactVenueButtonProps {
  establishmentId: string;
  establishmentName: string;
}

const ContactVenueButton: React.FC<ContactVenueButtonProps> = ({ 
  establishmentId, 
  establishmentName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { ensurePromoterRole, isActivating } = usePromoterRole();

  const venueContact: VenueContact = {
    id: `contact-${establishmentId}`,
    name: establishmentName,
    role: 'Venue',
    venueId: establishmentId,
    venueName: establishmentName
  };

  const handleOpenChat = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to contact venues",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting chat initialization');
      
      // Ensure promoter role is active
      await ensurePromoterRole();
      console.log('Promoter role activated, opening chat');
      
      setIsOpen(true);
    } catch (error: any) {
      console.error('Error preparing chat:', error);
      toast({
        title: "Error",
        description: error.message || "Unable to start chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Only render if user is authenticated
  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          onClick={handleOpenChat}
          className="flex items-center gap-2"
          variant="outline"
          disabled={isLoading || isActivating}
        >
          <MessageSquare className="h-4 w-4" />
          {isLoading || isActivating ? 'Preparing...' : 'Contact Venue'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 border-none" align="end">
        <ChatWidget 
          contact={venueContact}
          onClose={() => setIsOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default ContactVenueButton;
