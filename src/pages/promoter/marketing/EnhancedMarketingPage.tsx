
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EmailMarketingWorkflow from '@/components/marketing/EmailMarketingWorkflow';
import SMSMarketingPanel from '@/components/marketing/SMSMarketingPanel';
import ABTestingPanel from '@/components/marketing/ABTestingPanel';
import CampaignPerformanceTracker from '@/components/marketing/CampaignPerformanceTracker';
import { Rocket, Mail, MessageSquare, BarChart3, TestTube } from 'lucide-react';

const EnhancedMarketingPage: React.FC = () => {
  const handleWorkflowCreate = (workflow: any) => {
    console.log('Creating email workflow:', workflow);
    // Implementation for creating email workflow
  };

  const handleSMSCampaignCreate = (campaign: any) => {
    console.log('Creating SMS campaign:', campaign);
    // Implementation for creating SMS campaign
  };

  const handleTestCreate = (test: any) => {
    console.log('Creating A/B test:', test);
    // Implementation for creating A/B test
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
          <TabsList className="mb-6">
            <TabsTrigger value="email-automation" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Automation
            </TabsTrigger>
            <TabsTrigger value="sms-marketing" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS Marketing
            </TabsTrigger>
            <TabsTrigger value="ab-testing" className="flex items-center">
              <TestTube className="h-4 w-4 mr-2" />
              A/B Testing
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance Tracking
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
        </Tabs>
      </div>
    </Layout>
  );
};

export default EnhancedMarketingPage;
