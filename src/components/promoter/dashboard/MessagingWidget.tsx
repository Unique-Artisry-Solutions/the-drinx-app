
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, MessageCircle, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ChatWidget from '@/components/chat/ChatWidget';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const MessagingWidget: React.FC = () => {
  const navigate = useNavigate();
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  console.log('MessagingWidget rendering...');

  // Mock data for now to ensure the widget shows
  const mockData = {
    unreadCount: 3,
    totalConversations: 8,
    recentThreads: [
      {
        id: '1',
        venueName: 'The Blue Moon Bar',
        subject: 'Event Partnership Discussion',
        isRead: false
      },
      {
        id: '2',
        venueName: 'Rooftop Lounge',
        subject: 'Summer Circuit Collaboration',
        isRead: true
      },
      {
        id: '3',
        venueName: 'Downtown Pub',
        subject: 'Promotional Event Planning',
        isRead: false
      }
    ]
  };

  const handleViewAllMessages = () => {
    navigate('/promoter/communication');
  };

  const handleViewThread = (threadId: string) => {
    navigate(`/promoter/communication?thread=${threadId}`);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Venue Communications
          </div>
          {mockData.unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {mockData.unreadCount} unread
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-medium text-blue-900">{mockData.totalConversations}</div>
              <div className="text-xs text-blue-600">Total Conversations</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Users className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-medium text-green-900">{mockData.unreadCount}</div>
              <div className="text-xs text-green-600">Unread Messages</div>
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        <div>
          <h4 className="font-medium mb-2">Recent Conversations</h4>
          <div className="space-y-2">
            {mockData.recentThreads.map((thread) => (
              <div
                key={thread.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleViewThread(thread.id)}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{thread.venueName}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {thread.subject}
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
        </div>

        {/* Action Buttons */}
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
      </CardContent>
    </Card>
  );
};

export default MessagingWidget;
