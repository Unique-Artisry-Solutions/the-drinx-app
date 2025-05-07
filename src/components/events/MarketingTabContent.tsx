
import React, { useState, useEffect } from 'react';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { 
  BarChart3, 
  Users, 
  Globe, 
  Mail, 
  Bell, 
  Smartphone, 
  Plus, 
  Trash, 
  Copy, 
  Link, 
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { copyToClipboard } from '@/utils/clipboard';

// Type definition for audience segments (to match the mock data)
interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: string;
  // Adding properties from mock data
  segmentId?: string;
  recentActivity?: string;
}

const MarketingTabContent = ({ eventId, eventName }: { eventId?: string, eventName: string }) => {
  const { campaigns, isLoading, createCampaign, updateCampaign, deleteCampaign, getCampaignLink } = useEventMarketing(eventId || '');
  const { toast } = useToast();
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [campaignFormData, setCampaignFormData] = useState<Partial<EventMarketingCampaign>>({
    name: '',
    description: '',
    campaign_type: 'email',
    status: 'draft'
  });
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [showLinkCopied, setShowLinkCopied] = useState<string | null>(null);
  
  // Mock audience segments data
  const audienceSegments: AudienceSegment[] = [
    { 
      id: '1', 
      name: 'Recent Attendees', 
      description: 'People who attended events in the last 30 days', 
      memberCount: 1245, 
      type: 'behavior',
      segmentId: 'recent-attendees',
      recentActivity: 'high'
    },
    { 
      id: '2', 
      name: 'VIP Members', 
      description: 'Members with VIP status', 
      memberCount: 328, 
      type: 'status',
      segmentId: 'vip-members',
      recentActivity: 'medium'
    },
    { 
      id: '3', 
      name: 'New Subscribers', 
      description: 'Users who subscribed in the last 14 days', 
      memberCount: 892, 
      type: 'acquisition',
      segmentId: 'new-subscribers',
      recentActivity: 'high'
    },
    { 
      id: '4', 
      name: 'Location Based', 
      description: 'Users within 10 miles of venue', 
      memberCount: 2150, 
      type: 'location',
      segmentId: 'location-nearby',
      recentActivity: 'low'
    }
  ];

  const handleCampaignChange = (field: string, value: any) => {
    setCampaignFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateCampaign = async () => {
    try {
      if (!eventId) return;
      
      // Create campaign without including event_id in the object
      // as it's already provided by the hook
      const campaignData = {
        name: campaignFormData.name || '',
        description: campaignFormData.description,
        campaign_type: campaignFormData.campaign_type || 'email',
        status: campaignFormData.status as 'draft' | 'active' | 'completed' | 'cancelled'
      };
      
      await createCampaign(campaignData);
      setIsCreatingCampaign(false);
      setCampaignFormData({
        name: '',
        description: '',
        campaign_type: 'email',
        status: 'draft'
      });
      
      toast({
        title: "Campaign Created",
        description: "Your marketing campaign has been created successfully."
      });
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create marketing campaign. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: 'draft' | 'active' | 'completed' | 'cancelled') => {
    try {
      await updateCampaign(id, { status });
      toast({
        title: "Status Updated",
        description: `Campaign status updated to ${status}.`
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update campaign status.",
        variant: "destructive"
      });
    }
  };

  const confirmDeleteCampaign = (id: string) => {
    setCampaignToDelete(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteCampaign = async () => {
    if (!campaignToDelete) return;
    
    try {
      await deleteCampaign(campaignToDelete);
      setCampaignToDelete(null);
      setShowDeleteDialog(false);
      
      toast({
        title: "Campaign Deleted",
        description: "Marketing campaign has been deleted successfully."
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Failed to delete marketing campaign.",
        variant: "destructive"
      });
    }
  };

  const handleCopyLink = (campaignId: string) => {
    const link = getCampaignLink(campaignId);
    copyToClipboard(link).then(() => {
      setShowLinkCopied(campaignId);
      setTimeout(() => setShowLinkCopied(null), 2000);
      
      toast({
        title: "Link Copied",
        description: "Campaign link copied to clipboard"
      });
    });
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Marketing Campaigns</h3>
            <Button onClick={() => setIsCreatingCampaign(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" /> New Campaign
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : campaigns.length > 0 ? (
            <div className="grid gap-4">
              {campaigns.map(campaign => (
                <Card key={campaign.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{campaign.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {campaign.campaign_type === 'email' && <Mail className="h-4 w-4 inline mr-1" />}
                          {campaign.campaign_type === 'notification' && <Bell className="h-4 w-4 inline mr-1" />}
                          {campaign.campaign_type === 'social' && <Globe className="h-4 w-4 inline mr-1" />}
                          {campaign.campaign_type === 'sms' && <Smartphone className="h-4 w-4 inline mr-1" />}
                          {campaign.campaign_type.charAt(0).toUpperCase() + campaign.campaign_type.slice(1)}
                        </CardDescription>
                      </div>
                      <Badge variant={
                        campaign.status === 'active' ? 'default' : 
                        campaign.status === 'completed' ? 'secondary' :
                        campaign.status === 'cancelled' ? 'destructive' : 'outline'
                      }>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {campaign.description || 'No description provided.'}
                    </p>
                    
                    {campaign.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Impressions</p>
                          <p className="font-semibold">{campaign.metrics.impressions || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Clicks</p>
                          <p className="font-semibold">{campaign.metrics.clicks || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Conversions</p>
                          <p className="font-semibold">{campaign.metrics.conversions || 0}</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded">
                          <p className="text-xs text-gray-500">Open Rate</p>
                          <p className="font-semibold">
                            {campaign.metrics.open_rate ? `${campaign.metrics.open_rate}%` : 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleCopyLink(campaign.id || '')}
                      >
                        {showLinkCopied === campaign.id ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Link className="h-4 w-4 mr-2" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      
                      {campaign.status === 'draft' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(campaign.id || '', 'active')}
                        >
                          Activate
                        </Button>
                      )}
                      
                      {campaign.status === 'active' && (
                        <Button 
                          variant="secondary"
                          size="sm" 
                          onClick={() => handleUpdateStatus(campaign.id || '', 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      
                      {(campaign.status === 'draft' || campaign.status === 'active') && (
                        <Button 
                          variant="destructive"
                          size="sm" 
                          onClick={() => confirmDeleteCampaign(campaign.id || '')}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">No Campaigns Yet</h3>
                  <p className="text-sm text-gray-600">Create your first marketing campaign for {eventName}</p>
                  <Button 
                    onClick={() => setIsCreatingCampaign(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="audience" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Audience Segments</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Create Segment
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {audienceSegments.map(segment => (
              <Card key={segment.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{segment.name}</CardTitle>
                  <CardDescription>{segment.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{segment.memberCount.toLocaleString()} members</span>
                    </div>
                    <Badge variant="outline">{segment.type}</Badge>
                  </div>
                  <Button size="sm" className="w-full">Target This Segment</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Visualize the performance of your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
                <div className="text-center p-8">
                  <BarChart3 className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">Analytics Dashboard</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Track the performance of your marketing campaigns across different channels and audience segments.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Campaign Dialog */}
      <Dialog open={isCreatingCampaign} onOpenChange={setIsCreatingCampaign}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Marketing Campaign</DialogTitle>
            <DialogDescription>
              Create a new marketing campaign for your event. Fill out the details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={campaignFormData.name || ''}
                onChange={(e) => handleCampaignChange('name', e.target.value)}
                placeholder="Summer Promotion"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={campaignFormData.description || ''}
                onChange={(e) => handleCampaignChange('description', e.target.value)}
                placeholder="Describe your campaign purpose and goals"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select
                value={campaignFormData.campaign_type || 'email'}
                onValueChange={(value) => handleCampaignChange('campaign_type', value)}
              >
                <SelectTrigger id="campaign-type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="notification">Push Notification</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatingCampaign(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this marketing campaign and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MarketingTabContent;
