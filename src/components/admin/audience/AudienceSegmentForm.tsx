
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AudienceSegment, AudienceSegmentCriteria, AudienceFilter } from '@/types/AudienceTypes';
import { CriteriaBuilder } from './CriteriaBuilder';
import { getCurrentUserId } from '@/lib/typedSupabase';

const segmentFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type SegmentFormValues = z.infer<typeof segmentFormSchema>;

interface AudienceSegmentFormProps {
  segment?: AudienceSegment;
  onSubmit: (data: {
    segment: any;
    criteria: Omit<AudienceSegmentCriteria, 'id' | 'segment_id' | 'created_at' | 'updated_at'>[];
  }) => void;
  onCancel: () => void;
}

export const AudienceSegmentForm: React.FC<AudienceSegmentFormProps> = ({ 
  segment, 
  onSubmit, 
  onCancel 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [criteria, setCriteria] = useState<AudienceFilter[]>([]);
  
  const form = useForm<SegmentFormValues>({
    resolver: zodResolver(segmentFormSchema),
    defaultValues: segment 
      ? {
          name: segment.name,
          description: segment.description || '',
          is_active: segment.is_active,
        } 
      : {
          name: '',
          description: '',
          is_active: true,
        }
  });
  
  const handleSubmit = async (values: SegmentFormValues) => {
    const userId = await getCurrentUserId();
    
    const segmentData = {
      ...values,
      created_by: userId,
    };
    
    const criteriaData = criteria.map(filter => ({
      criteria_type: filter.type,
      criteria_value: filter.value,
      operator: filter.operator
    }));
    
    onSubmit({
      segment: segmentData,
      criteria: criteriaData,
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Details</TabsTrigger>
          <TabsTrigger value="criteria">Audience Criteria</TabsTrigger>
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
                      <FormLabel>Segment Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter segment name" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your audience segment
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
                          placeholder="Enter segment description" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Describe the purpose and characteristics of this segment
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Enable or disable this audience segment
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
              </TabsContent>
              
              <TabsContent value="criteria">
                <CriteriaBuilder 
                  criteria={criteria} 
                  onChange={setCriteria}
                />
              </TabsContent>
              
              <div className="flex justify-end space-x-2 mt-8">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {segment ? 'Update Segment' : 'Create Segment'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </Tabs>
    </div>
  );
};
