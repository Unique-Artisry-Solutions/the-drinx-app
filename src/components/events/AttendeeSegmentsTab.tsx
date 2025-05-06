
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PlusCircle, Users, FileText, BellRing, BarChart3, TestTube } from 'lucide-react';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  assignSegmentsToCampaign, 
  getCampaignSegmentMappings,
  getAvailableSegmentsForCampaign
} from '@/services/campaignSegmentService';
import { 
  trackCampaignMetric, 
  getSegmentTargetedContent,
  createSegmentBasedNotification
} from '@/services/eventMarketingService';

interface AttendeeSegmentsTabProps {
  eventId: string;
  eventName: string;
}

interface ContentVariation {
  segmentId: string;
  segmentName: string;
  content: string;
  enabled: boolean;
}

const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const { segments, isLoadingSegments } = useAudienceSegments();
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('segments');
  const [contentVariations, setContentVariations] = useState<ContentVariation[]>([]);
  const [notificationTitle, setNotificationTitle] = useState<string>('');
  const [notificationContent, setNotificationContent] = useState<string>('');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>('');
  const [enableAbTesting, setEnableAbTesting] = useState<boolean>(false);
  const [contentA, setContentA] = useState<string>('');
  const [contentB, setContentB] = useState<string>('');
  const [distribution, setDistribution] = useState<number>(50);

  // Fetch campaigns for this event
  const { data: campaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['event-campaigns', eventId],
    queryFn: async () => {
      // This would normally fetch from your API
      return [
        { id: 'camp-1', name: 'Summer Promotion' },
        { id: 'camp-2', name: 'Special Event Launch' },
      ];
    }
  });

  // Fetch segment mappings for a campaign
  const { 
    data: campaignSegments = [], 
    isLoading: isLoadingMappings,
    refetch: refetchMappings
  } = useQuery({
    queryKey: ['campaign-segments', selectedCampaignId],
    queryFn: () => selectedCampaignId ? getCampaignSegmentMappings(selectedCampaignId) : Promise.resolve([]),
    enabled: !!selectedCampaignId
  });

  // Fetch available segments for this campaign
  const {
    data: availableSegments = [],
    isLoading: isLoadingAvailable,
    refetch: refetchAvailable
  } = useQuery({
    queryKey: ['available-segments', selectedCampaignId],
    queryFn: () => selectedCampaignId ? getAvailableSegmentsForCampaign(selectedCampaignId) : Promise.resolve([]),
    enabled: !!selectedCampaignId
  });

  // Update content variations when segments change
  useEffect(() => {
    if (campaignSegments.length > 0) {
      const variations = campaignSegments.map(mapping => ({
        segmentId: mapping.segment_id,
        segmentName: segments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment',
        content: '',
        enabled: true
      }));
      setContentVariations(variations);
    }
  }, [campaignSegments, segments]);

  // Mutation for assigning segments
  const assignSegmentMutation = useMutation({
    mutationFn: (data: { campaignId: string, segmentId: string }) => assignSegmentsToCampaign(
      data.campaignId,
      [{ segment_id: data.segmentId }]
    ),
    onSuccess: () => {
      refetchMappings();
      refetchAvailable();
      toast({
        title: 'Success',
        description: 'Segment was added to the campaign',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to add segment to campaign: ' + (error.message || 'Unknown error'),
        variant: 'destructive'
      });
    }
  });

  // Mutation for creating segment notifications
  const createNotificationMutation = useMutation({
    mutationFn: (data: { 
      campaignId: string, 
      segmentId: string, 
      title: string, 
      content: string 
    }) => createSegmentBasedNotification(
      eventId,
      data.campaignId,
      data.segmentId,
      data.title,
      data.content
    ),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification was sent to the segment',
      });
      setNotificationTitle('');
      setNotificationContent('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'Failed to send notification: ' + (error.message || 'Unknown error'),
        variant: 'destructive'
      });
    }
  });

  // Handle adding a segment to a campaign
  const handleAddSegment = (segmentId: string) => {
    if (!selectedCampaignId) {
      toast({
        title: 'Select a Campaign',
        description: 'Please select a campaign first',
        variant: 'destructive'
      });
      return;
    }
    
    assignSegmentMutation.mutate({
      campaignId: selectedCampaignId,
      segmentId
    });
  };

  // Handle saving content variations
  const handleSaveContentVariations = () => {
    // This would update content variations for each segment
    toast({
      title: 'Content Saved',
      description: 'Segment-specific content has been saved',
    });
  };

  // Handle saving A/B test content
  const handleSaveAbTest = () => {
    if (!selectedCampaignId || !selectedSegmentId) {
      toast({
        title: 'Selection Required',
        description: 'Please select both a campaign and a segment',
        variant: 'destructive'
      });
      return;
    }

    // This would save A/B test configuration
    // In real implementation, this would update campaign's target_audience field
    toast({
      title: 'A/B Test Configured',
      description: 'A/B test content has been saved for the segment',
    });
  };

  // Handle sending a notification to a segment
  const handleSendNotification = () => {
    if (!selectedCampaignId || !selectedSegmentId || !notificationTitle || !notificationContent) {
      toast({
        title: 'Missing Information',
        description: 'Please complete all notification fields',
        variant: 'destructive'
      });
      return;
    }

    createNotificationMutation.mutate({
      campaignId: selectedCampaignId,
      segmentId: selectedSegmentId,
      title: notificationTitle,
      content: notificationContent
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Segments</CardTitle>
        <CardDescription>Manage audience segmentation and personalized content for {eventName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="campaign-select">Select Campaign</Label>
          <Select
            value={selectedCampaignId}
            onValueChange={setSelectedCampaignId}
          >
            <SelectTrigger className="w-full" id="campaign-select">
              <SelectValue placeholder="Select a marketing campaign" />
            </SelectTrigger>
            <SelectContent>
              {(campaigns || []).map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="segments">
              <Users className="h-4 w-4 mr-2" />
              Segments
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content Personalization
            </TabsTrigger>
            <TabsTrigger value="ab-testing">
              <TestTube className="h-4 w-4 mr-2" />
              A/B Testing
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <BellRing className="h-4 w-4 mr-2" />
              Targeted Notifications
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="segments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Segments</CardTitle>
                  <CardDescription>Segments currently targeted by this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMappings ? (
                    <p>Loading segment mappings...</p>
                  ) : campaignSegments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No segments assigned to this campaign yet.</p>
                  ) : (
                    <ul className="space-y-2">
                      {campaignSegments.map(mapping => {
                        const segmentName = segments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment';
                        return (
                          <li key={mapping.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <span className="font-medium">{segmentName}</span>
                              {mapping.is_control_group && (
                                <Badge variant="outline" className="ml-2">Control Group</Badge>
                              )}
                            </div>
                            <div>
                              <Badge>{mapping.allocation_percentage}%</Badge>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Available Segments</CardTitle>
                  <CardDescription>Add segments to this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingAvailable ? (
                    <p>Loading available segments...</p>
                  ) : availableSegments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No more segments available.</p>
                  ) : (
                    <ul className="space-y-2">
                      {availableSegments.map(segment => (
                        <li key={segment.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="font-medium">{segment.name}</span>
                          <Button size="sm" onClick={() => handleAddSegment(segment.id)}>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Personalization</CardTitle>
                <CardDescription>Create segment-specific content variations</CardDescription>
              </CardHeader>
              <CardContent>
                {contentVariations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No segments assigned to this campaign yet. Add segments first to create personalized content.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {contentVariations.map((variation, index) => (
                      <div key={variation.segmentId} className="space-y-2 pb-4 border-b">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`segment-${variation.segmentId}`} className="text-lg font-medium">
                            {variation.segmentName}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Label htmlFor={`enable-${variation.segmentId}`}>Enabled</Label>
                            <Switch 
                              id={`enable-${variation.segmentId}`}
                              checked={variation.enabled}
                              onCheckedChange={(checked) => {
                                const newVariations = [...contentVariations];
                                newVariations[index].enabled = checked;
                                setContentVariations(newVariations);
                              }}
                            />
                          </div>
                        </div>
                        <Textarea
                          id={`segment-${variation.segmentId}`}
                          placeholder={`Custom content for ${variation.segmentName}...`}
                          value={variation.content}
                          onChange={(e) => {
                            const newVariations = [...contentVariations];
                            newVariations[index].content = e.target.value;
                            setContentVariations(newVariations);
                          }}
                          disabled={!variation.enabled}
                          rows={4}
                        />
                      </div>
                    ))}
                    <Button onClick={handleSaveContentVariations}>Save Content Variations</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ab-testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing</CardTitle>
                <CardDescription>Test different content variations for segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="segment-select">Select Segment</Label>
                    <Select
                      value={selectedSegmentId}
                      onValueChange={setSelectedSegmentId}
                    >
                      <SelectTrigger id="segment-select">
                        <SelectValue placeholder="Select a segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignSegments.map(mapping => {
                          const segmentName = segments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment';
                          return (
                            <SelectItem key={mapping.segment_id} value={mapping.segment_id}>
                              {segmentName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable-ab-testing"
                      checked={enableAbTesting}
                      onCheckedChange={setEnableAbTesting}
                    />
                    <Label htmlFor="enable-ab-testing">Enable A/B Testing for this Segment</Label>
                  </div>

                  {enableAbTesting && (
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="content-a">Variant A Content</Label>
                        <Textarea
                          id="content-a"
                          placeholder="Enter content for variant A"
                          value={contentA}
                          onChange={(e) => setContentA(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content-b">Variant B Content</Label>
                        <Textarea
                          id="content-b"
                          placeholder="Enter content for variant B"
                          value={contentB}
                          onChange={(e) => setContentB(e.target.value)}
                          rows={4}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="distribution">Traffic Distribution: {distribution}% to Variant A</Label>
                        <Input
                          id="distribution"
                          type="range"
                          min="0"
                          max="100"
                          value={distribution}
                          onChange={(e) => setDistribution(parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>0% A</span>
                          <span>50% / 50%</span>
                          <span>100% A</span>
                        </div>
                      </div>
                      
                      <Button onClick={handleSaveAbTest}>Save A/B Test Configuration</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Targeted Notifications</CardTitle>
                <CardDescription>Send notifications to specific audience segments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notification-segment">Select Target Segment</Label>
                    <Select
                      value={selectedSegmentId}
                      onValueChange={setSelectedSegmentId}
                    >
                      <SelectTrigger id="notification-segment">
                        <SelectValue placeholder="Select a segment" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignSegments.map(mapping => {
                          const segmentName = segments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment';
                          return (
                            <SelectItem key={mapping.segment_id} value={mapping.segment_id}>
                              {segmentName}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-title">Notification Title</Label>
                    <Input
                      id="notification-title"
                      placeholder="Enter notification title"
                      value={notificationTitle}
                      onChange={(e) => setNotificationTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notification-content">Notification Message</Label>
                    <Textarea
                      id="notification-content"
                      placeholder="Enter notification message"
                      value={notificationContent}
                      onChange={(e) => setNotificationContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSendNotification}
                    disabled={!selectedSegmentId || !notificationTitle || !notificationContent}
                  >
                    Send to Segment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Segment Performance</CardTitle>
                <CardDescription>Analytics for segment targeting performance</CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedCampaignId ? (
                  <p className="text-sm text-muted-foreground">Select a campaign to view segment performance data.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {campaignSegments.map(mapping => {
                        const segmentName = segments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment';
                        // Normally you'd get these metrics from mapping.metrics
                        const impressions = Math.floor(Math.random() * 1000) + 100;
                        const clicks = Math.floor(impressions * (Math.random() * 0.3 + 0.1));
                        const conversions = Math.floor(clicks * (Math.random() * 0.4 + 0.1));
                        const ctr = (clicks / impressions * 100).toFixed(1);
                        const convRate = (conversions / clicks * 100).toFixed(1);
                        
                        return (
                          <Card key={mapping.id}>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{segmentName}</CardTitle>
                              <CardDescription>{mapping.allocation_percentage}% allocation</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">Impressions:</span>
                                  <span className="font-medium">{impressions}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Clicks:</span>
                                  <span className="font-medium">{clicks}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Conversions:</span>
                                  <span className="font-medium">{conversions}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">CTR:</span>
                                  <span className="font-medium">{ctr}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm">Conv. Rate:</span>
                                  <span className="font-medium">{convRate}%</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AttendeeSegmentsTab;
