
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter,
  DialogHeader,
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { 
  ChevronDown, 
  PlusCircle, 
  Users, 
  Percent, 
  BarChart2, 
  Link, 
  Copy, 
  Trash2, 
  AlertCircle 
} from 'lucide-react';
import { CampaignSegmentMapping, CampaignSegmentAnalytics } from '@/types/CampaignSegmentTypes';
import { AudienceSegment } from '@/types/AudienceTypes';
import { EventMarketingCampaign } from '@/types/EventTypes';
import { useToast } from '@/hooks/use-toast';

interface CampaignSegmentPanelProps {
  campaign: EventMarketingCampaign;
  segmentMappings: CampaignSegmentMapping[];
  segmentAnalytics: CampaignSegmentAnalytics[];
  onAssignSegments: (segments: { segment_id: string; allocation_percentage?: number; is_control_group?: boolean }[]) => Promise<void>;
  onUpdateSegment: (mappingId: string, updates: Partial<CampaignSegmentMapping>) => Promise<void>;
  onRemoveSegment: (mappingId: string) => Promise<void>;
  getAvailableSegments: () => Promise<AudienceSegment[]>;
  getCampaignLink: (segmentId?: string) => string;
  refreshAnalytics: () => Promise<void>;
}

export const CampaignSegmentPanel: React.FC<CampaignSegmentPanelProps> = ({
  campaign,
  segmentMappings,
  segmentAnalytics,
  onAssignSegments,
  onUpdateSegment,
  onRemoveSegment,
  getAvailableSegments,
  getCampaignLink,
  refreshAnalytics
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSegments, setAvailableSegments] = useState<AudienceSegment[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<{
    segment_id: string;
    allocation_percentage: number;
    is_control_group: boolean;
  }[]>([]);
  const { toast } = useToast();

  // Load available segments when dialog opens
  const handleOpenAddDialog = async () => {
    setIsLoading(true);
    try {
      const segments = await getAvailableSegments();
      setAvailableSegments(segments);
      setSelectedSegments([]);
      setIsAddDialogOpen(true);
    } catch (error) {
      console.error('Error loading available segments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load available segments',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle segment selection
  const handleSegmentSelect = (segmentId: string, checked: boolean) => {
    if (checked) {
      // Add the segment if it's not already selected
      if (!selectedSegments.some(s => s.segment_id === segmentId)) {
        setSelectedSegments([
          ...selectedSegments,
          {
            segment_id: segmentId,
            allocation_percentage: 100,
            is_control_group: false
          }
        ]);
      }
    } else {
      // Remove the segment if it's selected
      setSelectedSegments(selectedSegments.filter(s => s.segment_id !== segmentId));
    }
  };

  // Handle allocation percentage change
  const handleAllocationChange = (segmentId: string, percentage: number) => {
    setSelectedSegments(selectedSegments.map(s => 
      s.segment_id === segmentId ? { ...s, allocation_percentage: percentage } : s
    ));
  };

  // Handle control group toggle
  const handleControlGroupToggle = (segmentId: string, isControl: boolean) => {
    setSelectedSegments(selectedSegments.map(s => 
      s.segment_id === segmentId ? { ...s, is_control_group: isControl } : s
    ));
  };

  // Handle assignment of selected segments
  const handleAssignSegments = async () => {
    setIsLoading(true);
    try {
      await onAssignSegments(selectedSegments);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error assigning segments:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign segments to campaign',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Copy campaign link to clipboard
  const copyLink = (segmentId?: string) => {
    const link = getCampaignLink(segmentId);
    navigator.clipboard.writeText(link);
    toast({
      title: 'Link Copied',
      description: 'Campaign link copied to clipboard',
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Audience Targeting
            </CardTitle>
            <CardDescription>
              Target specific audience segments with this campaign
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshAnalytics}
            >
              Refresh Analytics
            </Button>
            <Button
              size="sm"
              onClick={handleOpenAddDialog}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Segments
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {segmentMappings.length === 0 ? (
          <div className="text-center py-10 bg-muted/20 rounded-md">
            <Users className="mx-auto h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No audience segments</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Target specific audience segments to increase campaign effectiveness.
            </p>
            <Button
              className="mt-4"
              onClick={handleOpenAddDialog}
              disabled={isLoading}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Segments
            </Button>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Campaign Link</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segmentMappings.map(mapping => {
                  // Find corresponding analytics
                  const analytics = segmentAnalytics.find(a => a.segment_id === mapping.segment_id);
                  
                  return (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">
                        {analytics?.segment_name || 'Unknown Segment'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4 text-muted-foreground" />
                          {mapping.allocation_percentage}%
                        </div>
                      </TableCell>
                      <TableCell>
                        {mapping.is_control_group ? (
                          <Badge variant="outline">Control Group</Badge>
                        ) : (
                          <Badge>Target Group</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {analytics ? (
                          <div className="flex flex-col gap-1">
                            <div className="text-xs">
                              Impressions: <span className="font-medium">{analytics.total_impressions}</span>
                            </div>
                            <div className="text-xs">
                              CTR: <span className="font-medium">{analytics.click_through_rate.toFixed(2)}%</span>
                            </div>
                            <div className="text-xs">
                              Conv: <span className="font-medium">{analytics.conversion_rate.toFixed(2)}%</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">No data yet</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyLink(mapping.segment_id)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onRemoveSegment(mapping.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Remove segment
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Performance Comparison Chart */}
            {segmentAnalytics.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Performance Comparison</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={segmentAnalytics}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="segment_name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="click_through_rate" name="Click-Through Rate (%)" fill="#8884d8" />
                      <Bar yAxisId="right" dataKey="conversion_rate" name="Conversion Rate (%)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>

      {/* Dialog for adding segments */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Audience Segments</DialogTitle>
            <DialogDescription>
              Select segments to target with this campaign. You can set allocation percentages and designate control groups.
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="py-4 text-center">
                Loading available segments...
              </div>
            ) : availableSegments.length === 0 ? (
              <div className="py-4 text-center">
                <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No available segments found. All segments may already be assigned to this campaign.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableSegments.map(segment => {
                  const isSelected = selectedSegments.some(s => s.segment_id === segment.id);
                  const selectedSegment = selectedSegments.find(s => s.segment_id === segment.id);
                  
                  return (
                    <div key={segment.id} className="py-2 border-b">
                      <div className="flex items-center mb-2">
                        <Checkbox
                          id={`segment-${segment.id}`}
                          checked={isSelected}
                          onCheckedChange={(checked) => handleSegmentSelect(segment.id, checked === true)}
                        />
                        <Label htmlFor={`segment-${segment.id}`} className="ml-2 font-medium">
                          {segment.name}
                        </Label>
                      </div>
                      
                      {segment.description && (
                        <p className="text-sm text-muted-foreground ml-6 mb-2">
                          {segment.description}
                        </p>
                      )}
                      
                      {isSelected && (
                        <div className="ml-6 mt-3 space-y-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label htmlFor={`allocation-${segment.id}`}>
                                Allocation Percentage
                              </Label>
                              <span className="text-sm font-medium">
                                {selectedSegment?.allocation_percentage}%
                              </span>
                            </div>
                            <Slider
                              id={`allocation-${segment.id}`}
                              min={1}
                              max={100}
                              step={1}
                              value={[selectedSegment?.allocation_percentage || 100]}
                              onValueChange={(value) => handleAllocationChange(segment.id, value[0])}
                              className="w-full"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`control-${segment.id}`}
                              checked={selectedSegment?.is_control_group || false}
                              onCheckedChange={(checked) => handleControlGroupToggle(segment.id, checked === true)}
                            />
                            <Label htmlFor={`control-${segment.id}`}>
                              Use as control group
                            </Label>
                          </div>
                          
                          {selectedSegment?.is_control_group && (
                            <p className="text-xs text-muted-foreground">
                              Control groups help measure the effectiveness of your campaign by providing a baseline for comparison.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssignSegments}
              disabled={isLoading || selectedSegments.length === 0}
            >
              Assign Segments
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
