
import React from 'react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { VenueContact } from '@/hooks/promoter/types';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { usePromoterRole } from '@/hooks/promoter/usePromoterRole';
import { useToast } from '@/hooks/use-toast';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';
import { useImpersonationState } from '@/hooks/useImpersonationState';
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
  const { isImpersonating } = useImpersonationState();

  const handleSendMessage = async (venueId: string, content: string) => {
    console.log('🚀 Starting message send process for venue:', venueId, 'impersonating:', isImpersonating);
    
    try {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Validate venue ID
      if (!venueId || typeof venueId !== 'string') {
        throw new Error("Invalid venue selected");
      }

      // Skip role activation during impersonation
      if (!isImpersonating) {
        console.log('🔐 Activating promoter role for normal user');
        // First activate the promoter role for normal users
        await ensurePromoterRole();
        
        // Add a delay to ensure role switch is propagated
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        console.log('👤 Skipping role activation during impersonation');
      }
      
      let threadId = existingThreadId;
      
      if (!threadId) {
        console.log('🧵 Creating new thread for venue:', venueId);
        const createdThreadId = await createThread(venueId);
        if (!createdThreadId) {
          throw new Error("Failed to create conversation thread");
        }
        threadId = createdThreadId;
        console.log('🧵 Thread created:', threadId);
      } else {
        console.log('🧵 Using existing thread:', threadId);
      }

      // Send the message using the authenticated user's ID
      console.log('💬 Sending message to thread:', threadId);
      await sendMessage(threadId, content, user.id);
      
      toast({
        title: "Message Sent",
        description: "Your message was sent successfully.",
      });
      
      console.log('✅ Message sent successfully');
      onClose();
    } catch (err: any) {
      console.error('❌ Error in message sending flow:', err);
      
      let errorDescription = "There was a problem sending your message. Please try again.";
      
      // Provide more specific error messages based on the error
      if (err.message?.includes('Invalid venue')) {
        errorDescription = "Please select a valid venue and try again.";
      } else if (err.message?.includes('not authenticated')) {
        errorDescription = "Please log in and try again.";
      } else if (err.message?.includes('conversation thread')) {
        errorDescription = "Could not start conversation. Please try selecting a different venue.";
      } else if (err.message?.includes('Invalid conversation')) {
        errorDescription = "Conversation error. Please try starting a new conversation.";
      }
      
      toast({
        title: "Error Sending Message",
        description: errorDescription,
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
