
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Archive, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { supabaseClient as supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/auth';
import { Message } from '@/hooks/promoter/types';
import { fromTable } from '@/lib/supabaseClient';
import { PromoterVenueThread, PromoterVenueMessage } from '@/types/SupabaseTables';

interface MessageThreadProps {
  threadId: string;
  userType?: 'promoter' | 'establishment';
}

const MessageThread: React.FC<MessageThreadProps> = ({ threadId, userType = 'promoter' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [threadInfo, setThreadInfo] = useState<{
    venueName?: string;
    promoterName?: string;
    subject?: string;
  }>({});
  const { toast } = useToast();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!threadId) return;
    
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // First fetch thread info
        const { data: threadData, error: threadError } = await fromTable<PromoterVenueThread>('promoter_venue_threads')
          .select(`
            id, subject,
            venues:establishments(id, name),
            promoters:profiles!promoter_venue_threads_promoter_id_fkey(id, display_name, username)
          `)
          .eq('id', threadId)
          .single();

        if (threadError) {
          console.error('Error fetching thread:', threadError);
          toast({
            title: 'Error',
            description: 'Failed to load conversation details',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        setThreadInfo({
          venueName: threadData?.venues?.name,
          promoterName: threadData?.promoters?.display_name || threadData?.promoters?.username,
          subject: threadData?.subject
        });

        // Then fetch messages
        const { data: messageData, error: messageError } = await fromTable<PromoterVenueMessage[]>('promoter_venue_messages')
          .select(`
            id,
            content,
            sent_at,
            sender_id,
            is_from_promoter,
            sender:profiles!promoter_venue_messages_sender_id_fkey(username, display_name)
          `)
          .eq('thread_id', threadId)
          .order('sent_at', { ascending: true });

        if (messageError) {
          console.error('Error fetching messages:', messageError);
          toast({
            title: 'Error',
            description: 'Failed to load messages',
            variant: 'destructive'
          });
          setLoading(false);
          return;
        }

        const formattedMessages: Message[] = messageData.map(message => {
          const senderName = message.sender?.display_name || message.sender?.username || 'Unknown';
          return {
            id: message.id,
            text: message.content,
            timestamp: message.sent_at,
            senderName: senderName,
            isFromPromoter: message.is_from_promoter,
            senderId: message.sender_id
          };
        });

        setMessages(formattedMessages);

        // Set up real-time subscription for new messages
        const channel = supabase
          .channel('thread-messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'promoter_venue_messages',
              filter: `thread_id=eq.${threadId}`
            },
            async (payload) => {
              // When a new message arrives, fetch its details
              const { data: newMessage, error } = await fromTable<PromoterVenueMessage>('promoter_venue_messages')
                .select(`
                  id,
                  content,
                  sent_at,
                  sender_id,
                  is_from_promoter,
                  sender:profiles!promoter_venue_messages_sender_id_fkey(username, display_name)
                `)
                .eq('id', payload.new.id)
                .single();
              
              if (error) {
                console.error('Error fetching new message:', error);
                return;
              }
              
              // Add the new message to state
              const formattedMessage: Message = {
                id: newMessage.id,
                text: newMessage.content,
                timestamp: newMessage.sent_at,
                senderName: newMessage.sender?.display_name || newMessage.sender?.username || 'Unknown',
                isFromPromoter: newMessage.is_from_promoter,
                senderId: newMessage.sender_id
              };
              
              setMessages(current => [...current, formattedMessage]);
              
              // Mark as read if it's from the other party
              if (newMessage.sender_id !== user?.id) {
                await supabase.rpc('mark_thread_as_read', {
                  _thread_id: threadId,
                  _user_id: user?.id
                });
              }
            }
          )
          .subscribe();

        // Mark this thread as read
        if (user) {
          await supabase.rpc('mark_thread_as_read', {
            _thread_id: threadId,
            _user_id: user.id
          });
        }

        return () => {
          supabase.removeChannel(channel);
        };
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

    fetchMessages();
  }, [threadId, user, toast]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !threadId) return;
    
    setSending(true);
    
    try {
      // Determine if the current user is a promoter or establishment
      const isFromPromoter = userType === 'promoter';
      
      // Send the message
      const { error } = await fromTable('promoter_venue_messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: newMessage,
          is_from_promoter: isFromPromoter
        });

      if (error) {
        throw error;
      }
      
      // Clear the input
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  const handleArchiveThread = async () => {
    if (!threadId) return;
    
    try {
      const { error } = await fromTable('promoter_venue_threads')
        .update({ is_archived: true })
        .eq('id', threadId);

      if (error) {
        throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Conversation archived',
      });
      
    } catch (error) {
      console.error('Error archiving thread:', error);
      toast({
        title: 'Error',
        description: 'Failed to archive conversation',
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {userType === 'promoter' 
              ? `Conversation with ${threadInfo.venueName || 'Venue'}`
              : `Conversation with ${threadInfo.promoterName || 'Promoter'}`
            }
            {threadInfo.subject && <span className="block text-sm font-normal text-gray-500 mt-1">Re: {threadInfo.subject}</span>}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={handleArchiveThread}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 mb-4 max-h-[500px]">
        {loading ? (
          <div className="text-center py-6">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No messages in this conversation yet</p>
            <p className="text-sm mt-2">Start the conversation by sending a message below</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isSentByCurrentUser = 
                userType === 'promoter' ? message.isFromPromoter : !message.isFromPromoter;
              
              return (
                <div 
                  key={message.id}
                  className={`flex ${isSentByCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[80%] p-3 rounded-lg 
                    ${isSentByCurrentUser 
                      ? 'bg-purple-100 text-purple-900' 
                      : 'bg-gray-100 text-gray-800'}
                  `}>
                    <div className="text-sm">
                      {message.text}
                    </div>
                    <div className="flex items-center text-xs mt-1 text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <Textarea
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={sending || !newMessage.trim()}
            className="self-end"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default MessageThread;
