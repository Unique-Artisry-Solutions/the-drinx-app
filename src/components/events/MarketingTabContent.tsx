
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Mail, Share2, Link, Unlink } from 'lucide-react';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { EventMarketingCampaign } from '@/types/EventTypes';
import MarketingCampaignModal from './MarketingCampaignModal';
import SocialSharingPanel from './SocialSharingPanel';
import EmailMarketingPanel from './EmailMarketingPanel';
import IntegrationsPanel from './IntegrationsPanel';
import { CampaignSegmentPanel } from './CampaignSegmentPanel';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';

interface MarketingTabContentProps {
  eventId: string;
  eventName: string;
}

const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('campaigns');
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EventMarketingCampaign | undefined>();
  
  const { 
    campaigns, 
    isLoading, 
    error, 
    createCampaign,
    createCampaignWithSegments,
    updateCampaign, 
    deleteCampaign,
    trackMetric,
    getCampaignLink,
    refresh,
    // New segment-related properties
    segmentMappings,
    segmentAnalytics,
    // New segment-related methods
    assignSegments,
    updateSegmentMapping,
    removeSegment,
    trackSegmentInteraction,
    getAvailableSegments,
    refreshCampaignAnalytics
  } = useEventMarketingWithSegments(eventId);

  // Get audience segments from our hook
  const { segments, isLoadingSegments } = useAudienceSegments();

  // Handle campaign creation with optional segments
  const handleCreateCampaign = async (
    campaign: Omit<EventMarketingCampaign, 'event_id'>,
    selectedSegments?: { segment_id: string; allocation_percentage?: number }[]
  ) => {
    try {
      if (selectedSegments && selectedSegments.length > 0) {
        // Create campaign with segments
        await createCampaignWithSegments(campaign, selectedSegments);
      } else {
        // Create campaign without segments
        await createCampaign(campaign);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error creating campaign:', err);
    }
  };

  // Handle campaign update
  const handleUpdateCampaign = async (campaign: Partial<EventMarketingCampaign>) => {
    if (!editingCampaign?.id) return;
    
    try {
      await updateCampaign(editingCampaign.id, campaign);
      setIsModalOpen(false);
      setEditingCampaign(undefined);
    } catch (err) {
      console.error('Error updating campaign:', err);
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      try {
        await deleteCampaign(id);
        toast({
          title: "Campaign Deleted",
          description: "The marketing campaign has been deleted successfully.",
        });
        
        // If the deleted campaign was being viewed, reset the active campaign
        if (activeCampaignId === id) {
          setActiveCampaignId(null);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete campaign",
          variant: "destructive",
        });
      }
    }
  };

  // Handle campaign segment assignment
  const handleAssignSegments = async (campaignId: string, segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean }[]) => {
    try {
      await assignSegments(campaignId, segments);
      toast({
        title: "Segments Assigned",
        description: "The audience segments have been assigned to the campaign.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to assign segments to campaign",
        variant: "destructive",
      });
    }
  };

  // Handle segment removal from campaign
  const handleRemoveSegment = async (campaignId: string, mappingId: string) => {
    try {
      await removeSegment(mappingId, campaignId);
      toast({
        title: "Segment Removed",
        description: "The audience segment has been removed from the campaign.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to remove segment from campaign",
        variant: "destructive",
      });
    }
  };

  // Handle campaign modal open
  const openCampaignModal = (campaign?: EventMarketingCampaign) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  };

  // Handle interaction tracking with metric
  const handleTrackMetric = async (campaignId: string, metricType: string) => {
    await trackMetric(campaignId, metricType);
    toast({
      title: "Metric Tracked",
      description: `${metricType} interaction has been recorded`,
    });
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Format campaign type for display
  const formatCampaignType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get available segments for the current campaign
  const getCampaignAvailableSegments = async (campaignId: string) => {
    try {
      return await getAvailableSegments(campaignId);
    } catch (err) {
      console.error('Error getting available segments:', err);
      return [];
    }
  };

  // Get campaign link with optional segment
  const getCampaignSegmentLink = (campaignId: string, segmentId?: string) => {
    return getCampaignLink(campaignId, 'website', segmentId);
  };

  // Refresh campaign analytics
  const handleRefreshAnalytics = async (campaignId: string) => {
    await refreshCampaignAnalytics(campaignId);
    toast({
      title: "Analytics Refreshed",
      description: "Campaign performance metrics have been updated.",
    });
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="email">Email Marketing</TabsTrigger>
          <TabsTrigger value="social">Social Sharing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns">
          {activeCampaignId ? (
            // Campaign detail view
            <>
              <div className="mb-4">
                <Button variant="outline" onClick={() => setActiveCampaignId(null)} className="mb-4">
                  ← Back to Campaigns
                </Button>
              </div>
              
              {/* Campaign details */}
              {(() => {
                const campaign = campaigns.find(c => c.id === activeCampaignId);
                if (!campaign) return null;
                
                const campaignSegments = segmentMappings[activeCampaignId] || [];
                const campaignAnalytics = segmentAnalytics[activeCampaignId] || [];
                
                return (
                  <>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{campaign.name}</CardTitle>
                            <CardDescription>
                              {campaign.description || 'No description'}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openCampaignModal(campaign)}
                            >
                              Edit Campaign
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                            <p>{formatCampaignType(campaign.campaign_type)}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                            <p>{campaign.status}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-1">Dates</h3>
                            <p>
                              {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}
                              {' - '}
                              {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'Ongoing'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Campaign Link</h3>
                          <div className="flex items-center gap-2">
                            <Input 
                              value={getCampaignLink(campaign.id)} 
                              readOnly 
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(getCampaignLink(campaign.id));
                                toast({ title: "Copied to clipboard" });
                              }}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                        
                        {/* Performance metrics summary */}
                        <div className="mb-6">
                          <h3 className="text-base font-medium mb-2">Performance Summary</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-muted/20 p-4 rounded-md">
                              <h4 className="text-xs text-muted-foreground">Impressions</h4>
                              <p className="text-2xl font-semibold">
                                {(campaign.metrics?.impressions || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-md">
                              <h4 className="text-xs text-muted-foreground">Clicks</h4>
                              <p className="text-2xl font-semibold">
                                {(campaign.metrics?.clicks || 0).toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-muted/20 p-4 rounded-md">
                              <h4 className="text-xs text-muted-foreground">Conversions</h4>
                              <p className="text-2xl font-semibold">
                                {(campaign.metrics?.conversions || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Audience targeting panel */}
                    <CampaignSegmentPanel
                      campaign={campaign}
                      segmentMappings={campaignSegments}
                      segmentAnalytics={campaignAnalytics}
                      onAssignSegments={(segments) => handleAssignSegments(campaign.id, segments)}
                      onUpdateSegment={(mappingId, updates) => updateSegmentMapping(mappingId, campaign.id, updates)}
                      onRemoveSegment={(mappingId) => handleRemoveSegment(campaign.id, mappingId)}
                      getAvailableSegments={() => getCampaignAvailableSegments(campaign.id)}
                      getCampaignLink={(segmentId) => getCampaignSegmentLink(campaign.id, segmentId)}
                      refreshAnalytics={() => handleRefreshAnalytics(campaign.id)}
                    />
                  </>
                );
              })()}
            </>
          ) : (
            // Campaigns list view
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Marketing Campaigns</CardTitle>
                    <CardDescription>
                      Create and manage marketing campaigns for {eventName}
                    </CardDescription>
                  </div>
                  <Button onClick={() => openCampaignModal()}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading campaigns...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-red-500">Error loading campaigns. Please try again.</p>
                  </div>
                ) : campaigns.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted text-muted-foreground">
                        <tr>
                          <th className="px-4 py-3">Campaign Name</th>
                          <th className="px-4 py-3">Type</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Start Date</th>
                          <th className="px-4 py-3">End Date</th>
                          <th className="px-4 py-3">Audience</th>
                          <th className="px-4 py-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaigns.map(campaign => {
                          // Get the segment count for this campaign
                          const campaignSegmentCount = segmentMappings[campaign.id]?.length || 0;
                          
                          return (
                            <tr 
                              key={campaign.id} 
                              className="border-b hover:bg-muted/50 cursor-pointer"
                              onClick={() => setActiveCampaignId(campaign.id)}
                            >
                              <td className="px-4 py-3 font-medium">{campaign.name}</td>
                              <td className="px-4 py-3">{formatCampaignType(campaign.campaign_type)}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  campaign.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                  campaign.status === 'draft' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                                  campaign.status === 'completed' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' :
                                  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                }`}>
                                  {campaign.status}
                                </span>
                              </td>
                              <td className="px-4 py-3">{campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-4 py-3">{campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-4 py-3">
                                {campaignSegmentCount > 0 ? (
                                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                                    {campaignSegmentCount} segments
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground">
                                    No segments
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openCampaignModal(campaign);
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (campaign.id) handleDeleteCampaign(campaign.id);
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No marketing campaigns found. Create your first campaign to start promoting your event.</p>
                    <Button onClick={() => openCampaignModal()}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Campaign
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="email">
          <EmailMarketingPanel eventId={eventId} eventName={eventName} campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="social">
          <SocialSharingPanel eventId={eventId} eventName={eventName} campaigns={campaigns} />
        </TabsContent>
        
        <TabsContent value="integrations">
          <IntegrationsPanel eventId={eventId} />
        </TabsContent>
      </Tabs>
      
      <MarketingCampaignModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCampaign(undefined);
        }}
        onSave={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}
        campaign={editingCampaign}
        isEditing={!!editingCampaign}
        eventId={eventId}
        availableSegments={segments}
      />
    </>
  );
};

export default MarketingTabContent;
