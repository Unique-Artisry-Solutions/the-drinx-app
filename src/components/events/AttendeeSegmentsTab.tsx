
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, Info, BarChart3, Users, Mail, Bell, ChevronRight, Trash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import campaign hooks
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { useAudienceSegments } from '@/hooks/campaigns/useAudienceSegments';
import { AudienceSegment, SegmentSelection } from '@/types/CampaignSegmentTypes';
import { useCampaignSegmentMappings } from '@/hooks/campaigns/useCampaignSegmentMappings';
import { CampaignSegmentPanel } from '@/components/events/CampaignSegmentPanel';

export interface AttendeeSegmentsTabProps {
  eventId: string;
  eventName: string;
}

export const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ eventId, eventName }) => {
  const [activeTab, setActiveTab] = useState('segments');
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentDescription, setNewSegmentDescription] = useState('');
  const { toast } = useToast();

  // Hook to manage event marketing campaigns with segments
  const { 
    campaigns, 
    activeCampaign: selectedCampaign,
    isLoading: campaignsLoading, 
    segmentsLoading,
    error: campaignError,
    segments: availableSegments,
    createCampaign,
    selectCampaign,
    assignSegments,
    getSegmentMappings,
    refresh: refreshCampaigns
  } = useEventMarketingWithSegments(eventId);

  const { segments, isLoadingSegments } = useAudienceSegments();

  // Load segment mappings for the selected campaign
  const [mappings, setMappings] = useState<any[]>([]);

  useEffect(() => {
    const loadMappings = async () => {
      if (activeCampaign) {
        try {
          const data = await getSegmentMappings(activeCampaign);
          setMappings(data);
        } catch (error) {
          console.error('Failed to load mappings:', error);
        }
      }
    };

    loadMappings();
  }, [activeCampaign, getSegmentMappings]);

  const handleCreateSegment = async () => {
    if (!newSegmentName) {
      toast({
        title: 'Segment name required',
        description: 'Please provide a name for the segment.',
        variant: 'destructive'
      });
      return;
    }

    try {
      // Use the hook's method to create a segment
      // This is a placeholder - in a real scenario you'd call an API
      console.log('Creating segment:', { name: newSegmentName, description: newSegmentDescription });
      
      toast({
        title: 'Segment created',
        description: `Segment "${newSegmentName}" has been created.`
      });
      
      // Reset form
      setNewSegmentName('');
      setNewSegmentDescription('');
      setShowCreateSegment(false);
      
      // Refresh segments list
    } catch (error) {
      toast({
        title: 'Error creating segment',
        description: 'Failed to create segment. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleAssignSegments = async (campaign: any, segments: SegmentSelection[]) => {
    try {
      await assignSegments(campaign, segments);
      
      // Refresh mappings
      const updatedMappings = await getSegmentMappings(campaign.id);
      setMappings(updatedMappings);
      
      toast({
        title: 'Segments assigned',
        description: 'Audience segments have been assigned to the campaign.'
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error assigning segments',
        description: 'Failed to assign segments. Please try again.',
        variant: 'destructive'
      });
      return false;
    }
  };

  const handleDeleteMapping = async (mappingId: string) => {
    // This is a placeholder - would call API in real scenario
    console.log('Deleting mapping:', mappingId);
    
    // Refresh mappings
    if (activeCampaign) {
      const updatedMappings = await getSegmentMappings(activeCampaign);
      setMappings(updatedMappings);
    }
    
    toast({
      title: 'Segment removed',
      description: 'The segment has been removed from this campaign.'
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderCampaignList = () => {
    if (campaignsLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (campaigns.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">No campaigns found.</p>
          <Button 
            onClick={() => {
              // Create a new campaign
              createCampaign({
                name: `New Campaign for ${eventName}`,
                description: 'Description of the campaign',
                campaign_type: 'email',
                status: 'draft',
                start_date: new Date().toISOString(),
                end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                budget: 0,
                metrics: {},
                target_audience: {},
                event_id: eventId
              });
            }}
            variant="outline"
            className="mt-4"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <Card 
            key={campaign.id} 
            className={activeCampaign === campaign.id ? 'border-primary' : ''}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{campaign.name}</CardTitle>
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </div>
              <CardDescription>{campaign.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Type:</p>
                  <p>{campaign.campaign_type}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dates:</p>
                  <p>{formatDate(campaign.start_date)} - {formatDate(campaign.end_date)}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary"
                onClick={() => {
                  setActiveCampaign(campaign.id);
                  selectCampaign(campaign.id);
                }}
                className="w-full"
              >
                Manage Segments
                <ChevronRight className="ml-auto h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        <Button
          onClick={() => {
            createCampaign({
              name: `New Campaign for ${eventName}`,
              description: 'Description of the campaign',
              campaign_type: 'email',
              status: 'draft',
              start_date: new Date().toISOString(),
              end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              budget: 0,
              metrics: {},
              target_audience: {},
              event_id: eventId
            });
          }}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
      </div>
    );
  };
  
  const renderSegmentTab = () => {
    if (isLoadingSegments) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        {!showCreateSegment ? (
          <Button onClick={() => setShowCreateSegment(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Segment
          </Button>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Create Segment</CardTitle>
              <CardDescription>
                Define a new audience segment for targeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="segment-name">Segment Name</Label>
                <Input
                  id="segment-name"
                  value={newSegmentName}
                  onChange={(e) => setNewSegmentName(e.target.value)}
                  placeholder="e.g. Active Users"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="segment-description">Description</Label>
                <Input
                  id="segment-description"
                  value={newSegmentDescription}
                  onChange={(e) => setNewSegmentDescription(e.target.value)}
                  placeholder="Brief description of this segment"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowCreateSegment(false)}>Cancel</Button>
              <Button onClick={handleCreateSegment}>Create Segment</Button>
            </CardFooter>
          </Card>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-4">Available Segments</h3>
          {segments && segments.length > 0 ? (
            <div className="space-y-4">
              {segments.map((segment: AudienceSegment) => (
                <Card key={segment.id}>
                  <CardHeader className="pb-2">
                    <CardTitle>{segment.name}</CardTitle>
                    <CardDescription>{segment.description || 'No description'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>{segment.memberCount || 0} members</span>
                      </div>
                      <Badge variant={segment.is_active ? 'default' : 'secondary'}>
                        {segment.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No segments found. Create your first segment to start targeting specific audiences.</p>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const renderCampaignDetail = () => {
    if (!activeCampaign || !selectedCampaign) {
      return (
        <div className="text-center p-8">
          <p className="text-muted-foreground">Select a campaign to manage its segments.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => {
              setActiveCampaign(null);
              selectCampaign('');
            }}
          >
            Back to Campaigns
          </Button>
          <h2 className="text-xl font-bold">{selectedCampaign.name}</h2>
        </div>
        
        {segmentsLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <CampaignSegmentPanel
              campaign={selectedCampaign}
              availableSegments={segments || []}
              existingMappings={mappings}
              isLoading={isLoadingSegments}
              onAssignSegments={handleAssignSegments}
            />
            
            <Card>
              <CardHeader>
                <CardTitle>Assigned Segments</CardTitle>
                <CardDescription>
                  Segments currently assigned to this campaign
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mappings.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Segment</TableHead>
                          <TableHead>Allocation</TableHead>
                          <TableHead>Control</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mappings.map((mapping) => {
                          const segmentName = segments?.find(s => s.id === mapping.segment_id)?.name || 'Unknown';
                          return (
                            <TableRow key={mapping.id}>
                              <TableCell>{segmentName}</TableCell>
                              <TableCell>{mapping.allocation_percentage}%</TableCell>
                              <TableCell>{mapping.is_control_group ? 'Yes' : 'No'}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteMapping(mapping.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No segments assigned to this campaign yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Segmentation & Targeting</CardTitle>
        <CardDescription>
          Create and manage audience segments for targeted campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="segments">Segments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="campaigns">
            {activeCampaign ? renderCampaignDetail() : renderCampaignList()}
          </TabsContent>
          
          <TabsContent value="segments">
            {renderSegmentTab()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
