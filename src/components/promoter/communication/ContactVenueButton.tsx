
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { VenueContact } from '@/hooks/promoter/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ChatWidget from '@/components/chat/ChatWidget';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface ContactVenueButtonProps {
  establishmentId: string;
  establishmentName: string;
}

const ContactVenueButton: React.FC<ContactVenueButtonProps> = ({ 
  establishmentId, 
  establishmentName 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

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
      // Check if user is a promoter
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile?.user_type !== 'promoter') {
        toast({
          title: "Access Denied",
          description: "Only promoters can contact venues",
          variant: "destructive",
        });
        return;
      }

      // Check if the user has an active promoter role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter')
        .single();

      if (roleError) throw roleError;

      if (!roleData?.is_active) {
        // If they have the role but it's not active, activate it
        const { error: switchError } = await supabase.rpc('switch_active_role', {
          role_to_activate: 'promoter'
        });

        if (switchError) throw switchError;

        toast({
          title: "Role Activated",
          description: "Your promoter role has been activated",
        });
      }

      setIsOpen(true);
    } catch (error: any) {
      console.error('Error checking user type:', error);
      toast({
        title: "Error",
        description: "Unable to verify permissions. Please try again.",
        variant: "destructive",
      });
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
