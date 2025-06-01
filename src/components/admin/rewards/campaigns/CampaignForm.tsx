
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Target, Users } from 'lucide-react';
import { RewardCampaign, AudienceFilter } from '@/lib/rewards/types';
import { AudienceTargeting } from './AudienceTargeting';
import { RewardConfigurator } from './RewardConfigurator';
import { TriggerConditioner } from './TriggerConditioner';
import { cn } from '@/lib/utils';
import { isPreviewEnvironment } from '@/utils/environment';

const establishmentId = isPreviewEnvironment() ? 'default' : ''; // Should be fetched from context in real app

const campaignFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  start_date: z.date(),
  end_date: z.date(),
  status: z.enum(['draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled']),
});

type CampaignFormValues = z.infer<typeof campaignFormSchema>;

interface CampaignFormProps {
  campaign?: RewardCampaign;
  onSubmit: (data: Partial<RewardCampaign>) => void;
  onCancel: () => void;
}

export const CampaignForm = ({ campaign, onSubmit, onCancel }: CampaignFormProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [audienceFilters, setAudienceFilters] = useState<AudienceFilter[]>(
    campaign?.audience_filters || []
  );
  const [rewards, setRewards] = useState<any[]>(
    campaign?.rewards || []
  );
  const [triggerConditions, setTriggerConditions] = useState<any[]>(
    campaign?.trigger_conditions || []
  );
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: campaign ? {
      name: campaign.name,
      description: campaign.description || '',
      start_date: new Date(campaign.start_date),
      end_date: new Date(campaign.end_date),
      status: campaign.status,
    } : {
      name: '',
      description: '',
      start_date: new Date(),
      end_date: new Date(new Date().setDate(new Date().getDate() + 30)),
      status: 'draft',
    }
  });
  
  const handleSubmit = (values: CampaignFormValues) => {
    onSubmit({
      ...values,
      start_date: values.start_date.toISOString(),
      end_date: values.end_date.toISOString(),
      audience_filters: audienceFilters,
      rewards: rewards,
      trigger_conditions: triggerConditions,
      establishment_id: establishmentId,
      is_active: values.status === 'active',
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="audience">Audience Targeting</TabsTrigger>
          <TabsTrigger value="rewards">Campaign Rewards</TabsTrigger>
          <TabsTrigger value="triggers">Trigger Conditions</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <TabsContent value="basic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter campaign description" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe what this campaign is about
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When the campaign will start
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          When the campaign will end
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Current status of the campaign
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="audience">
                <AudienceTargeting 
                  filters={audienceFilters} 
                  onChange={setAudienceFilters}
                />
              </TabsContent>
              
              <TabsContent value="rewards">
                <RewardConfigurator 
                  rewards={rewards}
                  onChange={setRewards}
                />
              </TabsContent>
              
              <TabsContent value="triggers">
                <TriggerConditioner
                  triggers={triggerConditions}
                  onChange={setTriggerConditions}
                />
              </TabsContent>
              
              <div className="flex justify-end space-x-2 mt-8">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {campaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Tabs>
    </div>
  );
};
