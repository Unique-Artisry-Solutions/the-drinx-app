
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Calendar, Copy, Edit, Link, Mail, Loader2, Plus, Send, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { EventMarketingCampaign, EventTargetAudience } from '@/types/EventTypes';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';
import { copyToClipboard } from '@/utils/clipboard';
import { useToast } from '@/hooks/use-toast';
import { AudienceSegment } from '@/types/AudienceTypes';
import { CampaignSegmentMapping } from '@/types/CampaignSegmentTypes';
import { CampaignSegmentPanel, SegmentSelection } from '@/components/events/CampaignSegmentPanel';

// Use default export to match import in EventDetailsPage
const MarketingTabContent = ({ eventId, eventName }: { eventId: string; eventName: string }) => {
  const { campaigns, isLoading, createCampaign, updateCampaign, deleteCampaign, getCampaignLink, refresh } = useEventMarketing(eventId);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    campaign_type: 'email',
    status: 'draft'
  });
  const [currentCampaign, setCurrentCampaign] = useState<Partial<EventMarketingCampaign> | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const { toast } = useToast();

  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [campaignSegmentMappings, setCampaignSegmentMappings] = useState<Record<string, CampaignSegmentMapping[]>>({});
  const [isLoadingSegments, setIsLoadingSegments] = useState(false);

  useEffect(() => {
    // Mock data for available segments
    setAvailableSegments([
      { id: '1', name: 'First-time Attendees', description: 'People who have never attended an event', criteria: {} },
      { id: '2', name: 'Regular Attendees', description: 'People who have attended multiple events', criteria: {} },
      { id: '3', name: 'Local Residents', description: 'People who live within 10 miles of the event', criteria: {} },
      { id: '4', name: 'High Spenders', description: 'People who typically purchase premium tickets', criteria: {} }
    ]);

    // Mock data for campaign segment mappings
    setCampaignSegmentMappings({
      'campaign-1': [
        { id: 'map-1', campaign_id: 'campaign-1', segment_id: '1', allocation_percentage: 50, is_control_group: false, is_active: true, created_at: '', updated_at: '', metrics: {} }
      ]
    });
  }, []);

  const handleCreateCampaign = async () => {
    try {
      // Remove event_id from the object passed to createCampaign
      const { name, description, campaign_type, status, start_date, end_date, budget, metrics, target_audience } = newCampaign;
      
      const campaignData = {
        name: name || '',
        description,
        campaign_type: campaign_type || 'email',
        status: status || 'draft',
        start_date,
        end_date,
        budget,
        metrics,
        target_audience
      };

      await createCampaign(campaignData);
      setNewCampaign({
        name: '',
        description: '',
        campaign_type: 'email',
        status: 'draft'
      });
      setIsCreatingCampaign(false);
      refresh();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleUpdateCampaign = async () => {
    if (!currentCampaign || !currentCampaign.id) return;

    try {
      await updateCampaign(currentCampaign.id, currentCampaign);
      setIsEditingCampaign(false);
      setCurrentCampaign(null);
      refresh();
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign(campaignToDelete);
      setCampaignToDelete(null);
      setIsDeleteDialogOpen(false);
      refresh();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleCopyLink = (campaignId: string, medium: string = 'website') => {
    const link = getCampaignLink(campaignId, medium);
    copyToClipboard(link)
      .then(() => {
        setCopiedLink(campaignId);
        toast({ title: 'Link copied to clipboard' });
        setTimeout(() => setCopiedLink(null), 3000);
      })
      .catch(() => {
        toast({ title: 'Failed to copy link', variant: 'destructive' });
      });
  };

  const getCampaignStatusBadge = (status: string) => {
    let variant: "default" | "destructive" | "outline" | "secondary" | "success" = "default";
    
    switch (status) {
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
        variant = "default";
    }
    
    return <Badge variant={variant}>{status}</Badge>;
  };

  const handleAssignSegments = async (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => {
    console.log('Assigning segments:', segments, 'to campaign:', campaign.id);
    // This would call an API to save the segment mappings
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        toast({
          title: "Segments assigned",
          description: `${segments.length} segments assigned to campaign: ${campaign.name}`
        });
        resolve();
      }, 1000);
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">Marketing & Promotion</h3>
        <Button onClick={() => setIsCreatingCampaign(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4 mt-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-10 border rounded-md bg-muted/20">
              <h4 className="text-lg font-medium mb-2">No Marketing Campaigns Yet</h4>
              <p className="text-gray-500 mb-4">Create your first campaign to promote this event.</p>
              <Button onClick={() => setIsCreatingCampaign(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription>
                          {campaign.campaign_type}
                        </CardDescription>
                      </div>
                      {getCampaignStatusBadge(campaign.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {campaign.description && (
                      <p className="text-sm text-gray-500">{campaign.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {campaign.start_date && (
                        <div>
                          <span className="font-medium">Starts:</span> {campaign.start_date}
                        </div>
                      )}
                      {campaign.end_date && (
                        <div>
                          <span className="font-medium">Ends:</span> {campaign.end_date}
                        </div>
                      )}
                      {campaign.budget && (
                        <div className="col-span-2">
                          <span className="font-medium">Budget:</span> ${campaign.budget}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <h5 className="text-sm font-medium">Campaign Link:</h5>
                      <div className="flex items-center gap-2">
                        <Input 
                          value={getCampaignLink(campaign.id || '')}
                          readOnly 
                          className="text-xs"
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="shrink-0"
                          onClick={() => handleCopyLink(campaign.id || '')}
                        >
                          {copiedLink === campaign.id ? (
                            <span className="text-green-500 flex items-center">
                              Copied <span className="ml-1">✓</span>
                            </span>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentCampaign(campaign);
                          setIsEditingCampaign(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setCampaignToDelete(campaign.id || '');
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Impressions</CardTitle>
                <CardDescription>Total number of times your campaigns were seen</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">1,245</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clicks</CardTitle>
                <CardDescription>Number of clicks on your campaign links</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">357</CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversions</CardTitle>
                <CardDescription>Ticket sales from marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent className="text-3xl font-bold">89</CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 mt-4">
          {campaigns.map(campaign => (
            <div key={`segment-${campaign.id}`} className="mb-6">
              <CampaignSegmentPanel
                campaign={campaign}
                availableSegments={availableSegments}
                existingMappings={campaignSegmentMappings[campaign.id || ''] || []}
                isLoading={isLoadingSegments}
                onAssignSegments={handleAssignSegments}
              />
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Marketing Campaign</DialogTitle>
            <DialogDescription>
              Create a new campaign to promote your event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="campaign-name" className="text-sm font-medium">Campaign Name</label>
              <Input
                id="campaign-name"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Enter campaign name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="campaign-type" className="text-sm font-medium">Campaign Type</label>
              <Select
                value={newCampaign.campaign_type}
                onValueChange={(value) => setNewCampaign({ ...newCampaign, campaign_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="web">Website</SelectItem>
                  <SelectItem value="push">Push Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="campaign-desc" className="text-sm font-medium">Description</label>
              <Textarea
                id="campaign-desc"
                value={newCampaign.description || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Enter campaign description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="start-date"
                    type="date"
                    className="pl-9"
                    value={newCampaign.start_date || ''}
                    onChange={(e) => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="end-date"
                    type="date"
                    className="pl-9"
                    value={newCampaign.end_date || ''}
                    onChange={(e) => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="campaign-budget" className="text-sm font-medium">Budget (optional)</label>
              <Input
                id="campaign-budget"
                type="number"
                value={newCampaign.budget || ''}
                onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseFloat(e.target.value) })}
                placeholder="Enter campaign budget"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="campaign-status" className="text-sm font-medium">Status</label>
              <Select
                value={newCampaign.status}
                onValueChange={(value) => {
                  // Ensure we only set valid status values from the EventMarketingCampaign type
                  const typedStatus = value as "draft" | "active" | "completed" | "cancelled";
                  setNewCampaign({ ...newCampaign, status: typedStatus });
                }}
              >
                <SelectTrigger>
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingCampaign(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign}>Create Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditingCampaign} onOpenChange={setIsEditingCampaign}>
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
                <label htmlFor="edit-campaign-name" className="text-sm font-medium">Campaign Name</label>
                <Input
                  id="edit-campaign-name"
                  value={currentCampaign.name || ''}
                  onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-campaign-type" className="text-sm font-medium">Campaign Type</label>
                <Select
                  value={currentCampaign.campaign_type || ''}
                  onValueChange={(value) => setCurrentCampaign({ ...currentCampaign, campaign_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="web">Website</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-campaign-desc" className="text-sm font-medium">Description</label>
                <Textarea
                  id="edit-campaign-desc"
                  value={currentCampaign.description || ''}
                  onChange={(e) => setCurrentCampaign({ ...currentCampaign, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-start-date" className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="edit-start-date"
                      type="date"
                      className="pl-9"
                      value={currentCampaign.start_date || ''}
                      onChange={(e) => setCurrentCampaign({ ...currentCampaign, start_date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-end-date" className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      id="edit-end-date"
                      type="date"
                      className="pl-9"
                      value={currentCampaign.end_date || ''}
                      onChange={(e) => setCurrentCampaign({ ...currentCampaign, end_date: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-campaign-budget" className="text-sm font-medium">Budget</label>
                <Input
                  id="edit-campaign-budget"
                  type="number"
                  value={currentCampaign.budget || ''}
                  onChange={(e) => setCurrentCampaign({ ...currentCampaign, budget: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-campaign-status" className="text-sm font-medium">Status</label>
                <Select
                  value={currentCampaign.status || ''}
                  onValueChange={(value) => {
                    // Ensure we only set valid status values
                    const typedStatus = value as "draft" | "active" | "completed" | "cancelled";
                    setCurrentCampaign({ ...currentCampaign, status: typedStatus });
                  }}
                >
                  <SelectTrigger>
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
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCampaign(false)}>Cancel</Button>
            <Button onClick={handleUpdateCampaign}>Update Campaign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Delete Campaign
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              variant="outline"
              onClick={() => {
                setCampaignToDelete(null);
                setIsDeleteDialogOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCampaign}
            >
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Use default export to match the import in EventDetailsPage
export default MarketingTabContent;
