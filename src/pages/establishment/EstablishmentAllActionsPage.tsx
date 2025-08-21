import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare, Star, Clock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useMessageSystem } from '@/hooks/messages/useMessageSystem';
import { useAuth } from '@/contexts/auth';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import EstablishmentInbox from '@/components/establishment/communication/EstablishmentInbox';

const EstablishmentAllActionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  
  const { 
    threads, 
    loading: messagesLoading, 
    error: messagesError 
  } = useMessageSystem('establishment');

  const handleBackToDashboard = () => {
    navigate('/establishment/dashboard');
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
              Manage all pending items that require your attention
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

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Messages
              {pendingMessages > 0 && (
                <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
                  {pendingMessages}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bar-crawls" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Swig Circuits
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Reviews  
            </TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Promoter Messages
                </CardTitle>
                <CardDescription>
                  Manage communications with promoters and event organizers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ErrorBoundary
                  fallback={
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground">Unable to load messages</h3>
                      <p className="text-sm text-muted-foreground">
                        Please refresh the page to try again
                      </p>
                    </div>
                  }
                >
                  {messagesLoading ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-muted-foreground">Loading messages...</h3>
                    </div>
                  ) : messagesError ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground">Error loading messages</h3>
                      <p className="text-sm text-muted-foreground">
                        {messagesError}
                      </p>
                    </div>
                  ) : (
                    <EstablishmentInbox />
                  )}
                </ErrorBoundary>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bar-crawls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Swig Circuit Requests
                </CardTitle>
                <CardDescription>
                  Review and manage bar crawl event requests
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No pending requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Bar crawl requests will appear here when submitted by promoters
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Customer Reviews
                </CardTitle>
                <CardDescription>
                  View and respond to customer feedback and ratings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">No new reviews</h3>
                  <p className="text-sm text-muted-foreground">
                    Customer reviews and ratings will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentAllActionsPage;