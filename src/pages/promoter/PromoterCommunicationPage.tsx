
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoterInbox from '@/components/promoter/communication/PromoterInbox';
import ContactsList from '@/components/promoter/communication/ContactsList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { usePromoterMessages } from '@/hooks/promoter/usePromoterMessages';

const PromoterCommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
  const { 
    conversations,
    markAsRead,
    archiveConversation,
    sendMessage
  } = usePromoterMessages();
  
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);
  
  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
    markAsRead(id);
  };
  
  const handleBackFromConversation = () => {
    setSelectedConversationId(null);
  };

  const handleSendMessage = (text: string) => {
    if (selectedConversationId) {
      sendMessage(selectedConversationId, text);
    }
  };
  
  const handleArchive = () => {
    if (selectedConversationId) {
      archiveConversation(selectedConversationId);
      setSelectedConversationId(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-purple-600">Communication Center</h1>
        
        {selectedConversation ? (
          <MessageThread 
            venueName={selectedConversation.venueName}
            messages={selectedConversation.messages}
            onBack={handleBackFromConversation}
            onSendMessage={handleSendMessage}
            onArchive={handleArchive}
            eventName={selectedConversation.eventName}
          />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="inbox">Messages</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inbox" className="mt-0">
              <PromoterInbox />
            </TabsContent>
            
            <TabsContent value="contacts" className="mt-0">
              <ContactsList onSelectContact={(id) => console.log('Selected contact:', id)} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default PromoterCommunicationPage;
