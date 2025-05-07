
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm, Controller } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useEventMarketing } from '@/hooks/events/useEventMarketing';
import { PlusCircle, Share2, Activity, Settings2, AlertCircle } from 'lucide-react';
import CampaignAnalyticsCard from './CampaignAnalyticsCard';
import { EventMarketingCampaign } from '@/types/EventTypes';

export interface MarketingTabContentProps {
  eventId: string;
  eventName?: string;
}

const MarketingTabContent: React.FC<MarketingTabContentProps> = ({ eventId, eventName }) => {
  const [isCreating, setIsCreating] = useState(false);
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
  const { toast } = useToast();
  const { campaigns, isLoading, createCampaign, refresh } = useEventMarketing(eventId);
  
  useEffect(() => {
    if (eventId) {
      refresh();
    }
  }, [eventId, refresh]);
  
  const handleCreateCampaign = async (data: any) => {
    try {
      await createCampaign({
        name: data.name,
        description: data.description,
        campaign_type: data.campaignType,
        status: 'draft',
        event_id: eventId,
        budget: data.budget ? parseFloat(data.budget) : undefined,
        metrics: {
          impressions: 0,
          clicks: 0, 
          conversions: 0,
          revenue: 0
        },
        target_audience: data.isTargeted ? {
          demographics: data.demographics || {},
          interests: data.interests ? data.interests.split(',').map((i: string) => i.trim()) : [],
          behavior: data.behavior || {}
        } : {}
      });
      
      setIsCreating(false);
      reset();
      toast({
        title: "Campaign Created",
        description: "Your marketing campaign has been created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Campaigns</h2>
          <p className="text-muted-foreground">
            Create and track marketing campaigns for your event
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      {/* Create campaign form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleCreateCampaign)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input 
                    id="name"
                    placeholder="Summer Promotion"
                    {...register('name', { required: 'Campaign name is required' })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message as string}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="campaignType">Campaign Type</Label>
                  <Controller
                    name="campaignType"
                    control={control}
                    defaultValue="social_media"
                    rules={{ required: 'Campaign type is required' }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social_media">Social Media</SelectItem>
                          <SelectItem value="email">Email Marketing</SelectItem>
                          <SelectItem value="influencer">Influencer Partnership</SelectItem>
                          <SelectItem value="paid_ads">Paid Advertising</SelectItem>
                          <SelectItem value="referral">Referral Program</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.campaignType && (
                    <p className="text-sm text-destructive">{errors.campaignType.message as string}</p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your marketing campaign and its goals"
                  rows={3}
                  {...register('description')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (optional)</Label>
                <Input 
                  id="budget"
                  type="number"
                  placeholder="0.00"
                  {...register('budget')}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="isTargeted"
                  control={control}
                  defaultValue={false}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="isTargeted"
                    />
                  )}
                />
                <Label htmlFor="isTargeted">Enable audience targeting</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreating(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Campaign</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {/* Campaigns list */}
      {isLoading ? (
        <div className="text-center py-8">Loading campaigns...</div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 mt-4">
          {campaigns.map((campaign: EventMarketingCampaign) => (
            <CampaignAnalyticsCard
              key={campaign.id}
              campaignId={campaign.id}
              campaignName={campaign.name}
              campaignType={campaign.campaign_type}
              eventId={eventId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-background">
          <div className="space-y-3 w-full max-w-sm mx-auto">
            <div className="mx-auto bg-muted w-12 h-12 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No marketing campaigns</h3>
            <p className="text-sm text-muted-foreground">
              Create your first campaign to promote your event and track its performance.
            </p>
            <Button onClick={() => setIsCreating(true)} variant="outline" className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>
      )}
      
      {/* Quick tips */}
      <Card className="bg-primary/5 border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <AlertCircle className="h-5 w-5 mr-2" />
            Marketing Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>• Start promoting your event at least 6-8 weeks in advance</p>
          <p>• Use consistent branding across all your marketing materials</p>
          <p>• Leverage email marketing for announcements and reminders</p>
          <p>• Create shareable social media content with your event hashtag</p>
          <p>• Consider partnerships with relevant influencers or businesses</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketingTabContent;
