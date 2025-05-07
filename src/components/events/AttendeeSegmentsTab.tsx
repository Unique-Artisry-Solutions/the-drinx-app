import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Plus, Search, AlertCircle, XCircle, Bell, MessageSquare } from 'lucide-react';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { CampaignSegmentMapping, NotificationPriority } from '@/types/CampaignSegmentTypes';
import { useToast } from '@/hooks/use-toast';
import { validateNotificationPriority } from '@/services/typeAdapterService';

export interface SegmentSelection {
  id: string;
  name: string;
  allocation?: number;
  isControlGroup?: boolean;
  description?: string;
  segment_id?: string;
}

interface AttendeeSegmentsTabProps {
  campaign: EventMarketingCampaign;
  availableSegments: AudienceSegment[];
  existingMappings: CampaignSegmentMapping[];
  isLoading: boolean;
  segmentsLoading: boolean;
  onAssignSegments: (campaign: EventMarketingCampaign, segments: SegmentSelection[]) => Promise<any>;
  onRemoveSegment: (mappingId: string) => Promise<any>;
  getTargetedContent: (segmentId: string, contentType: string) => Promise<any>;
  createSegmentNotification: (segmentId: string, title: string, content: string, priority: NotificationPriority) => Promise<boolean>;
}

export const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({
  campaign,
  availableSegments,
  existingMappings,
  isLoading,
  segmentsLoading,
  onAssignSegments,
  onRemoveSegment,
  getTargetedContent,
  createSegmentNotification
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<SegmentSelection[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState<string | null>(null);
  const [notificationDetails, setNotificationDetails] = useState<{
    segmentId: string;
    title: string;
    content: string;
    priority: NotificationPriority;
  } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize selected segments with existing mappings
    const initialSegments = existingMappings.map(mapping => ({
      id: mapping.segment_id,
      name: availableSegments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment',
      allocation: mapping.allocation_percentage,
      isControlGroup: mapping.is_control_group,
      description: mapping.description,
      segment_id: mapping.segment_id
    }));
    setSelectedSegments(initialSegments);
  }, [existingMappings, availableSegments]);

  const handleSegmentSelect = (segment: AudienceSegment) => {
    const isSelected = selectedSegments.some(s => s.id === segment.id);
    
    if (isSelected) {
      setSelectedSegments(prev => prev.filter(s => s.id !== segment.id));
    } else {
      setSelectedSegments(prev => [...prev, { 
        id: segment.id, 
        name: segment.name,
        allocation: 100,
        isControlGroup: false,
        segment_id: segment.id
      }]);
    }
  };

  const handleAllocationChange = (segmentId: string, value: number) => {
    setSelectedSegments(prev => 
      prev.map(s => s.id === segmentId ? { ...s, allocation: value } : s)
    );
  };

  const handleControlGroupChange = (segmentId: string, checked: boolean) => {
    setSelectedSegments(prev =>
      prev.map(s => s.id === segmentId ? { ...s, isControlGroup: checked } : s)
    );
  };

  const handleDescriptionChange = (segmentId: string, description: string) => {
    setSelectedSegments(prev =>
      prev.map(s => s.id === segmentId ? { ...s, description: description } : s)
    );
  };

  const handleAssign = async () => {
    setIsAssigning(true);
    try {
      await onAssignSegments(campaign, selectedSegments);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleRemove = async (mappingId: string) => {
    setIsAssigning(true);
    try {
      await onRemoveSegment(mappingId);
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredSegments = availableSegments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSegmentSelected = (segmentId: string) => {
    return selectedSegments.some(s => s.id === segmentId);
  };

  const handleNotificationDetailsChange = (
    segmentId: string,
    field: 'title' | 'content' | 'priority',
    value: string
  ) => {
    setNotificationDetails(prev => ({
      ...prev,
      segmentId: segmentId,
      [field]: value,
    } as any));
  };

  const handleCreateNotification = async (segmentId: string) => {
    if (!notificationDetails?.title || !notificationDetails?.content) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content for the notification.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const success = await createSegmentNotification(
        segmentId,
        notificationDetails.title,
        notificationDetails.content,
        notificationDetails.priority
      );

      if (success) {
        toast({
          title: 'Success',
          description: 'Notification created and sent to segment members.',
        });
        setNotificationDetails(null);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to create notification.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error creating segment notification:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create notification.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Segments</CardTitle>
        <CardDescription>
          Target specific audience segments with this campaign.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search segments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Separator />
        
        {segmentsLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-2">
            {filteredSegments.length === 0 ? (
              <div className="text-sm text-gray-500 text-center mt-4">
                No segments found.
              </div>
            ) : (
              filteredSegments.map(segment => {
                const s = segment as any;
                const existingMapping = existingMappings.find(m => m.segment_id === s.id);
                const segment: SegmentSelection = {
                  id: s.id || s.segment_id, // Use either id if available
                  name: s.name || 'Unknown Segment',
                  segment_id: s.segment_id
                };

                return (
                  <div key={segment.id} className="py-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`segment-${segment.id}`} className="flex items-center space-x-2">
                        <Checkbox
                          id={`segment-${segment.id}`}
                          checked={isSegmentSelected(segment.id)}
                          onCheckedChange={() => handleSegmentSelect(segment)}
                          disabled={!!existingMapping}
                        />
                        <span>{segment.name}</span>
                      </Label>
                      {existingMapping && (
                        <Button variant="destructive" size="icon" onClick={() => handleRemove(existingMapping.id)}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {isSegmentSelected(segment.id) && (
                      <div className="mt-2 pl-6 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`allocation-${segment.id}`} className="text-sm">
                            Allocation %:
                          </Label>
                          <Input
                            type="number"
                            id={`allocation-${segment.id}`}
                            value={selectedSegments.find(s => s.id === segment.id)?.allocation || 100}
                            onChange={(e) => handleAllocationChange(segment.id, Number(e.target.value))}
                            min="1"
                            max="100"
                            className="w-20 text-sm"
                            disabled={!!existingMapping}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Label htmlFor={`control-group-${segment.id}`} className="text-sm">
                            Control Group:
                          </Label>
                          <Checkbox
                            id={`control-group-${segment.id}`}
                            checked={selectedSegments.find(s => s.id === segment.id)?.isControlGroup || false}
                            onCheckedChange={(checked) => handleControlGroupChange(segment.id, !!checked)}
                            disabled={!!existingMapping}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`description-${segment.id}`} className="text-sm">
                            Description:
                          </Label>
                          {showDescriptionInput === segment.id ? (
                            <div className="flex items-center space-x-2">
                              <Input
                                type="text"
                                id={`description-${segment.id}`}
                                value={selectedSegments.find(s => s.id === segment.id)?.description || ''}
                                onChange={(e) => handleDescriptionChange(segment.id, e.target.value)}
                                className="text-sm"
                                disabled={!!existingMapping}
                              />
                              <Button variant="ghost" size="icon" onClick={() => setShowDescriptionInput(null)}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button variant="link" size="sm" onClick={() => setShowDescriptionInput(segment.id)} disabled={!!existingMapping}>
                              Add Description
                            </Button>
                          )}
                        </div>
                        <Separator />
                        <div className="space-y-1">
                          <Label htmlFor={`notification-title-${segment.id}`} className="text-sm">
                            Notification Title:
                          </Label>
                          <Input
                            type="text"
                            id={`notification-title-${segment.id}`}
                            value={notificationDetails?.segmentId === segment.id ? notificationDetails.title : ''}
                            onChange={(e) => handleNotificationDetailsChange(segment.id, 'title', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`notification-content-${segment.id}`} className="text-sm">
                            Notification Content:
                          </Label>
                          <Input
                            type="text"
                            id={`notification-content-${segment.id}`}
                            value={notificationDetails?.segmentId === segment.id ? notificationDetails.content : ''}
                            onChange={(e) => handleNotificationDetailsChange(segment.id, 'content', e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`notification-priority-${segment.id}`} className="text-sm">
                            Notification Priority:
                          </Label>
                          <select
                            id={`notification-priority-${segment.id}`}
                            className="w-full text-sm rounded-md border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            value={notificationDetails?.segmentId === segment.id ? notificationDetails.priority : 'medium'}
                            onChange={(e) => handleNotificationDetailsChange(segment.id, 'priority', e.target.value)}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            if (segment.segment_id) {
                              handleCreateNotification(segment.segment_id);
                            }
                          }}
                        >
                          <Bell className="mr-2 h-4 w-4" />
                          Create Notification
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </ScrollArea>
        )}

        <Button onClick={handleAssign} disabled={isLoading || isAssigning}>
          {isAssigning ? (
            <>
              Assigning...
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Assign Segments
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
