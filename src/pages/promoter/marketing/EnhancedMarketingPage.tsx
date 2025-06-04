
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailMarketingWorkflow from '@/components/marketing/EmailMarketingWorkflow';
import SMSMarketingPanel from '@/components/marketing/SMSMarketingPanel';
import ABTestingPanel from '@/components/marketing/ABTestingPanel';
import CampaignPerformanceTracker from '@/components/marketing/CampaignPerformanceTracker';
import InstagramStoriesIntegration from '@/components/marketing/InstagramStoriesIntegration';
import FacebookEventsIntegration from '@/components/marketing/FacebookEventsIntegration';
import SocialMediaScheduler from '@/components/marketing/SocialMediaScheduler';
import InfluencerCollaborationTools from '@/components/marketing/InfluencerCollaborationTools';
import SocialProofWidgets from '@/components/marketing/SocialProofWidgets';
import { Rocket, Mail, MessageSquare, BarChart3, TestTube, Instagram, Calendar, Users, Star } from 'lucide-react';

const EnhancedMarketingPage: React.FC = () => {
  const handleWorkflowCreate = (workflow: any) => {
    console.log('Creating email workflow:', workflow);
  };

  const handleSMSCampaignCreate = (campaign: any) => {
    console.log('Creating SMS campaign:', campaign);
  };

  const handleTestCreate = (test: any) => {
    console.log('Creating A/B test:', test);
  };

  const sampleEventData = {
    id: 'sample-event-id',
    name: 'Summer Mocktail Festival',
    description: 'Join us for an amazing evening of craft mocktails, live music, and great company at the premier summer festival.',
    date: '2024-07-15',
    time: '6:00 PM',
    venue: 'Downtown Event Center'
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-3xl font-bold flex items-center">
            <Rocket className="mr-3 h-8 w-8" />
            Enhanced Marketing Campaigns
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced promotional tools with automation, A/B testing, and performance tracking
          </p>
        </div>
        
        <Tabs defaultValue="email-automation" className="space-y-6">
          <TabsList className="mb-6 grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="email-automation" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms-marketing" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS
            </TabsTrigger>
            <TabsTrigger value="ab-testing" className="flex items-center">
              <TestTube className="h-4 w-4 mr-2" />
              A/B Tests
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="social-media" className="flex items-center">
              <Instagram className="h-4 w-4 mr-2" />
              Social
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="influencers" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Influencers
            </TabsTrigger>
            <TabsTrigger value="social-proof" className="flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Social Proof
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="email-automation" className="space-y-6">
            <EmailMarketingWorkflow 
              campaignId="sample-campaign-id"
              onWorkflowCreate={handleWorkflowCreate}
            />
          </TabsContent>
          
          <TabsContent value="sms-marketing" className="space-y-6">
            <SMSMarketingPanel 
              campaignId="sample-campaign-id"
              onSMSCampaignCreate={handleSMSCampaignCreate}
            />
          </TabsContent>
          
          <TabsContent value="ab-testing" className="space-y-6">
            <ABTestingPanel 
              campaignId="sample-campaign-id"
              onTestCreate={handleTestCreate}
            />
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-6">
            <CampaignPerformanceTracker campaignId="sample-campaign-id" />
          </TabsContent>

          <TabsContent value="social-media" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InstagramStoriesIntegration 
                eventId={sampleEventData.id}
                eventName={sampleEventData.name}
              />
              <FacebookEventsIntegration 
                eventId={sampleEventData.id}
                eventData={sampleEventData}
              />
            </div>
          </TabsContent>

          <TabsContent value="scheduler" className="space-y-6">
            <SocialMediaScheduler eventId={sampleEventData.id} />
          </TabsContent>

          <TabsContent value="influencers" className="space-y-6">
            <InfluencerCollaborationTools 
              eventId={sampleEventData.id}
              eventName={sampleEventData.name}
            />
          </TabsContent>

          <TabsContent value="social-proof" className="space-y-6">
            <SocialProofWidgets 
              eventId={sampleEventData.id}
              eventName={sampleEventData.name}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EnhancedMarketingPage;
