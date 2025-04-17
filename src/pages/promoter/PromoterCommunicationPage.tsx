
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PromoterInbox from '@/components/promoter/communication/PromoterInbox';
import ContactsList from '@/components/promoter/communication/ContactsList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { useLocation } from 'react-router-dom';
import { VenueContact } from '@/hooks/promoter/types';

const PromoterCommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const location = useLocation();
  const [newContact, setNewContact] = useState<VenueContact | null>(null);
  
  // Check for new contact in URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const contactParam = searchParams.get('newContact');
    
    if (contactParam) {
      try {
        const contactData = JSON.parse(decodeURIComponent(contactParam));
        setNewContact(contactData);
        setActiveTab('contacts'); // Switch to contacts tab
      } catch (e) {
        console.error('Error parsing contact data:', e);
      }
    }
  }, [location.search]);
  
  const handleSelectThread = (threadId: string) => {
    setSelectedThreadId(threadId);
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
            <ContactsList newContact={newContact} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PromoterCommunicationPage;
