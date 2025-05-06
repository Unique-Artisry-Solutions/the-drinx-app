import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, Search, AlertCircle, XCircle } from 'lucide-react';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { CampaignSegmentMapping } from '@/types/CampaignSegmentTypes';
import { useToast } from '@/hooks/use-toast';

export interface SegmentSelection {
  id: string;
  name: string;
  allocation?: number;
  isControlGroup?: boolean;
  description?: string;
}

interface MarketingTabContentProps {
  campaigns: EventMarketingCampaign[];
  isLoading: boolean;
  error: string | null;
  createCampaign: (campaign: Omit<EventMarketingCampaign, 'event_id'>) => Promise<EventMarketingCampaign>;
  updateCampaign: (id: string, updates: Partial<EventMarketingCampaign>) => Promise<EventMarketingCampaign>;
  deleteCampaign: (id: string) => Promise<void>;
  trackMetric: (campaignId: string, metricName: string, value?: number) => Promise<void>;
  getCampaignLink: (campaignId: string, medium?: string, segmentId?: string) => string;
  refresh: () => void;
  
  // Segment-related props
  segmentMappings: Record<string, CampaignSegmentMapping[]>;
  createCampaignWithSegments?: (
    campaign: Omit<EventMarketingCampaign, 'event_id'>,
    segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean }[]
  ) => Promise<EventMarketingCampaign>;
  assignSegments?: (
    campaignId: string,
    segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean; description?: string }[]
  ) => Promise<CampaignSegmentMapping[]>;
  updateSegmentMapping?: (
    mappingId: string,
    campaignId: string,
    updates: Partial<CampaignSegmentMapping>
  ) => Promise<CampaignSegmentMapping>;
  removeSegment?: (
    mappingId: string,
    campaignId: string
  ) => Promise<void>;
  getAvailableSegments?: (campaignId: string) => Promise<AudienceSegment[]>;
  refreshCampaignAnalytics?: (campaignId: string) => Promise<void>;
}

interface CampaignSegmentPanelProps {
  campaign: EventMarketingCampaign;
  availableSegments: AudienceSegment[];
  existingMappings: CampaignSegmentMapping[];
  isLoading: boolean;
  onAssignSegments: (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => Promise<any>;
}

export const CampaignSegmentPanel: React.FC<CampaignSegmentPanelProps> = ({
  campaign,
  availableSegments,
  existingMappings,
  isLoading,
  onAssignSegments
}) => {
  const [selectedSegments, setSelectedSegments] = useState<SegmentSelection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Initialize selected segments with existing mappings
    const initialSegments = existingMappings.map(mapping => ({
      id: mapping.segment_id,
      name: '', // You might need to fetch the name if it's not in the mapping
      allocation: mapping.allocation_percentage,
      isControlGroup: mapping.is_control_group,
      description: mapping.description
    }));
    setSelectedSegments(initialSegments);
  }, [existingMappings]);

  const handleSegmentToggle = (segment: AudienceSegment) => {
    const isSelected = selectedSegments.some(s => s.id === segment.id);
    
    if (isSelected) {
      setSelectedSegments(prev => prev.filter(s => s.id !== segment.id));
    } else {
      setSelectedSegments(prev => [...prev, { 
        id: segment.id, 
        name: segment.name,
        allocation: 100,
        isControlGroup: false,
        description: ''
      }]);
    }
  };

  const handleAllocationChange = (segmentId: string, value: number) => {
    setSelectedSegments(prev =>
      prev.map(segment =>
        segment.id === segmentId ? { ...segment, allocation: value } : segment
      )
    );
  };

  const handleControlGroupChange = (segmentId: string, checked: boolean) => {
    setSelectedSegments(prev =>
      prev.map(segment =>
        segment.id === segmentId ? { ...segment, isControlGroup: checked } : segment
      )
    );
  };

  const handleDescriptionChange = (segmentId: string, description: string) => {
    setSelectedSegments(prev =>
      prev.map(segment =>
        segment.id === segmentId ? { ...segment, description: description } : segment
      )
    );
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onAssignSegments(campaign, selectedSegments);
      toast({
        title: "Success",
        description: "Segments assigned successfully",
      });
    } catch (error) {
      console.error("Error assigning segments:", error);
      toast({
        title: "Error",
        description: "Failed to assign segments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredSegments = availableSegments.filter(segment =>
    segment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Targeted Segments</CardTitle>
        <CardDescription>
          Assign audience segments to this campaign for targeted marketing.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Input
            type="search"
            placeholder="Search segments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Separator />
        <ScrollArea className="h-[300px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredSegments.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <AlertCircle className="h-6 w-6 mr-2" />
              No segments found.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSegments.map(segment => {
                const isSelected = selectedSegments.some(s => s.id === segment.id);
                const selectedSegment = selectedSegments.find(s => s.id === segment.id);

                return (
                  <div key={segment.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`segment-${segment.id}`}
                        checked={isSelected}
                        onCheckedChange={() => handleSegmentToggle(segment)}
                      />
                      <Label htmlFor={`segment-${segment.id}`}>{segment.name}</Label>
                    </div>
                    {isSelected && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Label htmlFor={`allocation-${segment.id}`} className="text-sm">
                            Allocation:
                          </Label>
                          <Input
                            type="number"
                            id={`allocation-${segment.id}`}
                            className="w-20 text-sm"
                            value={selectedSegment?.allocation?.toString() || '100'}
                            onChange={(e) =>
                              handleAllocationChange(segment.id, parseInt(e.target.value))
                            }
                            min="1"
                            max="100"
                          />
                          <span className="text-sm">%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Label htmlFor={`control-group-${segment.id}`} className="text-sm">
                            Control Group:
                          </Label>
                          <Checkbox
                            id={`control-group-${segment.id}`}
                            checked={selectedSegment?.isControlGroup || false}
                            onCheckedChange={(checked) =>
                              handleControlGroupChange(segment.id, checked)
                            }
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Label htmlFor={`description-${segment.id}`} className="text-sm">
                            Description:
                          </Label>
                          <Input
                            type="text"
                            id={`description-${segment.id}`}
                            className="w-40 text-sm"
                            value={selectedSegment?.description || ''}
                            onChange={(e) =>
                              handleDescriptionChange(segment.id, e.target.value)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
        <Separator />
        <div className="flex justify-end">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                Assigning... <Loader2 className="h-4 w-4 animate-spin ml-2" />
              </>
            ) : (
              <>
                Assign Segments <Plus className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const MarketingTabContent: React.FC<MarketingTabContentProps> = ({
  campaigns,
  isLoading,
  error,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  trackMetric,
  getCampaignLink,
  refresh,
  segmentMappings,
  createCampaignWithSegments,
  assignSegments,
  updateSegmentMapping,
  removeSegment,
  getAvailableSegments,
  refreshCampaignAnalytics
}) => {
  const [isSegmentPanelOpen, setIsSegmentPanelOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<EventMarketingCampaign | null>(null);
  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const marketingHook = {
    refreshCampaignAnalytics,
  };

  const handleOpenSegmentPanel = async (campaign: EventMarketingCampaign) => {
    setSelectedCampaign(campaign);
    
    if (getAvailableSegments && campaign.id) {
      try {
        setLoading(true);
        const segments = await getAvailableSegments(campaign.id);
        setAvailableSegments(segments);
        setIsSegmentPanelOpen(true);
      } catch (error) {
        console.error("Error fetching available segments:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available segments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSegmentPanel = () => {
    setIsSegmentPanelOpen(false);
    setSelectedCampaign(null);
    setAvailableSegments([]);
  };

  const handleAssignSegments = async (campaign: EventMarketingCampaign, segments: SegmentSelection[]): Promise<void> => {
    if (!campaign.id) return;
    
    try {
      setLoading(true);
      
      const segmentAssignments = segments.map(s => ({
        segment_id: s.id,
        allocation_percentage: s.allocation || 100,
        is_control_group: s.isControlGroup || false,
        description: s.description
      }));
      
      await assignSegmentsToCampaign(campaign.id, segmentAssignments);
      
      // Refresh mappings and analytics data
      if (marketingHook) {
        await marketingHook.refreshCampaignAnalytics(campaign.id);
      }
      
      toast({
        title: "Success",
        description: "Segments assigned successfully",
      });
    } catch (error) {
      console.error("Error assigning segments:", error);
      toast({
        title: "Error",
        description: "Failed to assign segments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4">
      {campaigns.map(campaign => (
        <Card key={campaign.id}>
          <CardHeader>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription>{campaign.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>Type: {campaign.campaign_type}</p>
            <p>Status: {campaign.status}</p>
            {segmentMappings && segmentMappings[campaign.id || ''] && (
              <div>
                <p>Segments: {segmentMappings[campaign.id || ''].length}</p>
              </div>
            )}
            <Button onClick={() => handleOpenSegmentPanel(campaign)} disabled={loading}>
              {loading ? (
                <>
                  Loading... <Loader2 className="h-4 w-4 animate-spin ml-2" />
                </>
              ) : (
                <>
                  Manage Segments <Users className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
      
      {isSegmentPanelOpen && selectedCampaign && (
        <CampaignSegmentPanel
          campaign={selectedCampaign}
          availableSegments={availableSegments}
          existingMappings={segmentMappings[selectedCampaign.id || ''] || []}
          isLoading={loading}
          onAssignSegments={handleAssignSegments}
        />
      )}
    </div>
  );
};
