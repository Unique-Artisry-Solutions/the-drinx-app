
import React from 'react';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { VenueContact } from '@/hooks/promoter/types';
import { usePromoterContacts } from '@/hooks/promoter/usePromoterContacts';
import { usePromoterRole } from '@/hooks/promoter/usePromoterRole';
import { useToast } from '@/hooks/use-toast';
import { requireAuthentication } from '@/utils/impersonationAuth';
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

  const handleSendMessage = async (venueId: string, content: string) => {
    try {
      console.log('🚀 Starting message send process...');
      
      // First activate the promoter role
      await ensurePromoterRole();
      
      // Add a delay to ensure role switch is propagated
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let threadId = existingThreadId;
      
      if (!threadId) {
        console.log('📝 Creating new thread for venue:', venueId);
        const createdThreadId = await createThread(venueId);
        if (!createdThreadId) {
          throw new Error("Failed to create conversation thread");
        }
        threadId = createdThreadId;
        console.log('✅ Thread created:', threadId);
      } else {
        console.log('📝 Using existing thread:', threadId);
      }

      // Get the current user ID with impersonation awareness
      console.log('🔐 Getting authenticated user ID...');
      const userId = await requireAuthentication();
      console.log('✅ Authenticated user ID:', userId);

      // Send the message
      console.log('📤 Sending message to thread:', threadId);
      await sendMessage(threadId, content, userId);
      
      toast({
        title: "Message Sent",
        description: "Your message was sent successfully.",
      });
      
      onClose();
    } catch (err: any) {
      console.error('❌ Error sending message:', err);
      
      // Create more descriptive error message
      let errorDescription = "There was a problem sending your message. Please try again.";
      
      if (err.message?.includes('not authenticated')) {
        errorDescription = "Authentication issue detected. Please refresh the page and try again.";
      } else if (err.message?.includes('RLS')) {
        errorDescription = "Permission denied. Please check your authentication status.";
      } else if (err.message?.includes('thread')) {
        errorDescription = "Failed to create conversation thread. Please try again.";
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
