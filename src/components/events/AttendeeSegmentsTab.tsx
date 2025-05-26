
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { useToast } from '@/hooks/use-toast';
import { useEventMarketingWithSegments } from '@/hooks/events/useEventMarketingWithSegments';

interface AttendeeSegmentsTabProps {
  eventId: string;
}

const AttendeeSegmentsTab: React.FC<AttendeeSegmentsTabProps> = ({ eventId }) => {
  const {
    campaigns,
    segments,
    isLoading,
    error,
    createSegmentNotification,
    createCampaign,
    createSegment,
    campaignName,
    setCampaignName,
    segmentName,
    setSegmentName,
    notificationTitle,
    setNotificationTitle,
    notificationContent,
    setNotificationContent
  } = useEventMarketingWithSegments(eventId);
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
          <CardDescription>
            Manage your marketing campaigns and segment targeting.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
              <Button
                variant="outline"
                onClick={() => createCampaign(campaignName)}
                className="mt-2 w-full"
              >
                Create Campaign
              </Button>
            </div>
            <div>
              <Label htmlFor="segmentName">Segment Name</Label>
              <Input
                id="segmentName"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
                placeholder="Enter segment name"
              />
              <Button
                variant="outline"
                onClick={() => createSegment(segmentName)}
                className="mt-2 w-full"
              >
                Create Segment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Campaigns and Segments</CardTitle>
          <CardDescription>
            View existing campaigns and segments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>A list of your marketing campaigns and segments.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Campaign Name</TableHead>
                <TableHead>Segment Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                segments.map((segment) => (
                  <TableRow key={`${campaign.id}-${segment.id}`}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{segment.name}</TableCell>
                    <TableCell>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor={`notificationTitle-${campaign.id}-${segment.id}`}>
                            Notification Title
                          </Label>
                          <Input
                            type="text"
                            id={`notificationTitle-${campaign.id}-${segment.id}`}
                            value={notificationTitle}
                            onChange={(e) => setNotificationTitle(e.target.value)}
                            placeholder="Enter notification title"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`notificationContent-${campaign.id}-${segment.id}`}>
                            Notification Content
                          </Label>
                          <Input
                            type="text"
                            id={`notificationContent-${campaign.id}-${segment.id}`}
                            value={notificationContent}
                            onChange={(e) => setNotificationContent(e.target.value)}
                            placeholder="Enter notification content"
                          />
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            createSegmentNotification(
                              campaign.id!,
                              segment.id,
                              notificationTitle,
                              notificationContent,
                              'medium'
                            );
                          }}
                          >
                          Send Notification
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendeeSegmentsTab;
