
import React from 'react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { VenueContact } from '@/hooks/promoter/types';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { usePromoterRole } from '@/hooks/promoter/usePromoterRole';
import { useToast } from '@/hooks/use-toast';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import MessageComposer from '../promoter/communication/messages/MessageComposer';

interface ChatWidgetProps {
  contact?: VenueContact;
  onClose: () => void;
  existingThreadId?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ 
  contact,
  onClose,
  existingThreadId 
}) => {
  const { createThread, sendMessage } = useMessageSystem('promoter');
  const { contacts, isLoading } = usePromoterContacts();
  const { ensurePromoterRole } = usePromoterRole();
  const { toast } = useToast();
  const { user } = useAuthenticatedUser();

  const handleSendMessage = async (venueId: string, content: string) => {
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // First activate the promoter role
      await ensurePromoterRole();
      
      // Add a delay to ensure role switch is propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let threadId = existingThreadId;
      
      if (!threadId) {
        const createdThreadId = await createThread(venueId);
        if (!createdThreadId) {
          throw new Error("Failed to create conversation thread");
        }
        threadId = createdThreadId;
      }

      // Send the message using the authenticated user's ID
      await sendMessage(threadId, content, user.id);
      
      toast({
        title: "Message Sent",
        description: "Your message was sent successfully.",
      });
      
      onClose();
    } catch (err: any) {
      console.error('Error sending message:', err);
      
      toast({
        title: "Error Sending Message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <MessageComposer
      onClose={onClose}
      onSendMessage={handleSendMessage}
      contacts={contacts}
      isLoading={isLoading}
    />
  );
};

export default ChatWidget;
