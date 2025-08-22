import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import PromoterMessagingSplitView from '@/components/promoter/communication/PromoterMessagingSplitView';
import { useIsMobile } from '@/hooks/use-mobile';

const PromoterAllActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const { 
    threads, 
    loading: messagesLoading, 
    error: messagesError 
  } = useMessageSystem('promoter');

  const handleBackToDashboard = () => {
    navigate('/promoter');
  };

  // Safe data handling with null checks and defaults
  const safeThreads = threads || [];
  const pendingMessages = safeThreads.filter(thread => !thread.isRead).length;
  const totalMessages = safeThreads.length;

  return (
    <Layout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Actions</h1>
            <p className="text-muted-foreground mt-2">
              Manage all pending items and venue communications
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Messages</span>
                </div>
                <Badge variant={pendingMessages > 0 ? "destructive" : "secondary"}>
                  {pendingMessages} pending
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {totalMessages} total conversations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Events</span>
                </div>
                <Badge variant="secondary">0 pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Upcoming events
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Followers</span>
                </div>
                <Badge variant="secondary">0 new</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                New followers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Analytics</span>
                </div>
                <Badge variant="secondary">Review</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Performance metrics
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section - Full Width */}
        <div className="space-y-4">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Messages
              </CardTitle>
              <CardDescription>
                Communicate with venues and establishments
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-80px)]">
              <PromoterMessagingSplitView />
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterAllActionsPage;