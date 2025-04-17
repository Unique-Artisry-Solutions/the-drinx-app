
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VenueContact } from '@/hooks/promoter/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChatWidget from '@/components/chat/ChatWidget';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';

interface ContactVenueButtonProps {
  establishmentId: string;
  establishmentName: string;
}

const ContactVenueButton: React.FC<ContactVenueButtonProps> = ({ 
  establishmentId, 
  establishmentName 
}) => {
  const navigate = useNavigate();
  const [isPromoter, setIsPromoter] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user is a promoter
  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    setIsPromoter(userType === 'promoter');
  }, []);

  const venueContact: VenueContact = {
    id: `contact-${establishmentId}`,
    name: establishmentName,
    role: 'Venue',
    venueId: establishmentId,
    venueName: establishmentName
  };

  const handleOpenChat = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to contact venues",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(true);
  };

  if (!isPromoter) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          onClick={handleOpenChat}
          className="flex items-center gap-2"
          variant="outline"
        >
          <MessageSquare className="h-4 w-4" />
          Contact Venue
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
