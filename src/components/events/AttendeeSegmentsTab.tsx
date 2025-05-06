
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { CampaignSegmentPanel, SegmentSelection } from '@/components/events/CampaignSegmentPanel';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { Loader2, Plus } from 'lucide-react';

interface AttendeeSegmentsTabProps {
  eventId: string;
  eventName: string;
}

const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ eventId, eventName }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<EventMarketingCampaign | null>(null);
  const [availableSegments, setAvailableSegments] = useState([]);
  const { campaigns, isLoading, segmentMappings, getAvailableSegments, assignSegments } = useEventMarketingWithSegments(eventId);
  const { segments, isLoadingSegments } = useAudienceSegments();

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(campaigns[0]);
    }
  }, [campaigns, selectedCampaign]);

  useEffect(() => {
    const fetchAvailableSegments = async () => {
      if (selectedCampaign) {
        try {
          const segments = await getAvailableSegments(selectedCampaign.id);
          setAvailableSegments(segments);
        } catch (error) {
          console.error('Error fetching available segments:', error);
        }
      }
    };
    
    fetchAvailableSegments();
  }, [selectedCampaign, getAvailableSegments]);

  const handleAssignSegments = async (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => {
    try {
      await assignSegments(
        campaign.id, 
        segments.map(s => ({
          segment_id: s.id,
          allocation_percentage: s.allocation,
          is_control_group: s.isControlGroup,
          description: s.description
        }))
      );
      return true;
    } catch (error) {
      console.error('Error assigning segments:', error);
      return false;
    }
  };

  if (isLoading || isLoadingSegments) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Audience Targeting</CardTitle>
          <CardDescription>No campaigns found for this event</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
          <p className="text-center text-muted-foreground">
            Create a marketing campaign first before targeting audience segments
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </CardContent>
      </Card>
    );
  }

  const campaignMappings = selectedCampaign ? segmentMappings[selectedCampaign.id] || [] : [];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience Segments for Campaign</CardTitle>
          <CardDescription>
            Target specific audience segments with your marketing campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Campaign</label>
              <select 
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedCampaign?.id}
                onChange={(e) => {
                  const campaign = campaigns.find(c => c.id === e.target.value);
                  setSelectedCampaign(campaign || null);
                }}
              >
                {campaigns.map((campaign) => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCampaign && (
              <CampaignSegmentPanel
                campaign={selectedCampaign}
                availableSegments={availableSegments}
                existingMappings={campaignMappings}
                isLoading={false}
                onAssignSegments={handleAssignSegments}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendeeSegmentsTab;
