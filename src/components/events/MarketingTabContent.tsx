
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Link as LinkIcon, 
  Copy, 
  BarChart, 
  Users, 
  Check, 
  X, 
  MessageSquare, 
  Bell,
  CalendarDays,
  DollarSign,
  Tag,
  ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/clipboard';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { SegmentSelection, CampaignSegmentPanel } from '@/components/events/CampaignSegmentPanel';
import { AudienceSegment } from '@/types/AudienceTypes';

interface MarketingTabContentProps {
  eventId: string;
  eventName: string;
}

const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const [newCampaign, setNewCampaign] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    campaign_type: 'email',
    status: 'draft' as const,
  });
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCampaign, setCurrentCampaign] = useState<EventMarketingCampaign | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isSegmentDialogOpen, setIsSegmentDialogOpen] = useState(false);
  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    campaigns, 
    isLoading: isCampaignsLoading, 
    createCampaign, 
    updateCampaign, 
    deleteCampaign, 
    getCampaignLink,
    segmentMappings,
    assignSegments,
    getAvailableSegments,
    refresh
  } = useEventMarketingWithSegments(eventId);

  // Fetch available segments when segment dialog opens
  useEffect(() => {
    if (isSegmentDialogOpen && currentCampaign) {
      loadAvailableSegments(currentCampaign.id || '');
    }
  }, [isSegmentDialogOpen, currentCampaign]);

  const loadAvailableSegments = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const segments = await getAvailableSegments(campaignId);
      setAvailableSegments(segments);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load available segments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name) {
      toast({
        title: 'Validation Error',
        description: 'Campaign name is required',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createCampaign({
        ...newCampaign,
        event_id: eventId,
      });
      
      setNewCampaign({
        name: '',
        description: '',
        campaign_type: 'email',
        status: 'draft' as const,
      });
      
      setIsCreateDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create campaign',
        variant: 'destructive'
      });
    }
  };

  const handleEditCampaign = async () => {
    if (!currentCampaign) return;
    
    try {
      await updateCampaign(currentCampaign.id!, currentCampaign);
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Campaign updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update campaign',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteCampaign = async () => {
    if (!currentCampaign) return;
    
    try {
      await deleteCampaign(currentCampaign.id!);
      setIsDeleteDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Campaign deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete campaign',
        variant: 'destructive'
      });
    }
  };

  const handleCopyLink = (campaignId: string) => {
    const link = getCampaignLink(campaignId);
    copyToClipboard(link)
      .then(() => {
        setCopiedLinkId(campaignId);
        toast({
          title: 'Link Copied',
          description: 'Campaign link copied to clipboard',
        });
        
        // Reset the copied status after 3 seconds
        setTimeout(() => setCopiedLinkId(null), 3000);
      })
      .catch(() => {
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy link to clipboard',
          variant: 'destructive'
        });
      });
  };

  const handleAssignSegments = async (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => {
    try {
      const segmentsForApi = segments.map(seg => ({
        segment_id: seg.id,
        allocation_percentage: seg.allocation || 100,
        is_control_group: seg.isControlGroup || false,
        description: seg.description
      }));
      
      await assignSegments(campaign.id!, segmentsForApi);
      setIsSegmentDialogOpen(false);
      refresh(); // Refresh the campaigns list to show updated segments
      
      return true;
    } catch (error) {
      console.error('Failed to assign segments:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign segments to the campaign',
        variant: 'destructive'
      });
      return false;
    }
  };

  const renderCampaignStatus = (status: 'draft' | 'active' | 'completed' | 'cancelled') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleToggleStatus = async (campaign: EventMarketingCampaign) => {
    try {
      const newStatus = campaign.status === 'active' ? 'draft' as const : 'active' as const;
      
      await updateCampaign(campaign.id!, {
        status: newStatus
      });
      
      toast({
        title: 'Status Updated',
        description: `Campaign is now ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update campaign status',
        variant: 'destructive'
      });
    }
  };

  const getSegmentCount = (campaignId: string) => {
    return segmentMappings[campaignId]?.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Marketing Campaigns</h3>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
      
      {isCampaignsLoading ? (
        <div className="py-10 text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent h-8 w-8 align-middle" />
          <p className="mt-2 text-gray-500">Loading campaigns...</p>
        </div>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <h4 className="text-muted-foreground mb-2">No marketing campaigns yet</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first campaign to start promoting your event.
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {campaign.campaign_type} campaign
                    </p>
                  </div>
                  {renderCampaignStatus(campaign.status)}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="text-sm">
                    {campaign.description || 'No description provided'}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <CalendarDays className="h-4 w-4 mr-2 opacity-70" />
                      <span>{campaign.start_date || 'Not scheduled'}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 opacity-70" />
                      <span>Budget: {campaign.budget ? `$${campaign.budget}` : 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 opacity-70" />
                      <span>{campaign.campaign_type}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 opacity-70" />
                      <span>Segments: {getSegmentCount(campaign.id!)}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
                      <div className="text-lg font-medium">
                        {campaign.metrics?.impressions || 0}
                      </div>
                      <div className="text-muted-foreground">Impressions</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
                      <div className="text-lg font-medium">
                        {campaign.metrics?.clicks || 0}
                      </div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-center">
                      <div className="text-lg font-medium">
                        {campaign.metrics?.conversions || 0}
                      </div>
                      <div className="text-muted-foreground">Conversions</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="p-3 bg-gray-50 dark:bg-gray-900 flex flex-wrap items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCurrentCampaign(campaign);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setCurrentCampaign(campaign);
                    setIsSegmentDialogOpen(true);
                  }}
                >
                  <Users className="h-4 w-4 mr-1" /> 
                  Segments
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopyLink(campaign.id!)}
                >
                  {copiedLinkId === campaign.id ? (
                    <Check className="h-4 w-4 mr-1" />
                  ) : (
                    <LinkIcon className="h-4 w-4 mr-1" />
                  )}
                  Link
                </Button>
                <Button
                  variant={campaign.status === 'active' ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleToggleStatus(campaign)}
                >
                  {campaign.status === 'active' ? (
                    <X className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  )}
                  {campaign.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    setCurrentCampaign(campaign);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Create a new marketing campaign for {eventName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input 
                id="name" 
                value={newCampaign.name} 
                onChange={(e) => setNewCampaign(prev => ({ ...prev, name: e.target.value }))} 
                placeholder="Summer Special Promotion" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select 
                value={newCampaign.campaign_type} 
                onValueChange={(value) => setNewCampaign(prev => ({ ...prev, campaign_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="notification">Push Notification</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newCampaign.description || ''} 
                onChange={(e) => setNewCampaign(prev => ({ ...prev, description: e.target.value }))} 
                placeholder="Describe the campaign purpose and target audience..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (Optional)</Label>
              <Input 
                id="budget" 
                type="number" 
                value={newCampaign.budget || ''} 
                onChange={(e) => setNewCampaign(prev => ({ ...prev, budget: parseFloat(e.target.value) || undefined }))} 
                placeholder="500" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date (Optional)</Label>
              <Input 
                id="start-date" 
                type="date" 
                value={newCampaign.start_date || ''} 
                onChange={(e) => setNewCampaign(prev => ({ ...prev, start_date: e.target.value }))} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date (Optional)</Label>
              <Input 
                id="end-date" 
                type="date" 
                value={newCampaign.end_date || ''} 
                onChange={(e) => setNewCampaign(prev => ({ ...prev, end_date: e.target.value }))} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
            <DialogDescription>
              Update the campaign details.
            </DialogDescription>
          </DialogHeader>
          {currentCampaign && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Campaign Name</Label>
                <Input 
                  id="edit-name" 
                  value={currentCampaign.name} 
                  onChange={(e) => setCurrentCampaign(prev => prev ? { ...prev, name: e.target.value } : null)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Campaign Type</Label>
                <Select 
                  value={currentCampaign.campaign_type} 
                  onValueChange={(value) => setCurrentCampaign(prev => prev ? { ...prev, campaign_type: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="notification">Push Notification</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentCampaign.description || ''} 
                  onChange={(e) => setCurrentCampaign(prev => prev ? { ...prev, description: e.target.value } : null)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-budget">Budget</Label>
                <Input 
                  id="edit-budget" 
                  type="number" 
                  value={currentCampaign.budget || ''} 
                  onChange={(e) => setCurrentCampaign(prev => prev ? { ...prev, budget: parseFloat(e.target.value) || undefined } : null)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input 
                  id="edit-start-date" 
                  type="date" 
                  value={currentCampaign.start_date || ''} 
                  onChange={(e) => setCurrentCampaign(prev => prev ? { ...prev, start_date: e.target.value } : null)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-end-date">End Date</Label>
                <Input 
                  id="edit-end-date" 
                  type="date" 
                  value={currentCampaign.end_date || ''} 
                  onChange={(e) => setCurrentCampaign(prev => prev ? { ...prev, end_date: e.target.value } : null)} 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="edit-status"
                  checked={currentCampaign.status === 'active'}
                  onCheckedChange={(checked) => {
                    const newStatus = checked ? 'active' as const : 'draft' as const;
                    setCurrentCampaign(prev => prev ? { ...prev, status: newStatus } : null);
                  }}
                />
                <Label htmlFor="edit-status">Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCampaign}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Campaign Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentCampaign && (
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                <p className="font-medium">{currentCampaign.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{currentCampaign.campaign_type} campaign</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCampaign}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Segment Assignment Dialog */}
      <Dialog open={isSegmentDialogOpen} onOpenChange={setIsSegmentDialogOpen}>
        <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Target Audience Segments</DialogTitle>
            <DialogDescription>
              Assign audience segments to this campaign for targeted marketing.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentCampaign && (
              <CampaignSegmentPanel
                campaign={currentCampaign}
                availableSegments={availableSegments}
                existingMappings={segmentMappings[currentCampaign.id!] || []}
                isLoading={isLoading}
                onAssignSegments={handleAssignSegments}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingTabContent;
