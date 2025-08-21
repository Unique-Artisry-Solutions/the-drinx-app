
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
    console.log('🚀 Starting message send process for venue:', venueId);
    
    try {
      // Validate venue ID format and ensure it exists
      console.log('🏢 Validating venue ID:', venueId);
      if (!venueId || typeof venueId !== 'string' || venueId.trim() === '') {
        throw new Error("Invalid venue ID: Empty or invalid format");
      }

      // UUID validation
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(venueId)) {
        throw new Error("Invalid venue ID: Must be a valid UUID format");
      }

      // Verify venue exists in our contacts
      const venueExists = contacts.some(contact => contact.venueId === venueId);
      if (!venueExists && contacts.length > 0) {
        console.warn('⚠️ Venue not found in contacts list, but proceeding with message send');
      }

      if (!user) {
        throw new Error("Authentication required to send messages");
      }

      // Activate promoter role
      console.log('🔐 Activating promoter role');
      try {
        await ensurePromoterRole();
      } catch (roleError: any) {
        console.error('❌ Role activation failed:', roleError);
        throw new Error("Failed to activate promoter role. Please try again.");
      }

      console.log('🧵 Creating new thread for venue:', venueId);
      let threadId: string;
      
      try {
        threadId = await createThread(venueId);
        console.log('✅ Thread created successfully:', threadId);
      } catch (threadError: any) {
        console.error('❌ Thread creation failed:', threadError);
        
        // More specific thread creation error handling
        if (threadError.message?.includes('promoter')) {
          throw new Error("Unable to verify promoter permissions for thread creation");
        } else if (threadError.message?.includes('venue')) {
          throw new Error("Selected venue is not available for messaging");
        } else {
          throw new Error("Failed to create conversation thread");
        }
      }
      
      if (!threadId) {
        throw new Error("Failed to create conversation thread - no thread ID returned");
      }

      console.log('💬 Sending message to thread:', threadId);
      try {
        await sendMessage(threadId, content, user.id);
        console.log('✅ Message sent successfully');
      } catch (messageError: any) {
        console.error('❌ Message sending failed:', messageError);
        throw new Error("Failed to send message to thread");
      }
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully!",
        variant: "default"
      });
      
      onClose();
    } catch (error: any) {
      console.error('❌ Error in message sending flow:', error);
      
      let errorMessage = "Failed to send message. Please try again.";
      
      // More specific error messages based on error type
      if (error.message?.includes('Invalid venue ID')) {
        errorMessage = "Invalid venue selected. Please try selecting a different venue.";
      } else if (error.message?.includes('promoter')) {
        errorMessage = "Unable to verify promoter status. Please try again or contact support.";
      } else if (error.message?.includes('thread')) {
        errorMessage = "Failed to create conversation. Please try again.";
      } else if (error.message?.includes('Authentication required')) {
        errorMessage = "Please log in to send messages.";
      } else if (error.message?.includes('role')) {
        errorMessage = "Unable to activate required permissions. Please try again.";
      }
      
      toast({
        title: "Error Sending Message",
        description: errorMessage,
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
