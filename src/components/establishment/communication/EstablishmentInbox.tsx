
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient as supabase } from '@/lib/supabaseClient'; // Using the typed client
import { useAuth } from '@/contexts/auth';
import MessageThreadList from '@/components/promoter/communication/MessageThreadList';
import MessageThread from '@/components/promoter/communication/MessageThread';
import { MessageThread as MessageThreadType } from '@/hooks/promoter/types';
import { fromTable } from '@/lib/supabaseClient';
import { PromoterVenueThread, UnreadMessageCount } from '@/types/SupabaseTables';

const EstablishmentInbox = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [threads, setThreads] = useState<MessageThreadType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchThreads = async () => {
      setLoading(true);
      try {
        // Get the establishment ID for the current user
        const { data: establishment, error: establishmentError } = await supabase
          .from('establishments')
          .select('id')
          .eq('owner_id', user.id)
          .single();

        if (establishmentError || !establishment) {
          console.error('Error fetching establishment:', establishmentError);
          toast({
            title: 'Error',
            description: 'Could not find your establishment profile',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        // Fetch threads for this establishment using fromTable helper
        const { data: threadData, error: threadError } = await fromTable<PromoterVenueThread[]>('promoter_venue_threads')
          .select(`
            id,
            created_at,
            updated_at,
            subject,
            last_message_at,
            is_archived,
            promoter_id,
            promoter_venue_messages (
              id,
              content,
              sent_at,
              is_from_promoter,
              sender_id
            ),
            profiles!promoter_venue_threads_promoter_id_fkey (
              display_name,
              username
            )
          `)
          .eq('venue_id', establishment.id)
          .order('last_message_at', { ascending: false });

        if (threadError) {
          console.error('Error fetching threads:', threadError);
          toast({
            title: 'Error',
            description: 'Failed to load messages',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        // Get unread counts
        const { data: unreadData, error: unreadError } = await fromTable<UnreadMessageCount[]>('message_read_status')
          .select('thread_id, last_read_at')
          .eq('user_id', user.id);

        if (unreadError) {
          console.error('Error fetching read status:', unreadError);
        }

        // Create map of thread_id to last_read_at
        const readStatusMap = new Map();
        if (unreadData) {
          unreadData.forEach(item => {
            readStatusMap.set(item.thread_id, item.last_read_at);
          });
        }

        // Format the threads for our component
        const formattedThreads: MessageThreadType[] = threadData.map(thread => {
          // Access profile data safely
          const promoterProfile = thread.profiles || {};
          const promoterName = promoterProfile.display_name || promoterProfile.username || 'Promoter';
          
          // Get the last message
          const messages = thread.promoter_venue_messages || [];
          const lastMessage = messages.length > 0 
            ? messages.sort((a, b) => 
                new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
              )[0].content
            : 'No messages yet';
          
          // Check if thread is read
          const lastReadAt = readStatusMap.get(thread.id);
          const lastMessageAt = thread.last_message_at;
          const isRead = !lastMessageAt || (lastReadAt && new Date(lastReadAt) >= new Date(lastMessageAt));
          
          return {
            id: thread.id,
            venueName: promoterName, // For establishment view, we show promoter name
            eventName: thread.subject,
            lastMessage,
            timestamp: thread.last_message_at,
            isRead: isRead,
            isArchived: thread.is_archived,
            messages: [] // We'll load these when a thread is selected
          };
        });

        setThreads(formattedThreads);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({
          title: 'Error',
          description: 'An unexpected error occurred',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [user, toast]);

  const handleSelectThread = async (threadId: string) => {
    setSelectedThreadId(threadId);

    // Mark thread as read
    if (user) {
      try {
        await supabase.rpc('mark_thread_as_read', {
          _thread_id: threadId,
          _user_id: user.id
        });

        // Update the local state to mark the thread as read
        setThreads(current => 
          current.map(thread => 
            thread.id === threadId 
              ? { ...thread, isRead: true } 
              : thread
          )
        );
      } catch (error) {
        console.error('Error marking thread as read:', error);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
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
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
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
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => !t.isRead && !t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
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
                ) : (
                  <MessageThreadList 
                    conversations={threads.filter(t => t.isArchived)} 
                    onSelectConversation={handleSelectThread} 
                  />
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
