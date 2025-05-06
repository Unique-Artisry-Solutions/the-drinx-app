
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, Link, Loader2, Plus, Search, Share2, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { CampaignSegmentPanel, SegmentSelection } from './CampaignSegmentPanel';
import { CampaignSegmentMapping } from '@/types/CampaignSegmentTypes';

interface MarketingTabContentProps {
  eventId: string;
  eventName: string;
  defaultActiveTab?: string;
}

export const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ 
  eventId, 
  eventName,
  defaultActiveTab = "campaigns"
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    type: 'email',
    status: 'draft',
    is_active: true
  });
  const [activeCampaign, setActiveCampaign] = useState<EventMarketingCampaign | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSegmentsPanel, setShowSegmentsPanel] = useState(false);

  const { 
    campaigns, 
    isLoading, 
    createCampaign, 
    refresh,
    segmentMappings,
    assignSegments,
    getAvailableSegments
  } = useEventMarketingWithSegments(eventId);

  const { segments: allSegments, isLoadingSegments } = useAudienceSegments();
  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [loadingSegments, setLoadingSegments] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (activeCampaign) {
      loadAvailableSegments(activeCampaign.id);
    }
  }, [activeCampaign]);

  const loadAvailableSegments = async (campaignId: string) => {
    setLoadingSegments(true);
    try {
      const segments = await getAvailableSegments(campaignId);
      setAvailableSegments(segments);
    } catch (err) {
      console.error('Failed to load available segments:', err);
    } finally {
      setLoadingSegments(false);
    }
  };

  const getCampaignLink = (campaign: EventMarketingCampaign) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/events/${eventId}?utm_campaign=${campaign.id}&utm_source=marketing&utm_medium=email`;
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name) {
      toast({
        title: "Campaign name required",
        description: "Please provide a name for your campaign.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCampaign(true);
    try {
      await createCampaign({
        ...newCampaign,
        event_id: eventId
      });
      setShowCreateCampaign(false);
      setNewCampaign({
        name: '',
        description: '',
        type: 'email',
        status: 'draft',
        is_active: true
      });
      toast({
        title: "Campaign created",
        description: "Marketing campaign created successfully."
      });
      // Refresh campaigns list
      refresh();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCampaign(false);
    }
  };

  const handleCampaignClick = (campaign: EventMarketingCampaign) => {
    setActiveCampaign(campaign);
    setShowShareModal(true);
  };

  const handleOpenSegments = (campaign: EventMarketingCampaign) => {
    setActiveCampaign(campaign);
    setShowSegmentsPanel(true);
  };

  const handleCopyLink = (link: string) => {
    copyToClipboard(link);
    toast({
      title: "Link copied",
      description: "Campaign link copied to clipboard."
    });
  };

  const handleAssignSegments = async (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => {
    try {
      const segmentAssignments = segments.map(s => ({
        segment_id: s.id,
        allocation_percentage: s.allocation || 100,
        is_control_group: s.isControlGroup || false,
        description: s.description
      }));

      // Call the assignSegments function from useEventMarketingWithSegments
      await assignSegments(campaign.id, segmentAssignments);
      
      toast({
        title: "Segments assigned",
        description: "Segments have been assigned to the campaign."
      });
      
      setShowSegmentsPanel(false);
    } catch (err) {
      console.error('Error assigning segments:', err);
      toast({
        title: "Error",
        description: "Failed to assign segments. Please try again.",
        variant: "destructive"
      });
    }
  };

  const renderCampaignsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading campaigns...</span>
        </div>
      );
    }

    if (campaigns.length === 0) {
      return (
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 font-medium text-lg">No campaigns found</h3>
          <p className="text-muted-foreground mt-1">Create a marketing campaign to promote your event.</p>
          <Button className="mt-4" onClick={() => setShowCreateCampaign(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map(campaign => {
          // Get segment count for this campaign
          const campaignSegments = segmentMappings[campaign.id] || [];
          
          return (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{campaign.name}</CardTitle>
                  <Badge variant={campaign.is_active ? "default" : "outline"}>
                    {campaign.status}
                  </Badge>
                </div>
                <CardDescription className="truncate">{campaign.description || 'No description'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{campaignSegments.length} segments</span>
                </div>
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleOpenSegments(campaign)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Segments
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleCampaignClick(campaign)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketing & Promotion</h2>
        <Button onClick={() => setShowCreateCampaign(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="segments">Audience Segments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          {renderCampaignsList()}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Analytics</CardTitle>
              <CardDescription>
                Track the performance of your marketing campaigns.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Analytics content would go here */}
              <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="segments">
          <Card>
            <CardHeader>
              <CardTitle>Audience Segments</CardTitle>
              <CardDescription>
                Manage audience segments for targeted marketing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSegments ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                  <span>Loading segments...</span>
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-2">
                  {allSegments.map(segment => (
                    <div key={segment.id} className="py-3 border-b last:border-b-0">
                      <h3 className="font-medium">{segment.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
                    </div>
                  ))}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Marketing Campaign</DialogTitle>
            <DialogDescription>
              Create a new marketing campaign for {eventName}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                placeholder="Enter campaign name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-description">Description (Optional)</Label>
              <Input
                id="campaign-description"
                placeholder="Enter campaign description"
                value={newCampaign.description || ''}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <select
                id="campaign-type"
                className="w-full px-3 py-2 border rounded-md"
                value={newCampaign.type}
                onChange={(e) => setNewCampaign(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="email">Email</option>
                <option value="social">Social Media</option>
                <option value="sms">SMS</option>
                <option value="web">Website</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="is-active" 
                checked={newCampaign.is_active}
                onCheckedChange={(checked) => setNewCampaign(prev => ({ ...prev, is_active: !!checked }))}
              />
              <Label htmlFor="is-active">Make campaign active immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} disabled={isCreatingCampaign}>
              {isCreatingCampaign ? (
                <>Creating... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Campaign Dialog */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Campaign</DialogTitle>
            <DialogDescription>
              Share this marketing campaign link with your audience.
            </DialogDescription>
          </DialogHeader>
          
          {activeCampaign && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campaign Link</Label>
                <div className="flex items-center">
                  <Input
                    readOnly
                    value={getCampaignLink(activeCampaign)}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="ml-[-40px]"
                    onClick={() => handleCopyLink(getCampaignLink(activeCampaign))}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Share on:</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Twitter</Button>
                  <Button variant="outline" size="sm">Facebook</Button>
                  <Button variant="outline" size="sm">LinkedIn</Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowShareModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Segments Panel Dialog */}
      <Dialog open={showSegmentsPanel} onOpenChange={setShowSegmentsPanel}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Campaign Segments</DialogTitle>
            <DialogDescription>
              Assign audience segments to this campaign to target specific groups.
            </DialogDescription>
          </DialogHeader>
          
          {activeCampaign && (
            <div className="py-4">
              <CampaignSegmentPanel 
                campaign={activeCampaign}
                availableSegments={availableSegments}
                existingMappings={segmentMappings[activeCampaign.id] || []}
                isLoading={loadingSegments}
                onAssignSegments={handleAssignSegments}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSegmentsPanel(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
