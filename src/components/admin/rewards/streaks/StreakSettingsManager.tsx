
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Plus, Trash } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

// Define the form schema
const settingsSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  description: z.string().optional(),
  streak_type: z.string().min(1, { message: 'Streak type is required.' }),
  grace_period_hours: z.coerce.number().min(1, { message: 'Grace period must be at least 1 hour.' }),
  milestones: z.array(z.coerce.number().min(1, { message: 'Milestone must be at least 1.' })),
  point_values: z.array(z.coerce.number().min(0, { message: 'Point value must be non-negative.' })),
  multipliers: z.array(z.coerce.number().min(0, { message: 'Multiplier must be non-negative.' }))
});

// Define the default values
const defaultValues = {
  name: '',
  description: '',
  streak_type: 'daily_check_in',
  grace_period_hours: 36,
  milestones: [3, 7, 14, 21, 30, 60, 90],
  point_values: [30, 70, 150, 210, 300, 600, 900],
  multipliers: [1, 1, 1.1, 1.2, 1.5, 1.75, 2]
};

const StreakSettingsManager = () => {
  const [streakTypes, setStreakTypes] = useState<string[]>([
    'daily_check_in', 'visit', 'mocktail_review', 'social_share'
  ]);
  const [streakSettings, setStreakSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Set up the form
  const form = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues
  });

  // Fetch streak settings on component mount
  useEffect(() => {
    fetchStreakSettings();
  }, []);

  // Fetch streak settings
  const fetchStreakSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('streak_settings')
        .select('*')
        .order('streak_type', { ascending: true });

      if (error) throw error;
      setStreakSettings(data || []);
      
      if (data && data.length > 0 && !selectedSetting) {
        setSelectedSetting(data[0].id);
        loadSettingToForm(data[0]);
      }
    } catch (error) {
      console.error('Error fetching streak settings:', error);
      toast({
        title: 'Error loading settings',
        description: 'Failed to load streak settings.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load setting to form
  const loadSettingToForm = (setting: any) => {
    form.reset({
      name: setting.name,
      description: setting.description || '',
      streak_type: setting.streak_type,
      grace_period_hours: setting.grace_period_hours,
      milestones: setting.milestones,
      point_values: setting.point_values,
      multipliers: setting.multipliers
    });
  };

  // Handle setting selection
  const handleSelectSetting = (id: string) => {
    const setting = streakSettings.find(s => s.id === id);
    if (setting) {
      setSelectedSetting(id);
      loadSettingToForm(setting);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    setIsSaving(true);
    try {
      // Check if we're updating or creating
      if (selectedSetting) {
        // Update existing setting
        const { error } = await supabase
          .from('streak_settings')
          .update(values)
          .eq('id', selectedSetting);

        if (error) throw error;

        toast({
          title: 'Settings updated',
          description: 'Streak settings have been updated successfully.'
        });
      } else {
        // Create new setting
        const { data, error } = await supabase
          .from('streak_settings')
          .insert(values)
          .select();

        if (error) throw error;

        if (data && data[0]) {
          setSelectedSetting(data[0].id);
        }

        toast({
          title: 'Settings created',
          description: 'New streak settings have been created successfully.'
        });
      }

      // Refresh settings
      fetchStreakSettings();
    } catch (error) {
      console.error('Error saving streak settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Failed to save streak settings.',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle creating new settings
  const handleNewSetting = () => {
    setSelectedSetting(null);
    form.reset(defaultValues);
  };

  // Handle deleting a setting
  const handleDeleteSetting = async (id: string) => {
    if (!confirm('Are you sure you want to delete this streak setting? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('streak_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Setting deleted',
        description: 'Streak setting has been deleted successfully.'
      });

      // If we just deleted the selected setting, reset selection
      if (id === selectedSetting) {
        setSelectedSetting(null);
        form.reset(defaultValues);
      }

      // Refresh settings
      fetchStreakSettings();
    } catch (error) {
      console.error('Error deleting streak setting:', error);
      toast({
        title: 'Error deleting setting',
        description: 'Failed to delete streak setting.',
        variant: 'destructive'
      });
    }
  };

  // Add/remove milestone functions
  const addMilestone = () => {
    const milestones = form.getValues('milestones');
    const pointValues = form.getValues('point_values');
    const multipliers = form.getValues('multipliers');
    
    // Add new entries to all arrays
    form.setValue('milestones', [...milestones, milestones.length > 0 ? milestones[milestones.length - 1] + 7 : 7]);
    form.setValue('point_values', [...pointValues, 100]);
    form.setValue('multipliers', [...multipliers, 1]);
  };

  const removeMilestone = (index: number) => {
    const milestones = form.getValues('milestones').filter((_, i) => i !== index);
    const pointValues = form.getValues('point_values').filter((_, i) => i !== index);
    const multipliers = form.getValues('multipliers').filter((_, i) => i !== index);
    
    form.setValue('milestones', milestones);
    form.setValue('point_values', pointValues);
    form.setValue('multipliers', multipliers);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Settings Manager</CardTitle>
        <CardDescription>Configure streak types, milestones, and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Streak Types</h3>
              <Button onClick={handleNewSetting} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </div>
            
            <div className="space-y-1">
              {streakSettings.map((setting) => (
                <div 
                  key={setting.id}
                  className={`flex justify-between items-center p-2 rounded-md cursor-pointer hover:bg-accent ${selectedSetting === setting.id ? 'bg-accent' : ''}`}
                  onClick={() => handleSelectSetting(setting.id)}
                >
                  <div className="truncate">
                    <div className="font-medium">{setting.name}</div>
                    <div className="text-xs text-muted-foreground">{setting.streak_type}</div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-70 hover:opacity-100" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSetting(setting.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              {streakSettings.length === 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No streak settings found. Create one to get started.
                </div>
              )}
            </div>
          </div>
          
          <div className="md:col-span-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Daily Check-in" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="streak_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Streak Type</FormLabel>
                        <FormControl>
                          <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            {streakTypes.map(type => (
                              <option key={type} value={type}>
                                {type.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Tracks daily check-ins to the application" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="grace_period_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grace Period (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>
                        Hours allowed between activities before a streak breaks
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Milestones & Rewards</h3>
                    <Button type="button" onClick={addMilestone} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Milestone
                    </Button>
                  </div>
                  
                  {form.watch('milestones')?.map((_, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end border-b pb-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`milestones.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Milestone (days)</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`point_values.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Points</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name={`multipliers.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Multiplier</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} step="0.1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="md:col-span-1 flex justify-end">
                        <Button 
                          type="button" 
                          onClick={() => removeMilestone(index)} 
                          variant="ghost" 
                          size="icon"
                          className="self-end"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {form.watch('milestones')?.length === 0 && (
                    <div className="text-center py-4 text-sm text-muted-foreground border rounded-md">
                      No milestones defined. Add at least one milestone.
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {selectedSetting ? 'Update Settings' : 'Create Settings'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakSettingsManager;
