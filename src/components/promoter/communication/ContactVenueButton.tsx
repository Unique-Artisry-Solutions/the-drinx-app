
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VenueContact } from '@/hooks/promoter/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChatWidget from '@/components/chat/ChatWidget';

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

  // Check if user is a promoter
  React.useEffect(() => {
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

  if (!isPromoter) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          onClick={() => setIsOpen(true)}
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
