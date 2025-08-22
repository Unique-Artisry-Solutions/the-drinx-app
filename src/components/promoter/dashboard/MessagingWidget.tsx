
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, MessageCircle, Users, Plus, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '@/components/chat/ChatWidget';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/hooks/useAuth';

const MessagingWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const { user } = useAuth();

  // Use real message system data
  const { 
    threads, 
    loading, 
    error 
  } = useMessageSystem('promoter');

  // Calculate real data from threads
  const safeThreads = threads || [];
  const unreadCount = safeThreads.filter(thread => !thread.isRead).length;
  const totalConversations = safeThreads.length;
  const recentThreads = safeThreads.slice(0, 3); // Show only first 3 for the widget

  const handleViewAllMessages = () => {
    navigate('/promoter/messages');
  };

  const handleViewThread = (threadId: string) => {
    navigate(`/promoter/messages/${threadId}`);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Venue Communications
          </div>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading conversations...</span>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            Failed to load conversations: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <MessageCircle className="h-4 w-4 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">{totalConversations}</div>
                  <div className="text-xs text-blue-600">Total Conversations</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <Users className="h-4 w-4 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">{unreadCount}</div>
                  <div className="text-xs text-green-600">Unread Messages</div>
                </div>
              </div>
            </div>

            {/* Recent Conversations */}
            <div>
              <h4 className="font-medium mb-2">Recent Conversations</h4>
              {recentThreads.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-4">
                  No conversations yet
                </div>
              ) : (
                <div className="space-y-2">
                  {recentThreads.map((thread) => (
                    <div
                      key={thread.id}
                      className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewThread(thread.id)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{thread.venueName || 'Unknown Venue'}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {thread.subject || 'No subject'}
                        </div>
                      </div>
                      {!thread.isRead && (
                        <Badge variant="secondary" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Action Buttons */}
        {!loading && (
          <div className="flex gap-2">
            <Popover open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
              <PopoverTrigger asChild>
                <Button className="flex-1" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Message
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 border-none" align="center">
                <ChatWidget 
                  onClose={() => setIsNewMessageOpen(false)}
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={handleViewAllMessages} size="sm">
              View All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessagingWidget;
