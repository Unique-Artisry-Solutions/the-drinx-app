
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { VenueContact } from '@/hooks/promoter/types';

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

  // Check if user is a promoter
  React.useEffect(() => {
    const userType = localStorage.getItem('user_type');
    setIsPromoter(userType === 'promoter');
  }, []);

  const handleContactClick = () => {
    // Create a contact object to pass to the communication page
    const venueContact: VenueContact = {
      id: `contact-${establishmentId}`,
      name: establishmentName,
      role: 'Venue',
      venueId: establishmentId,
      venueName: establishmentName
    };
    
    // Encode the contact details to pass as URL parameters
    const contactParams = encodeURIComponent(JSON.stringify(venueContact));
    navigate(`/promoter/communication?newContact=${contactParams}`);
  };

  // Only show button for promoters
  if (!isPromoter) return null;

  return (
    <Button 
      onClick={handleContactClick}
      className="flex items-center gap-2"
      variant="outline"
    >
      <MessageSquare className="h-4 w-4" />
      Contact Venue
    </Button>
  );
};

export default ContactVenueButton;
