import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAudienceSegments } from '@/hooks/campaigns/useAudienceSegments';
import { AudienceSegment, SegmentMapping, EventMarketingCampaign } from '@/types/CampaignSegmentTypes';
import { useCampaignSegmentMappings } from '@/hooks/campaigns/useCampaignSegmentMappings';

interface AttendeeSegmentsTabProps {
  eventId: string;
  campaigns: EventMarketingCampaign[];
  onCampaignsUpdated: (campaigns: EventMarketingCampaign[]) => void;
}

const segmentFormSchema = z.object({
  name: z.string().min(2, {
    message: "Segment name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

type SegmentSelection = {
  id: string;
  isSelected: boolean;
};

export const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ 
  eventId,
  campaigns,
  onCampaignsUpdated
}) => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSegments, setSelectedSegments] = useState<SegmentSelection[]>([]);
  const [currentCampaign, setCurrentCampaign] = useState<EventMarketingCampaign | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const {
    segments,
    isLoadingSegments, // Changed from isLoading to isLoadingSegments
    isSegmentsError,
    refetchSegments,
    createSegment,
    updateSegment,
    deleteSegment
  } = useAudienceSegments();

  const {
    segmentMappings,
    isLoadingMappings,
    isMappingsError,
    refetchMappings,
    createSegmentMapping,
    deleteSegmentMapping
  } = useCampaignSegmentMappings();

  useEffect(() => {
    refetchSegments();
    refetchMappings();
  }, [refetchSegments, refetchMappings]);

  useEffect(() => {
    if (segments) {
      setSelectedSegments(segments.map(segment => ({
        id: segment.id,
        isSelected: false
      })));
    }
  }, [segments]);

  const segmentForm = useForm<z.infer<typeof segmentFormSchema>>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  const handleSegmentCreate = async (values: z.infer<typeof segmentFormSchema>) => {
    try {
      await createSegment({
        name: values.name,
        description: values.description,
        is_active: values.isActive,
      });
      toast({
        title: "Segment created",
        description: "Your segment has been created.",
      });
      segmentForm.reset();
      refetchSegments();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating segment:", error);
      toast({
        title: "Error",
        description: "Failed to create segment.",
        variant: "destructive",
      });
    }
  };

  const assignSegments = async (segments: SegmentSelection[]) => {
    // Implementation 
    if (!segments || segments.length === 0 || !currentCampaign) return;
    
    try {
      setIsAssigning(true);
      
      // Filter out the selected segments
      const selectedSegmentIds = segments
        .filter(segment => segment.isSelected)
        .map(segment => segment.id);
      
      // Fetch existing segment mappings for the campaign
      const existingMappings = segmentMappings.filter(mapping => mapping.campaign_id === currentCampaign.id);
      
      // Delete mappings that are no longer selected
      for (const mapping of existingMappings) {
        if (!selectedSegmentIds.includes(mapping.segment_id)) {
          await deleteSegmentMapping(mapping.id);
        }
      }
      
      // Create mappings for newly selected segments
      for (const segmentId of selectedSegmentIds) {
        if (!existingMappings.find(mapping => mapping.segment_id === segmentId)) {
          await createSegmentMapping({
            campaign_id: currentCampaign.id,
            segment_id: segmentId,
            is_active: true
          });
        }
      }
      
      toast({
        title: "Segments assigned",
        description: "Segments have been assigned to the campaign.",
      });
      
      refetchMappings();
      refetchSegments();
    } catch (error) {
      console.error('Error assigning segments:', error);
      toast({
        title: 'Failed to assign segments',
        description: 'An error occurred while assigning segments to the campaign.',
        variant: 'destructive', // Changed from "warning" to "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  const handleSegmentSelection = (segmentId: string, isSelected: boolean) => {
    setSelectedSegments(prevSegments =>
      prevSegments.map(segment =>
        segment.id === segmentId ? { ...segment, isSelected } : segment
      )
    );
  };

  const handleCampaignSelect = (campaign: EventMarketingCampaign) => {
    setCurrentCampaign(campaign);
    setSelectedSegments(prevSegments =>
      prevSegments.map(segment => {
        const isAssigned = segmentMappings.some(
          mapping => mapping.campaign_id === campaign.id && mapping.segment_id === segment.id
        );
        return { ...segment, isSelected: isAssigned };
      })
    );
  };

  const handleAssignSegmentsClick = async () => {
    if (!currentCampaign) {
      toast({
        title: 'No campaign selected',
        description: 'Please select a campaign to assign segments to.',
        variant: 'destructive',
      });
      return;
    }
    
    await assignSegments(selectedSegments);
  };

  const handleAssignSegments = async (campaign: EventMarketingCampaign) => {
    if (!selectedSegments.length) {
      toast({
        title: 'No segments selected',
        description: 'Please select at least one segment to assign to the campaign.',
        variant: 'destructive', // Changed from "warning" to "destructive"
      });
      return;
    }
    
    setCurrentCampaign(campaign);
    await assignSegments(selectedSegments);
  };

  const isSegmentAssigned = useCallback((segment: AudienceSegment) => {
    if (!currentCampaign) return false;
    return segmentMappings.some(mapping => mapping.segment_id === segment.id);
  }, [currentCampaign, segmentMappings]);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Audience Segments</h2>
        <p className="text-muted-foreground">
          Create and manage audience segments to target your marketing campaigns.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="primary">Create Segment</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Audience Segment</DialogTitle>
              <DialogDescription>
                Create a new segment to target specific users.
              </DialogDescription>
            </DialogHeader>
            <Form {...segmentForm}>
              <form onSubmit={segmentForm.handleSubmit(handleSegmentCreate)} className="space-y-4">
                <FormField
                  control={segmentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Segment Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={segmentForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Segment Description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={segmentForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Active</FormLabel>
                        <FormDescription>
                          Whether the segment is currently active.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Create</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <div>
          <Button onClick={handleAssignSegmentsClick} disabled={!currentCampaign || isAssigning}>
            {isAssigning ? 'Assigning...' : 'Assign Segments'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Segments</CardTitle>
          <CardDescription>
            Manage audience segments for your campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingSegments ? (
            <div>Loading segments...</div>
          ) : isSegmentsError ? (
            <div>Error loading segments</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {segments?.map((segment) => (
                  <TableRow key={segment.id}>
                    <TableCell>{segment.name}</TableCell>
                    <TableCell>{segment.description}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={segment.is_active}
                        disabled
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Campaigns</CardTitle>
          <CardDescription>
            Select a campaign to assign audience segments to.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div>No campaigns found</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  className={`cursor-pointer ${currentCampaign?.id === campaign.id ? 'border-2 border-primary' : ''}`}
                  onClick={() => handleCampaignSelect(campaign)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{campaign.name}</h3>
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {currentCampaign && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Assign Segments to Campaign</CardTitle>
            <CardDescription>
              Select audience segments to assign to the "{currentCampaign.name}" campaign.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingSegments ? (
              <div>Loading segments...</div>
            ) : isSegmentsError ? (
              <div>Error loading segments</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {segments?.map((segment) => (
                  <div key={segment.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`segment-${segment.id}`}
                      checked={selectedSegments.find(s => s.id === segment.id)?.isSelected || false}
                      onCheckedChange={(checked) => handleSegmentSelection(segment.id, checked)}
                    />
                    <Label htmlFor={`segment-${segment.id}`}>{segment.name}</Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
