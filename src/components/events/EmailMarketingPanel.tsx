
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Mail, Users, BarChart } from 'lucide-react';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  getCampaignABTestResults, 
  getSegmentTargetedContent, 
  trackCampaignMetric 
} from '@/services/eventMarketingService';

interface EmailMarketingPanelProps {
  eventId: string;
  eventName: string;
  campaigns: EventMarketingCampaign[];
}

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({ eventId, eventName, campaigns }) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [selectedSegmentId, setSelectedSegmentId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('compose');
  const [previewVariant, setPreviewVariant] = useState<'A' | 'B'>('A');
  
  const { segments } = useAudienceSegments();
  const emailCampaigns = campaigns.filter(campaign => 
    campaign.campaign_type === 'email' && campaign.status === 'active'
  );

  // Get the selected campaign object
  const campaign = emailCampaigns.find(c => c.id === selectedCampaign);
  
  // Get segment data
  const availableSegments = segments.filter(s => s.is_active);
  const selectedSegment = availableSegments.find(s => s.id === selectedSegmentId);
  
  // Get A/B test data if available
  const hasABTest = campaign?.target_audience?.abTest?.variantA && campaign?.target_audience?.abTest?.variantB;
  const abTestData = campaign ? getCampaignABTestResults(campaign) : null;
  
  useEffect(() => {
    // When campaign changes, update content based on segment and A/B testing
    if (campaign) {
      setSubject(campaign.name || '');
      
      if (hasABTest) {
        const abTest = campaign.target_audience?.abTest;
        if (previewVariant === 'A' && abTest?.variantA) {
          setContent(abTest.variantA);
        } else if (previewVariant === 'B' && abTest?.variantB) {
          setContent(abTest.variantB);
        } else {
          setContent(campaign.description || '');
        }
      } else {
        setContent(campaign.description || '');
      }
      
      // Set segment from campaign if available
      if (campaign.target_audience?.segmentId) {
        setSelectedSegmentId(campaign.target_audience.segmentId);
      }
    }
  }, [campaign, previewVariant]);

  const handleSendTest = () => {
    if (!subject || !content) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Test Email Sent",
      description: "A test email has been sent to your address"
    });
  };
  
  const handleSendCampaign = () => {
    if (!subject || !content || !selectedCampaign) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all required fields and select a campaign",
        variant: "destructive"
      });
      return;
    }
    
    // Track campaign metrics
    if (selectedCampaign) {
      trackCampaignMetric(
        selectedCampaign, 
        'emails_sent', 
        selectedSegment ? selectedSegment.memberCount || 0 : 100,
        selectedSegmentId || undefined,
        hasABTest ? previewVariant : undefined
      );
    }
    
    toast({
      title: "Email Campaign Scheduled",
      description: selectedSegment 
        ? `Your email campaign targeting ${selectedSegment.name} has been scheduled for delivery` 
        : "Your email campaign has been scheduled for delivery"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Marketing</CardTitle>
        <CardDescription>
          Create and send emails to promote {eventName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="compose">
              <Mail className="h-4 w-4 mr-2" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="targeting">
              <Users className="h-4 w-4 mr-2" />
              Targeting
            </TabsTrigger>
            {hasABTest && (
              <TabsTrigger value="results">
                <BarChart className="h-4 w-4 mr-2" />
                A/B Results
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="compose" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="campaign">Campaign</Label>
                <Select value={selectedCampaign || undefined} onValueChange={setSelectedCampaign}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailCampaigns.length > 0 ? (
                      emailCampaigns.map(campaign => (
                        <SelectItem 
                          key={campaign.id} 
                          value={campaign.id || `campaign-${Math.random().toString(36).substring(2)}`}
                        >
                          {campaign.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-campaigns-available" disabled>No email campaigns available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject Line</Label>
                <Input 
                  id="subject"
                  placeholder="Enter email subject line"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
            </div>

            {hasABTest && (
              <div className="flex items-center space-x-2 my-4">
                <Label>Preview Variant:</Label>
                <div className="flex ml-2 space-x-2">
                  <Button 
                    size="sm" 
                    variant={previewVariant === 'A' ? 'default' : 'outline'} 
                    onClick={() => setPreviewVariant('A')}
                  >
                    Variant A
                  </Button>
                  <Button 
                    size="sm" 
                    variant={previewVariant === 'B' ? 'default' : 'outline'} 
                    onClick={() => setPreviewVariant('B')}
                  >
                    Variant B
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="content">Email Content</Label>
              <Textarea 
                id="content"
                placeholder="Write your email content here..."
                className="min-h-[200px]"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end">
              <Button onClick={handleSendTest} variant="outline">
                Send Test Email
              </Button>
              <Button onClick={handleSendCampaign} disabled={!selectedCampaign}>
                <Mail className="mr-2 h-4 w-4" />
                Send Campaign
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="targeting" className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Target Audience Segment</Label>
                {selectedSegment && (
                  <Badge variant="outline">{selectedSegment.memberCount || 0} members</Badge>
                )}
              </div>
              <Select 
                value={selectedSegmentId || ''}
                onValueChange={setSelectedSegmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All users (no targeting)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All users (no targeting)</SelectItem>
                  {availableSegments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedSegment && (
              <div className="bg-muted p-4 rounded-md">
                <h4 className="text-sm font-medium mb-2">Segment Details</h4>
                <p className="text-sm mb-2">{selectedSegment.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>Member count:</span>
                  <Badge variant="secondary">{selectedSegment.memberCount || 0}</Badge>
                </div>
              </div>
            )}
            
            {hasABTest && (
              <div className="bg-muted p-4 rounded-md mt-4">
                <h4 className="text-sm font-medium mb-2">A/B Testing Configuration</h4>
                <p className="text-sm mb-2">
                  This campaign has A/B testing enabled. Two variants will be sent according 
                  to the configured distribution.
                </p>
                <div className="mt-2 space-y-1">
                  <div className="text-xs">Distribution</div>
                  <div className="relative pt-1">
                    <Progress value={campaign?.target_audience?.abTest?.distribution || 50} max={100} />
                    <div className="flex justify-between text-xs pt-1">
                      <span>Variant A: {campaign?.target_audience?.abTest?.distribution || 50}%</span>
                      <span>Variant B: {100 - (campaign?.target_audience?.abTest?.distribution || 50)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          {hasABTest && (
            <TabsContent value="results" className="space-y-4">
              {abTestData && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Variant A Performance</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Impressions:</span>
                          <span className="font-medium">{abTestData.variantA.impressions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversions:</span>
                          <span className="font-medium">{abTestData.variantA.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Rate:</span>
                          <span className="font-medium">{abTestData.variantA.conversionRate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted p-4 rounded-md">
                      <h4 className="font-medium">Variant B Performance</h4>
                      <div className="mt-2 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Impressions:</span>
                          <span className="font-medium">{abTestData.variantB.impressions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversions:</span>
                          <span className="font-medium">{abTestData.variantB.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Conversion Rate:</span>
                          <span className="font-medium">{abTestData.variantB.conversionRate.toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {abTestData.winner && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-300">Winner: Variant {abTestData.winner}</h4>
                      <p className="text-sm mt-1">
                        Variant {abTestData.winner} outperformed by {abTestData.improvement.toFixed(2)}%
                        {abTestData.significantResult 
                          ? ' with statistical significance.' 
                          : '. More data needed for statistical significance.'}
                      </p>
                    </div>
                  )}
                  
                  {!abTestData.winner && (abTestData.variantA.impressions > 0 || abTestData.variantB.impressions > 0) && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Test in Progress</h4>
                      <p className="text-sm mt-1">
                        Insufficient data to determine a winner. Continue the test to gather more data.
                      </p>
                    </div>
                  )}
                  
                  {abTestData.variantA.impressions === 0 && abTestData.variantB.impressions === 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-200 dark:border-blue-800">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300">Test Not Started</h4>
                      <p className="text-sm mt-1">
                        This A/B test hasn't received any impressions yet. Send your campaign to start collecting data.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EmailMarketingPanel;
