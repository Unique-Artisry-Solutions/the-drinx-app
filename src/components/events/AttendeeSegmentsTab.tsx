
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { CampaignSegmentPanel, SegmentSelection } from './CampaignSegmentPanel';
import { Loader2, Plus, Users, Send } from 'lucide-react';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';
import { useAudienceSegments } from '@/hooks/useAudienceSegments';
import { 
  CampaignSegmentMapping,
  CampaignSegmentAnalytics,
  NotificationPriority
} from '@/types/CampaignSegmentTypes';
import { validateNotificationPriority } from '@/services/typeAdapterService';

interface AttendeeSegmentsTabProps {
  eventId: string;
  eventName: string;
}

export const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ eventId, eventName }) => {
  const [activeTab, setActiveTab] = useState('targeting');
  const [loading, setLoading] = useState(false);
  const [segmentMappings, setSegmentMappings] = useState<CampaignSegmentMapping[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [segmentPerformance, setSegmentPerformance] = useState<CampaignSegmentAnalytics[]>([]);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationContent, setNotificationContent] = useState('');
  const [notificationPriority, setNotificationPriority] = useState<NotificationPriority>('medium');
  const [selectedSegmentIds, setSelectedSegmentIds] = useState<string[]>([]);
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  
  const { toast } = useToast();
  const { 
    campaigns, 
    isLoading: campaignsLoading,
    segmentsLoading,
    activeCampaign,
    selectCampaign,
    getSegmentMappings,
    getSegmentPerformance,
    assignSegments,
    removeSegment,
    createSegmentNotification
  } = useEventMarketingWithSegments(eventId);
  
  const { segments, isLoading: segmentsDataLoading } = useAudienceSegments(eventId);

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaign) {
      // Auto-select the first campaign
      handleCampaignSelect(campaigns[0].id);
    }
  }, [campaigns, selectedCampaign]);

  useEffect(() => {
    if (selectedCampaign) {
      loadSegmentData(selectedCampaign);
    }
  }, [selectedCampaign]);

  const loadSegmentData = async (campaignId: string) => {
    setLoading(true);
    try {
      const mappings = await getSegmentMappings(campaignId);
      setSegmentMappings(mappings);
      
      const performance = await getSegmentPerformance(campaignId);
      setSegmentPerformance(performance);
    } catch (error) {
      console.error("Error loading segment data:", error);
      toast({
        title: "Error",
        description: "Failed to load segment data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaign(campaignId);
    selectCampaign(campaignId);
  };

  const handleAssignSegments = async (segments: SegmentSelection[]) => {
    if (!activeCampaign) return;
    
    const success = await assignSegments(activeCampaign, segments);
    if (success) {
      await loadSegmentData(activeCampaign.id);
    }
  };

  const handleRemoveSegment = async (mappingId: string) => {
    const success = await removeSegment(mappingId);
    if (success && selectedCampaign) {
      await loadSegmentData(selectedCampaign);
    }
  };

  const handleSendNotification = async () => {
    if (!notificationTitle || !notificationContent || selectedSegmentIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSendingNotification(true);
    
    try {
      // Validate and normalize the notification priority
      const validPriority = validateNotificationPriority(notificationPriority);
      
      // Send notification to each selected segment
      const results = await Promise.all(
        selectedSegmentIds.map(segmentId => 
          createSegmentNotification(segmentId, notificationTitle, notificationContent, validPriority)
        )
      );
      
      const allSuccess = results.every(result => result === true);
      
      if (allSuccess) {
        toast({
          title: "Success",
          description: `Notification sent to ${selectedSegmentIds.length} segment(s)`,
        });
        
        // Reset form
        setNotificationTitle('');
        setNotificationContent('');
        setSelectedSegmentIds([]);
      } else {
        toast({
          title: "Partial Success",
          description: "Some notifications may not have been sent",
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast({
        title: "Error",
        description: "Failed to send notifications",
        variant: "destructive",
      });
    } finally {
      setIsSendingNotification(false);
    }
  };

  // Map segments with existing mappings
  const getSegmentsWithMappings = (): SegmentSelection[] => {
    if (!segments) return [];
    
    return segments.map(segmentItem => {
      const existingMapping = segmentMappings.find(m => m.segment_id === segmentItem.id);
      const segmentSelection: SegmentSelection = {
        id: segmentItem.id || segmentItem.segment_id, // Use either id if available
        name: segmentItem.name || 'Unknown Segment',
        allocation: existingMapping?.allocation_percentage || 100,
        isControlGroup: existingMapping?.is_control_group || false,
        description: existingMapping?.description
      };
      return segmentSelection;
    });
  };

  const isLoading = campaignsLoading || segmentsLoading || loading || segmentsDataLoading;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Audience Segments for {eventName}</h2>
      
      <div className="mb-4">
        <Label htmlFor="campaign-selector" className="mb-2 block">Select Campaign:</Label>
        <div className="flex space-x-2">
          <select 
            id="campaign-selector"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedCampaign || ''}
            onChange={(e) => handleCampaignSelect(e.target.value)}
            disabled={isLoading || campaigns.length === 0}
          >
            {campaigns.length === 0 ? (
              <option value="" disabled>No campaigns available</option>
            ) : (
              campaigns.map(campaign => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))
            )}
          </select>
          
          <Button disabled={isLoading} onClick={() => selectedCampaign && loadSegmentData(selectedCampaign)}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="targeting">Segment Targeting</TabsTrigger>
          <TabsTrigger value="notification">Segment Notifications</TabsTrigger>
          <TabsTrigger value="analytics">Segment Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="targeting" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <CampaignSegmentPanel
                campaign={activeCampaign!}
                availableSegments={segments}
                existingMappings={segmentMappings}
                isLoading={isLoading}
                onAssignSegments={handleAssignSegments}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="notification" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Notifications to Segments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="notification-title">Notification Title</Label>
                <Input
                  id="notification-title"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title"
                />
              </div>
              
              <div>
                <Label htmlFor="notification-content">Message Content</Label>
                <textarea
                  id="notification-content"
                  value={notificationContent}
                  onChange={(e) => setNotificationContent(e.target.value)}
                  placeholder="Enter your message here..."
                  className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div>
                <Label htmlFor="notification-priority">Priority</Label>
                <select
                  id="notification-priority"
                  value={notificationPriority}
                  onChange={(e) => setNotificationPriority(e.target.value as NotificationPriority)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <Label className="block mb-2">Select Segments</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                  {segments.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No segments available</p>
                  ) : (
                    segments.map(seg => (
                      <div key={seg.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`segment-${seg.id}`}
                          checked={selectedSegmentIds.includes(seg.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSegmentIds(prev => [...prev, seg.id]);
                            } else {
                              setSelectedSegmentIds(prev => prev.filter(id => id !== seg.id));
                            }
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor={`segment-${seg.id}`} className="text-sm cursor-pointer">
                          {seg.name}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleSendNotification} 
                disabled={isSendingNotification || isLoading}
                className="w-full"
              >
                {isSendingNotification ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Notification
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : segmentPerformance.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium">No segment data available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a campaign and assign segments to view analytics.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left py-2">Segment</th>
                        <th className="text-left py-2">Allocation</th>
                        <th className="text-left py-2">Control Group</th>
                        <th className="text-left py-2">Impressions</th>
                        <th className="text-left py-2">Clicks</th>
                        <th className="text-left py-2">CTR</th>
                        <th className="text-left py-2">Conversions</th>
                        <th className="text-left py-2">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {segmentPerformance.map((perf) => (
                        <tr key={perf.segment_id} className="border-t">
                          <td className="py-2">{perf.segment_name}</td>
                          <td className="py-2">{perf.allocation_percentage}%</td>
                          <td className="py-2">{perf.is_control_group ? 'Yes' : 'No'}</td>
                          <td className="py-2">{perf.total_impressions}</td>
                          <td className="py-2">{perf.total_clicks}</td>
                          <td className="py-2">{perf.click_through_rate.toFixed(2)}%</td>
                          <td className="py-2">{perf.total_conversions}</td>
                          <td className="py-2">{perf.conversion_rate.toFixed(2)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
