import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAsync } from '@/hooks/useAsync';
import { EventMarketingCampaign, ABTestResult } from '@/types/EventTypes';
import { adaptCampaignToABTest } from '@/services/eventAdapterService';

interface EmailMarketingPanelProps {
  campaign: EventMarketingCampaign;
  trackMetric: (
    campaignId: string,
    metricName: string,
    value?: number,
    source?: string
  ) => Promise<void>;
  updateCampaign: (
    id: string,
    updates: Partial<EventMarketingCampaign>
  ) => Promise<EventMarketingCampaign>;
}

const EmailMarketingPanel: React.FC<EmailMarketingPanelProps> = ({
  campaign,
  trackMetric,
  updateCampaign
}) => {
  const [isABTesting, setIsABTesting] = useState(false);
  const [trafficSplit, setTrafficSplit] = useState<number>(50);
  const [selectedCampaign, setSelectedCampaign] = useState<EventMarketingCampaign | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (campaign) {
      setSelectedCampaign(campaign);
    }
  }, [campaign]);

  const abTestResults = useAsync(async () => {
    if (selectedCampaign) {
      return await adaptCampaignToABTest(selectedCampaign);
    }
    return null;
  }, [selectedCampaign]);

  const handleABTestingToggle = async (checked: boolean) => {
    setIsABTesting(checked);
    try {
      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, { isABTesting: checked });
        toast({
          title: "Success",
          description: `A/B testing ${checked ? 'enabled' : 'disabled'}`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update A/B testing status",
      });
    }
  };

  const handleTrafficSplitChange = async (value: number[]) => {
    const newValue = value[0];
    setTrafficSplit(newValue);
    try {
      if (selectedCampaign) {
        await updateCampaign(selectedCampaign.id, { trafficSplit: newValue });
        toast({
          title: "Success",
          description: `Traffic split updated to ${newValue}%`,
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update traffic split",
      });
    }
  };

  const handleLinkClick = async (source: string) => {
    if (selectedCampaign) {
      await trackMetric(campaign.id, 'clicks', 1, source);
      window.open('https://example.com', '_blank');
    }
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Email Marketing</CardTitle>
        <CardDescription>
          Manage your email campaigns and track their performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="ab-testing">Enable A/B Testing</Label>
          <Switch
            id="ab-testing"
            checked={isABTesting}
            onCheckedChange={handleABTestingToggle}
          />
        </div>

        {isABTesting && (
          <>
            <Separator className="my-2" />
            <div className="space-y-2">
              <Label>Traffic Split (A/B)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={trafficSplit}
                  onChange={(e) => setTrafficSplit(Number(e.target.value))}
                  className="w-16"
                />
                <span>%</span>
              </div>
              <Slider
                defaultValue={[trafficSplit]}
                max={100}
                step={1}
                onValueChange={handleTrafficSplitChange}
              />
            </div>
          </>
        )}

        <Separator className="my-2" />

        <div className="space-y-2">
          <Label>Campaign Link</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value="https://example.com"
              readOnly
              className="cursor-not-allowed"
            />
            <Button size="sm" onClick={() => handleLinkClick('email')}>
              Track Link
            </Button>
          </div>
        </div>

        <Separator className="my-2" />

        <div className="space-y-2">
          <Label>Analytics</Label>
          <Table>
            <TableCaption>Email Campaign Analytics</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Source</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>200</TableCell>
                <TableCell>50</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {isABTesting && abTestResults.value && (
          <>
            <Separator className="my-2" />

            <div className="space-y-2">
              <Label>A/B Test Results</Label>
              {abTestResults.loading ? (
                <div>Loading A/B test results...</div>
              ) : abTestResults.error ? (
                <div>Error loading A/B test results.</div>
              ) : (
                <Table>
                  <TableCaption>A/B Test Performance</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Variant</TableHead>
                      <TableHead>Conversion Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abTestResults.value.variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell className="font-medium">{variant.name}</TableCell>
                        <TableCell>{variant.conversionRate.toFixed(2)}%</TableCell>
                        <TableCell>
                          <Button size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailMarketingPanel;
