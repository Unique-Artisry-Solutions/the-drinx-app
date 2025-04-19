
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MessageThreadList from '@/components/promoter/communication/MessageThreadList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const EstablishmentInbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);
  
  const {
    threads,
    loading,
    selectedThreadId,
    setSelectedThreadId,
    markThreadAsRead
  } = useMessageSystem('establishment');

  useEffect(() => {
    // Clear error when tab changes
    setError(null);
  }, [activeTab]);

  const handleSelectThread = (threadId: string) => {
    try {
      console.log(`Selecting thread: ${threadId}`);
      markThreadAsRead(threadId);
      setSelectedThreadId(threadId);
    } catch (err) {
      console.error("Error selecting thread:", err);
      setError("Failed to mark thread as read. Please try again.");
    }
  };

  // Logging for debugging
  useEffect(() => {
    console.log("Establishment Inbox rendered with threads:", threads);
    console.log("Loading state:", loading);
  }, [threads, loading]);

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Messages</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : threads.filter(t => !t.isArchived).length > 0 ? (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No messages found</p>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : threads.filter(t => !t.isRead && !t.isArchived).length > 0 ? (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isRead && !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No unread messages</p>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="archived">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                {loading ? (
                  <div className="text-center py-6">Loading messages...</div>
                ) : threads.filter(t => t.isArchived).length > 0 ? (
                  <MessageThreadList 
                    conversations={threads.filter(t => t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>No archived messages</p>
                  </div>
                )}
              </div>
              
              <div className="lg:col-span-2">
                {selectedThreadId ? (
                  <MessageThread 
                    threadId={selectedThreadId} 
                    userType="establishment"
                  />
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Select a conversation to view messages</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EstablishmentInbox;
