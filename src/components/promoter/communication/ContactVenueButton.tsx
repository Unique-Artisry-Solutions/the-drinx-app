
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
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      
      // First, check if user has the promoter role at all
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('is_active')
        .eq('user_id', user.id)
        .eq('role', 'promoter');

      if (roleError) throw roleError;

      // If no promoter role exists, create it
      if (!roleData || roleData.length === 0) {
        // Add promoter role to the user
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'promoter',
            is_active: false
          });

        if (insertError) throw insertError;
        
        toast({
          title: "Promoter Role Created",
          description: "Promoter role has been created for your account",
        });
      }

      // Now activate the promoter role
      const { error: switchError } = await supabase.rpc('switch_active_role', {
        role_to_activate: 'promoter'
      });

      if (switchError) throw switchError;

      // Update local storage to maintain state
      localStorage.setItem('user_type', 'promoter');
      
      // Update profile to ensure consistent state
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ user_type: 'promoter' })
        .eq('id', user.id);
        
      if (profileError) {
        console.warn('Could not update profile user_type:', profileError);
        // Non-blocking error
      }

      toast({
        title: "Role Activated",
        description: "Your promoter role has been activated",
      });
      
      // Brief delay to ensure database changes propagate
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setIsOpen(true);
    } catch (error: any) {
      console.error('Error preparing promoter role:', error);
      toast({
        title: "Error",
        description: error.message || "Unable to activate promoter role. Please try again.",
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
          disabled={isLoading}
        >
          <MessageSquare className="h-4 w-4" />
          {isLoading ? 'Preparing...' : 'Contact Venue'}
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
