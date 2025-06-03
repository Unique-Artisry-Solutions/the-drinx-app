
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

export interface SegmentSelection {
  id: string;
  name: string;
  allocation?: number;
  isControlGroup?: boolean;
  description?: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<SegmentSelection[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState<string | null>(null);

  useEffect(() => {
    // Initialize selected segments with existing mappings
    const initialSegments = existingMappings.map(mapping => ({
      id: mapping.segment_id,
      name: availableSegments.find(s => s.id === mapping.segment_id)?.name || 'Unknown Segment',
      allocation: mapping.allocation_percentage,
      isControlGroup: mapping.is_control_group,
      description: mapping.description
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
        isControlGroup: false
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

  const filteredSegments = availableSegments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSegmentSelected = (segmentId: string) => {
    return selectedSegments.some(s => s.id === segmentId);
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
        
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-2">
            {filteredSegments.length === 0 ? (
              <div className="text-sm text-gray-500 text-center mt-4">
                No segments found.
              </div>
            ) : (
              filteredSegments.map(segment => (
                <div key={segment.id} className="py-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`segment-${segment.id}`} className="flex items-center space-x-2">
                      <Checkbox
                        id={`segment-${segment.id}`}
                        checked={isSegmentSelected(segment.id)}
                        onCheckedChange={() => handleSegmentSelect(segment)}
                      />
                      <span>{segment.name}</span>
                    </Label>
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
                            />
                            <Button variant="ghost" size="icon" onClick={() => setShowDescriptionInput(null)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="link" size="sm" onClick={() => setShowDescriptionInput(segment.id)}>
                            Add Description
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
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
