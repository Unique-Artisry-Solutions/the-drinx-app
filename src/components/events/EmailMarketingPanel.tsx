import React from 'react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Mail, Settings } from 'lucide-react';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { safeJsonToRecord } from '@/utils/typeGuards';

// Email marketing component that displays campaign metrics and allows for creating/editing campaigns
const EmailMarketingPanel = ({ 
  campaign, 
  onConfigureClick 
}: { 
  campaign: EventMarketingCampaign | null;
  onConfigureClick: () => void;
}) => {
  if (!campaign) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Marketing
          </CardTitle>
          <CardDescription>
            Configure email campaigns to promote your event
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-4">
          <p className="text-center text-muted-foreground">
            No email marketing campaigns configured yet.
          </p>
          <Button onClick={onConfigureClick}>
            Set Up Email Campaign
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check if campaign has A/B testing configured
  const targetAudience = safeJsonToRecord(campaign.target_audience || {});
  const abTest = targetAudience.abTest || {};
  const isABTesting = Boolean(abTest.variantA && abTest.variantB);
  const trafficSplit = abTest.distribution || 50;

  // Get metrics
  const metrics = safeJsonToRecord(campaign.metrics || {});
  const emailsSent = metrics.emails_sent || 0;
  const openRate = metrics.open_rate || 0;
  const clicks = metrics.clicks || 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Marketing
        </CardTitle>
        <CardDescription>
          Campaign: {campaign.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ab-testing" disabled={!isABTesting}>A/B Testing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-md">
                <span className="text-2xl font-bold">{emailsSent}</span>
                <span className="text-sm text-muted-foreground">Emails Sent</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-md">
                <span className="text-2xl font-bold">{openRate.toFixed(1)}%</span>
                <span className="text-sm text-muted-foreground">Open Rate</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900 rounded-md">
                <span className="text-2xl font-bold">{clicks}</span>
                <span className="text-sm text-muted-foreground">Clicks</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={onConfigureClick}>
              Edit Campaign
            </Button>
          </TabsContent>
          <TabsContent value="ab-testing" className="space-y-4 pt-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-medium">Traffic Split</h4>
                <div className="text-sm text-muted-foreground">
                  A: {trafficSplit}% / B: {100 - trafficSplit}%
                </div>
              </div>
              <BrainCircuit className="h-6 w-6 text-blue-500" />
            </div>
            {/* ... A/B testing content ... */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border rounded p-3">
                <h5 className="font-medium">Variant A</h5>
                <p className="text-sm truncate">{abTest.variantA || 'Default'}</p>
              </div>
              <div className="border rounded p-3">
                <h5 className="font-medium">Variant B</h5>
                <p className="text-sm truncate">{abTest.variantB || 'Alternative'}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={onConfigureClick}>
              Configure A/B Test
            </Button>
          </TabsContent>
          <TabsContent value="settings" className="pt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Campaign Type</h4>
                <p className="text-sm text-muted-foreground">{campaign.campaign_type}</p>
              </div>
              <div>
                <h4 className="font-medium">Status</h4>
                <p className="text-sm text-muted-foreground">{campaign.status}</p>
              </div>
              <div>
                <h4 className="font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{campaign.description || 'No description'}</p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button variant="default" size="sm" className="flex items-center gap-2" onClick={onConfigureClick}>
                <Settings className="h-4 w-4" />
                Configure Settings
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailMarketingPanel;
