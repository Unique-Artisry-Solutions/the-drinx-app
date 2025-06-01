
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudienceSegment } from '@/types/AudienceTypes';
import { CriteriaBuilder } from './CriteriaBuilder';
import { Plus, Save, X } from 'lucide-react';

// Define the form schema with Zod
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AudienceSegmentFormProps {
  segment?: AudienceSegment;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const AudienceSegmentForm: React.FC<AudienceSegmentFormProps> = ({
  segment,
  onSubmit,
  onCancel
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const [criteria, setCriteria] = useState<any[]>([]); // Store criteria as we build them
  
  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: segment?.name || '',
      description: segment?.description || '',
      is_active: segment?.is_active ?? true,
    },
  });
  
  const handleAddCriterion = (criterion: any) => {
    setCriteria(prev => [...prev, criterion]);
  };
  
  const handleRemoveCriterion = (index: number) => {
    setCriteria(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      segment: {
        ...values,
        created_by: segment?.created_by || 'current-user', // In real app, use the current user's ID
      },
      criteria: criteria.map(c => ({
        criteria_type: c.type,
        criteria_value: c.value,
        operator: c.operator,
      })),
    });
  };
  
  // Handle tab switching with validation
  const handleTabChange = (value: string) => {
    if (value === 'criteria' && !form.getValues('name')) {
      form.setError('name', { message: 'Please enter a segment name first' });
      return;
    }
    
    setActiveTab(value);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Segment Details</TabsTrigger>
              <TabsTrigger value="criteria">Targeting Criteria</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>{segment ? 'Edit Segment' : 'Create New Segment'}</CardTitle>
                  <CardDescription>
                    Define a segment to target a specific audience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Segment Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Active Users" />
                        </FormControl>
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
                            {...field} 
                            placeholder="Describe this audience segment"
                            rows={3}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional description of what this segment represents
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Active Status</FormLabel>
                          <FormDescription>
                            Enable or disable this segment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="justify-between border-t px-6 py-4">
                  <Button variant="outline" onClick={onCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => setActiveTab('criteria')}>
                    Continue to Criteria
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="criteria">
              <Card>
                <CardHeader>
                  <CardTitle>Targeting Criteria</CardTitle>
                  <CardDescription>
                    Define the conditions that users must meet to be included in this segment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {criteria.length > 0 ? (
                      <div className="space-y-2">
                        {criteria.map((criterion, index) => (
                          <div key={index} className="flex items-center justify-between p-3 rounded-md border">
                            <div>
                              <span className="font-medium">{criterion.type}</span>
                              <span className="mx-2 text-gray-500">{criterion.operator}</span>
                              <span>{JSON.stringify(criterion.value)}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleRemoveCriterion(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border rounded-md bg-muted/50">
                        <p className="text-muted-foreground">No criteria defined yet</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Add at least one criterion to target specific users
                        </p>
                      </div>
                    )}
                    
                    <CriteriaBuilder onAddCriterion={handleAddCriterion} />
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={onCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button variant="outline" onClick={() => setActiveTab('details')}>
                      Back to Details
                    </Button>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={criteria.length === 0}
                    className="space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Segment</span>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </form>
    </Form>
  );
};
