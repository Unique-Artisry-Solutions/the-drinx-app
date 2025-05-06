
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Copy, Users, AlertCircle, ChevronRight, LineChart, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { CampaignSegmentPanel, SegmentSelection } from './CampaignSegmentPanel';
import { AudienceSegment } from '@/types/AudienceTypes';
import { CampaignSegmentAnalytics } from '@/types/CampaignSegmentTypes';

interface MarketingTabContentProps {
  eventId: string;
  eventName: string;
}

export const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<EventMarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaignFormData, setCampaignFormData] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    campaign_type: 'social_media',
    status: 'draft'
  });
  
  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [segmentMappings, setSegmentMappings] = useState<Record<string, any>>({});
  const [segmentAnalytics, setSegmentAnalytics] = useState<Record<string, CampaignSegmentAnalytics[]>>({});
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);
  
  // Mock useEventMarketingWithSegments hook - in a real app you'd use the actual hook
  const {
    campaigns: fetchedCampaigns,
    isLoading: isLoadingCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    trackMetric,
    getCampaignLink,
    assignSegments,
    getAvailableSegments,
    segmentMappings: fetchedMappings,
    segmentAnalytics: fetchedAnalytics,
  } = {
    campaigns: [],
    isLoading: false,
    createCampaign: async (campaign: Omit<EventMarketingCampaign, 'event_id'>) => {
      // Mock implementation
      const newCampaign = {
        ...campaign,
        id: `camp-${Date.now()}`,
        event_id: eventId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return newCampaign as EventMarketingCampaign;
    },
    updateCampaign: async (id: string, updates: Partial<EventMarketingCampaign>) => {
      // Mock implementation
      return { id, ...updates } as EventMarketingCampaign;
    },
    deleteCampaign: async (id: string) => {
      // Mock implementation
      return;
    },
    trackMetric: async (campaignId: string, metricName: string, value: number = 1) => {
      // Mock implementation
      return;
    },
    getCampaignLink: (campaignId: string, medium: string = 'website') => {
      // Mock implementation
      return `https://example.com/events/${eventId}?utm_campaign=${campaignId}&utm_medium=${medium}`;
    },
    assignSegments: async (campaignId: string, segments: any[]) => {
      // Mock implementation
      return segments.map(s => ({
        id: `map-${Date.now()}-${s.segment_id}`,
        campaign_id: campaignId,
        segment_id: s.segment_id,
        allocation_percentage: s.allocation_percentage || 100,
        is_control_group: s.is_control_group || false,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    },
    getAvailableSegments: async (campaignId: string) => {
      // Mock implementation
      return [] as AudienceSegment[];
    },
    segmentMappings: {},
    segmentAnalytics: {},
  };
  
  useEffect(() => {
    // In a real app, you'd fetch data from your hook
    // For now, let's just simulate loading and then set some mock data
    const loadData = async () => {
      setIsLoading(true);
      
      // Mock campaigns
      const mockCampaigns: EventMarketingCampaign[] = [
        {
          id: 'camp-1',
          event_id: eventId,
          name: 'Social Media Promotion',
          description: 'Facebook and Instagram campaign to promote the event',
          campaign_type: 'social_media',
          status: 'active',
          start_date: '2025-06-01T00:00:00Z',
          end_date: '2025-06-15T00:00:00Z',
          metrics: {
            impressions: 1250,
            clicks: 320,
            conversions: 45
          },
          created_at: '2025-05-01T00:00:00Z',
          updated_at: '2025-05-01T00:00:00Z'
        },
        {
          id: 'camp-2',
          event_id: eventId,
          name: 'Email Newsletter',
          description: 'Monthly newsletter featuring the event',
          campaign_type: 'email',
          status: 'draft',
          metrics: {
            emails_sent: 500,
            open_rate: 32.4
          },
          created_at: '2025-05-02T00:00:00Z',
          updated_at: '2025-05-02T00:00:00Z'
        }
      ];
      
      setCampaigns(mockCampaigns);
      setIsLoading(false);
      
      // If a campaign is selected, also load its segments
      if (selectedCampaignId) {
        loadCampaignSegments(selectedCampaignId);
      }
    };
    
    loadData();
  }, [eventId, selectedCampaignId]);
  
  const loadCampaignSegments = async (campaignId: string) => {
    setIsLoadingSegments(true);
    
    // In a real app, you'd get this data from your hook
    // For now, let's just set some mock data
    const mockSegments: AudienceSegment[] = [
      {
        id: 'seg-1',
        name: 'Young Professionals',
        description: 'Ages 25-35 with high disposable income',
        created_by: 'user-1',
        is_active: true,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'seg-2',
        name: 'College Students',
        description: 'University students interested in social events',
        created_by: 'user-1',
        is_active: true,
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z'
      }
    ];
    
    const mockMappings = {
      [campaignId]: [
        {
          id: 'map-1',
          campaign_id: campaignId,
          segment_id: 'seg-1',
          allocation_percentage: 70,
          is_control_group: false,
          is_active: true,
          created_at: '2025-05-03T00:00:00Z',
          updated_at: '2025-05-03T00:00:00Z'
        }
      ]
    };
    
    const mockAnalytics = {
      [campaignId]: [
        {
          campaign_id: campaignId,
          segment_id: 'seg-1',
          segment_name: 'Young Professionals',
          campaign_name: 'Social Media Promotion',
          campaign_type: 'social_media',
          status: 'active',
          allocation_percentage: 70,
          is_control_group: false,
          total_impressions: 875,
          total_clicks: 224,
          total_conversions: 32,
          total_conversion_value: 1600,
          click_through_rate: 25.6,
          conversion_rate: 14.3
        }
      ]
    };
    
    setAvailableSegments(mockSegments);
    setSegmentMappings(mockMappings);
    setSegmentAnalytics(mockAnalytics);
    setIsLoadingSegments(false);
  };
  
  const handleCreateCampaign = async () => {
    if (!campaignFormData.name || !campaignFormData.campaign_type || !campaignFormData.status) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsCreating(true);
    try {
      const newCampaign = await createCampaign({
        name: campaignFormData.name,
        description: campaignFormData.description,
        campaign_type: campaignFormData.campaign_type,
        status: campaignFormData.status
      });
      
      setCampaigns(prev => [...prev, newCampaign]);
      setCampaignFormData({
        name: '',
        description: '',
        campaign_type: 'social_media',
        status: 'draft'
      });
      setShowCreateForm(false);
      
      toast({
        title: "Campaign Created",
        description: "Your marketing campaign has been created successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create campaign",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCancelCreate = () => {
    setCampaignFormData({
      name: '',
      description: '',
      campaign_type: 'social_media',
      status: 'draft'
    });
    setShowCreateForm(false);
  };
  
  const handleAssignSegments = async (campaign: EventMarketingCampaign, selectedSegments: SegmentSelection[]) => {
    try {
      if (!campaign.id) return;
      
      const segmentData = selectedSegments.map(segment => ({
        segment_id: segment.id,
        allocation_percentage: segment.allocation,
        is_control_group: segment.isControlGroup,
        description: segment.description
      }));
      
      const mappings = await assignSegments(campaign.id, segmentData);
      
      // Update local state to show the new mappings
      setSegmentMappings(prev => ({
        ...prev,
        [campaign.id!]: [...(prev[campaign.id!] || []), ...mappings]
      }));
      
      toast({
        title: "Segments Assigned",
        description: `${selectedSegments.length} segments have been assigned to the campaign.`,
      });
      
      return mappings;
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to assign segments",
        variant: "destructive"
      });
    }
  };
  
  const handleCopyLink = async (campaignId: string) => {
    const link = getCampaignLink(campaignId);
    const success = await copyToClipboard(link);
    
    if (success) {
      toast({
        title: "Link Copied",
        description: "Campaign link copied to clipboard",
      });
    } else {
      toast({
        title: "Failed to Copy",
        description: "Could not copy link to clipboard",
        variant: "destructive"
      });
    }
  };
  
  const getCampaignStatusBadge = (campaign: EventMarketingCampaign) => {
    if (!campaign) return null;
    
    let variant: "default" | "destructive" | "outline" | "secondary" | "success";
    
    switch (campaign.status) {
      case 'active':
        variant = "success";
        break;
      case 'draft':
        variant = "secondary";
        break;
      case 'completed':
        variant = "outline";
        break;
      case 'cancelled':
        variant = "destructive";
        break;
      default:
        variant = "outline";
    }
    
    return (
      <Badge variant={variant} className="ml-2">
        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
      </Badge>
    );
  };
  
  const formatNumber = (num: number | undefined) => {
    if (num === undefined) return '0';
    return num.toLocaleString();
  };
  
  const formatPercentage = (num: number | undefined) => {
    if (num === undefined) return '0%';
    return `${num.toFixed(1)}%`;
  };
  
  const renderCampaignList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-10">
          <p>Loading campaigns...</p>
        </div>
      );
    }
    
    if (campaigns.length === 0) {
      return (
        <div className="py-8 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
          <h3 className="text-lg font-medium">No Marketing Campaigns</h3>
          <p className="text-sm text-gray-500 mt-1">
            Create your first campaign to promote this event.
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="mt-4"
            disabled={showCreateForm}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {campaigns.map(campaign => (
          <Card key={campaign.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-2">
              <div className="flex justify-between">
                <CardTitle className="flex items-center">
                  {campaign.name}
                  {getCampaignStatusBadge(campaign)}
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleCopyLink(campaign.id!)}
                >
                  <LinkIcon className="h-4 w-4 mr-1" />
                  Copy Link
                </Button>
              </div>
              <CardDescription>
                {campaign.campaign_type === 'social_media' ? 'Social Media' : 
                campaign.campaign_type === 'email' ? 'Email' : 
                campaign.campaign_type.charAt(0).toUpperCase() + campaign.campaign_type.slice(1)}
                {' • '}
                {campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : 'No date'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {campaign.description && (
                <p className="text-sm mb-4">{campaign.description}</p>
              )}
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-muted/40 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Impressions</p>
                  <p className="text-lg font-medium">{formatNumber(campaign.metrics?.impressions)}</p>
                </div>
                <div className="bg-muted/40 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-lg font-medium">{formatNumber(campaign.metrics?.clicks)}</p>
                  {campaign.metrics?.clicks && campaign.metrics?.impressions && (
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((campaign.metrics.clicks / campaign.metrics.impressions) * 100)} CTR
                    </p>
                  )}
                </div>
                <div className="bg-muted/40 p-2 rounded">
                  <p className="text-xs text-muted-foreground">Conversions</p>
                  <p className="text-lg font-medium">{formatNumber(campaign.metrics?.conversions)}</p>
                  {campaign.metrics?.conversions && campaign.metrics?.clicks && (
                    <p className="text-xs text-muted-foreground">
                      {formatPercentage((campaign.metrics.conversions / campaign.metrics.clicks) * 100)} CVR
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">
                    {segmentMappings[campaign.id!]?.length || 0} Segments
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedCampaignId(selectedCampaignId === campaign.id ? null : campaign.id)}
                  className="text-xs"
                >
                  {selectedCampaignId === campaign.id ? 'Hide Details' : 'View Details'}
                  <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${
                    selectedCampaignId === campaign.id ? 'rotate-90' : ''
                  }`} />
                </Button>
              </div>
              
              {selectedCampaignId === campaign.id && (
                <div className="mt-4 pt-4 border-t">
                  <Tabs defaultValue="segments">
                    <TabsList className="w-full">
                      <TabsTrigger value="segments" className="flex-1">Segments</TabsTrigger>
                      <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
                    </TabsList>
                    <TabsContent value="segments" className="mt-4">
                      <CampaignSegmentPanel
                        campaign={campaign}
                        availableSegments={availableSegments}
                        existingMappings={segmentMappings[campaign.id!] || []}
                        isLoading={isLoadingSegments}
                        onAssignSegments={handleAssignSegments}
                      />
                    </TabsContent>
                    <TabsContent value="performance" className="mt-4">
                      <div className="space-y-4">
                        {segmentAnalytics[campaign.id!]?.length ? (
                          <>
                            <h4 className="font-medium">Segment Performance</h4>
                            <div className="space-y-3">
                              {segmentAnalytics[campaign.id!].map(analytics => (
                                <div key={analytics.segment_id} className="border rounded-md p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h5 className="font-medium">{analytics.segment_name}</h5>
                                    {analytics.is_control_group && (
                                      <Badge variant="outline">Control Group</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Allocation: {analytics.allocation_percentage}%
                                  </p>
                                  <div className="grid grid-cols-3 gap-2">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Impressions</p>
                                      <p className="text-sm font-medium">{formatNumber(analytics.total_impressions)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">CTR</p>
                                      <p className="text-sm font-medium">{formatPercentage(analytics.click_through_rate)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">CVR</p>
                                      <p className="text-sm font-medium">{formatPercentage(analytics.conversion_rate)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <Alert>
                            <AlertDescription>
                              No performance data available for segments yet. 
                              Assign segments to this campaign to start tracking their performance.
                            </AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm">
                            <LineChart className="h-4 w-4 mr-1" />
                            Full Analytics
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Marketing Campaigns</h2>
        {!showCreateForm && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </div>
      
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create Marketing Campaign</CardTitle>
            <CardDescription>
              Set up a new campaign to promote this event
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input 
                  id="campaign-name" 
                  value={campaignFormData.name} 
                  onChange={e => setCampaignFormData(prev => ({ ...prev, name: e.target.value }))} 
                  placeholder="Summer Event Promotion" 
                />
              </div>
              
              <div>
                <Label htmlFor="campaign-description">Description (Optional)</Label>
                <Textarea 
                  id="campaign-description" 
                  value={campaignFormData.description} 
                  onChange={e => setCampaignFormData(prev => ({ ...prev, description: e.target.value }))} 
                  placeholder="Brief description of this marketing campaign" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-type">Campaign Type</Label>
                  <Select 
                    value={campaignFormData.campaign_type} 
                    onValueChange={value => setCampaignFormData(prev => ({ ...prev, campaign_type: value }))}
                  >
                    <SelectTrigger id="campaign-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="email">Email Marketing</SelectItem>
                      <SelectItem value="search">Search Engine</SelectItem>
                      <SelectItem value="referral">Referral Program</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="campaign-status">Status</Label>
                  <Select 
                    value={campaignFormData.status} 
                    onValueChange={value => setCampaignFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger id="campaign-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCancelCreate} disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCampaign} disabled={isCreating}>
                  {isCreating && "Creating..."}
                  {!isCreating && (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Campaign
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Separator />
      
      {renderCampaignList()}
    </div>
  );
};

export default MarketingTabContent;
