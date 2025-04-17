
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoterInbox from '@/components/promoter/communication/PromoterInbox';
import ContactsList from '@/components/promoter/communication/ContactsList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { useLocation, useSearchParams } from 'react-router-dom';
import { VenueContact } from '@/hooks/promoter/types';

const PromoterCommunicationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'contacts' || tab === 'inbox') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setActiveTab('inbox');
  };

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">Communication Hub</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="inbox">Inbox</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <PromoterInbox onSelectThread={handleSelectThread} />
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread threadId={selectedThreadId} />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center text-gray-500">
                      <p>Select a conversation to view messages</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="contacts">
            <ContactsList onThreadCreated={(threadId) => {
              setSelectedThreadId(threadId);
              setActiveTab('inbox');
            }} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterCommunicationPage;
