import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Star, Utensils, Tag, Route } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import MessagingSplitView from '@/components/establishment/communication/MessagingSplitView';
import { useIsMobile } from '@/hooks/use-mobile';

const EstablishmentAllActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const { 
    threads, 
    loading: messagesLoading, 
    error: messagesError 
  } = useMessageSystem('establishment');

  const handleBackToDashboard = () => {
    navigate('/establishment/dashboard');
  };

  const handleTabChange = (tab: string) => {
    // Navigation logic for quick action cards
    switch (tab) {
      case 'menu':
        navigate('/establishment/menu');
        break;
      case 'promotions':
        navigate('/establishment/promotions');
        break;
      case 'barCrawls':
        navigate('/establishment/bar-crawls');
        break;
      default:
        break;
    }
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
              Manage all pending items and communications
            </p>
          </div>
          <Button variant="outline" onClick={handleBackToDashboard}>
            Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <span className="font-medium">Swig Circuits</span>
                </div>
                <Badge variant="secondary">0 pending</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Bar crawl requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="font-medium">Reviews</span>
                </div>
                <Badge variant="secondary">0 new</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Customer feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Layout */}
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}`}>
          {/* Quick Actions Section */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Access establishment management features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => handleTabChange('menu')}>
                    <div className="flex items-center gap-3">
                      <Utensils className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Update Menu</h3>
                        <p className="text-sm text-muted-foreground">Manage your establishment's menu items</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => handleTabChange('promotions')}>
                    <div className="flex items-center gap-3">
                      <Tag className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Manage Promotions</h3>
                        <p className="text-sm text-muted-foreground">Create and edit promotional offers</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4 hover:bg-accent cursor-pointer transition-colors" onClick={() => handleTabChange('barCrawls')}>
                    <div className="flex items-center gap-3">
                      <Route className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-medium">Review Swig Circuit Requests</h3>
                        <p className="text-sm text-muted-foreground">Manage bar crawl participation requests</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Section */}
          <div className="space-y-4">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages
                </CardTitle>
                <CardDescription>
                  Communicate with promoters and event organizers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <MessagingSplitView />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EstablishmentAllActionsPage;