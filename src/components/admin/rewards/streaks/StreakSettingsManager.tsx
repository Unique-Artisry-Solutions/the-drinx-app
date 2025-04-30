
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Award, Clock, Edit, Save, Trash2, PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StreakSetting {
  id: string;
  establishment_id: string | null;
  streak_type: string;
  name: string;
  description: string | null;
  grace_period_hours: number;
  milestones: number[];
  point_values: number[];
  multipliers: number[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditableStreakSetting extends StreakSetting {
  isEditing?: boolean;
}

interface MilestoneRow {
  milestone: number;
  points: number;
  multiplier: number;
}

const StreakSettingsManager: React.FC = () => {
  const [streakSettings, setStreakSettings] = useState<EditableStreakSetting[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('global');
  const [editingSetting, setEditingSetting] = useState<EditableStreakSetting | null>(null);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [newSetting, setNewSetting] = useState<Partial<StreakSetting>>({
    streak_type: '',
    name: '',
    description: '',
    grace_period_hours: 36,
    milestones: [3, 7, 14, 21, 30, 60, 90],
    point_values: [30, 70, 150, 210, 300, 600, 900],
    multipliers: [1, 1, 1.1, 1.2, 1.5, 1.75, 2],
    is_active: true
  });
  const [milestoneRows, setMilestoneRows] = useState<MilestoneRow[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { toast } = useToast();

  // Load streak settings
  useEffect(() => {
    fetchStreakSettings();
  }, []);

  const fetchStreakSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('streak_settings')
        .select('*')
        .order('streak_type');

      if (error) {
        throw error;
      }

      setStreakSettings(data || []);
    } catch (error) {
      console.error('Error fetching streak settings:', error);
      toast({
        title: 'Error loading streak settings',
        description: 'Could not load streak settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (setting: StreakSetting) => {
    setEditingSetting({
      ...setting,
      isEditing: true
    });
    
    // Prepare milestone rows
    const rows: MilestoneRow[] = setting.milestones.map((milestone, index) => ({
      milestone,
      points: setting.point_values[index] || 0,
      multiplier: setting.multipliers[index] || 1
    }));
    
    setMilestoneRows(rows);
  };

  const handleAddMilestone = () => {
    if (!milestoneRows.length) {
      setMilestoneRows([{ milestone: 3, points: 30, multiplier: 1 }]);
      return;
    }
    
    const lastMilestone = milestoneRows[milestoneRows.length - 1].milestone;
    const newMilestone = lastMilestone + (lastMilestone >= 30 ? 30 : 7);
    const newPoints = milestoneRows[milestoneRows.length - 1].points * 1.5;
    
    setMilestoneRows([
      ...milestoneRows,
      {
        milestone: newMilestone,
        points: Math.round(newPoints),
        multiplier: 1
      }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    setMilestoneRows(milestoneRows.filter((_, i) => i !== index));
  };

  const handleUpdateMilestone = (index: number, field: keyof MilestoneRow, value: number) => {
    const updatedRows = [...milestoneRows];
    updatedRows[index] = {
      ...updatedRows[index],
      [field]: value
    };
    setMilestoneRows(updatedRows);
  };

  const handleSave = async () => {
    if (!editingSetting) return;
    
    setIsSaving(true);
    
    // Sort milestones and corresponding values
    const sortedRows = [...milestoneRows].sort((a, b) => a.milestone - b.milestone);
    
    // Extract arrays for saving
    const milestones = sortedRows.map(row => row.milestone);
    const pointValues = sortedRows.map(row => row.points);
    const multipliers = sortedRows.map(row => row.multiplier);
    
    try {
      const { error } = await supabase
        .from('streak_settings')
        .update({
          name: editingSetting.name,
          description: editingSetting.description,
          grace_period_hours: editingSetting.grace_period_hours,
          milestones,
          point_values: pointValues,
          multipliers,
          is_active: editingSetting.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingSetting.id);

      if (error) throw error;
      
      toast({
        title: 'Settings saved',
        description: 'Streak settings have been updated successfully.',
      });
      
      // Refresh data
      fetchStreakSettings();
    } catch (error) {
      console.error('Error saving streak settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Could not save streak settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setEditingSetting(null);
    }
  };

  const handleAdd = async () => {
    if (!newSetting.streak_type || !newSetting.name) {
      toast({
        title: 'Missing information',
        description: 'Please provide a streak type and name.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('streak_settings')
        .insert({
          streak_type: newSetting.streak_type,
          name: newSetting.name,
          description: newSetting.description,
          grace_period_hours: newSetting.grace_period_hours,
          milestones: newSetting.milestones,
          point_values: newSetting.point_values,
          multipliers: newSetting.multipliers,
          is_active: newSetting.is_active
        });

      if (error) throw error;
      
      toast({
        title: 'Settings added',
        description: 'New streak settings have been created successfully.',
      });
      
      // Reset form
      setNewSetting({
        streak_type: '',
        name: '',
        description: '',
        grace_period_hours: 36,
        milestones: [3, 7, 14, 21, 30, 60, 90],
        point_values: [30, 70, 150, 210, 300, 600, 900],
        multipliers: [1, 1, 1.1, 1.2, 1.5, 1.75, 2],
        is_active: true
      });
      
      setShowAddDialog(false);
      
      // Refresh data
      fetchStreakSettings();
    } catch (error) {
      console.error('Error adding streak settings:', error);
      toast({
        title: 'Error adding settings',
        description: 'Could not create streak settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (setting: StreakSetting, active: boolean) => {
    try {
      const { error } = await supabase
        .from('streak_settings')
        .update({ is_active: active })
        .eq('id', setting.id);

      if (error) throw error;
      
      // Update local state
      setStreakSettings(prev => prev.map(s => 
        s.id === setting.id ? { ...s, is_active: active } : s
      ));
      
      toast({
        title: active ? 'Setting activated' : 'Setting deactivated',
        description: `The streak setting has been ${active ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      console.error('Error toggling streak setting:', error);
      toast({
        title: 'Error updating settings',
        description: 'Could not update streak settings. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderEditForm = () => {
    if (!editingSetting) return null;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={editingSetting.name}
              onChange={(e) => setEditingSetting({ ...editingSetting, name: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="streak_type">Streak Type</Label>
            <Input
              id="streak_type"
              value={editingSetting.streak_type}
              disabled
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={editingSetting.description || ''}
            onChange={(e) => setEditingSetting({ ...editingSetting, description: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="grace_period">Grace Period (hours)</Label>
            <span className="text-sm text-muted-foreground">{editingSetting.grace_period_hours} hours</span>
          </div>
          <Slider
            id="grace_period"
            value={[editingSetting.grace_period_hours]}
            min={1}
            max={72}
            step={1}
            onValueChange={(values) => setEditingSetting({ ...editingSetting, grace_period_hours: values[0] })}
          />
          <p className="text-xs text-muted-foreground">
            How long a user can miss activity before their streak is broken
          </p>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Milestones</h3>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8" 
              onClick={handleAddMilestone}
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Milestone
            </Button>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Milestone (Days)</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Multiplier</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestoneRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.milestone}
                      onChange={(e) => handleUpdateMilestone(index, 'milestone', parseInt(e.target.value))}
                      min={1}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.points}
                      onChange={(e) => handleUpdateMilestone(index, 'points', parseInt(e.target.value))}
                      min={1}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.multiplier}
                      onChange={(e) => handleUpdateMilestone(index, 'multiplier', parseFloat(e.target.value))}
                      min={0.1}
                      step={0.1}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMilestone(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {milestoneRows.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No milestones defined. Add milestones to reward users for consistent activity.
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={editingSetting.is_active}
              onCheckedChange={(checked) => setEditingSetting({ ...editingSetting, is_active: checked })}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setEditingSetting(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAddDialog = () => {
    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Streak Setting
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Streak Setting</DialogTitle>
            <DialogDescription>
              Define a new streak type with custom milestones and rewards.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-streak-type">Streak Type</Label>
                <Input
                  id="new-streak-type"
                  value={newSetting.streak_type || ''}
                  onChange={(e) => setNewSetting({ ...newSetting, streak_type: e.target.value })}
                  placeholder="e.g., weekend_visits"
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for this streak type
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-name">Name</Label>
                <Input
                  id="new-name"
                  value={newSetting.name || ''}
                  onChange={(e) => setNewSetting({ ...newSetting, name: e.target.value })}
                  placeholder="e.g., Weekend Visit Streak"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-description">Description</Label>
              <Input
                id="new-description"
                value={newSetting.description || ''}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Describe what this streak tracks"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="new-grace-period">Grace Period (hours)</Label>
                <span className="text-sm text-muted-foreground">{newSetting.grace_period_hours} hours</span>
              </div>
              <Slider
                id="new-grace-period"
                value={[newSetting.grace_period_hours || 36]}
                min={1}
                max={72}
                step={1}
                onValueChange={(values) => setNewSetting({ ...newSetting, grace_period_hours: values[0] })}
              />
              <p className="text-xs text-muted-foreground">
                How long a user can miss activity before their streak is broken
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? 'Creating...' : 'Create Setting'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="inline-block animate-spin text-primary">
          <Clock className="h-8 w-8" />
        </div>
        <p className="mt-2">Loading streak settings...</p>
      </div>
    );
  }

  const globalSettings = streakSettings.filter(setting => setting.establishment_id === null);
  const establishmentSettings = streakSettings.filter(setting => setting.establishment_id !== null);

  if (editingSetting) {
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Edit Streak Setting</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setEditingSetting(null)}>
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderEditForm()}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Streak Settings</CardTitle>
        <CardDescription>
          Configure streak behavior, milestones, and rewards to encourage user engagement.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="global">Global Settings</TabsTrigger>
            <TabsTrigger value="establishment">
              Establishment Settings 
              {establishmentSettings.length > 0 && (
                <Badge className="ml-2" variant="secondary">{establishmentSettings.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Global Settings</AlertTitle>
              <AlertDescription>
                These settings apply to all users unless overridden by establishment-specific settings.
              </AlertDescription>
            </Alert>
            
            {globalSettings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Grace Period</TableHead>
                    <TableHead>Milestones</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {globalSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-medium">{setting.name}</TableCell>
                      <TableCell>{setting.streak_type}</TableCell>
                      <TableCell>{setting.grace_period_hours} hours</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-sm">
                                {setting.milestones.length} milestones
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="p-2">
                                <p className="font-semibold mb-1">Milestones:</p>
                                <ul className="text-xs">
                                  {setting.milestones.map((milestone, i) => (
                                    <li key={i}>
                                      {milestone} days: {setting.point_values[i]} points
                                      {setting.multipliers[i] !== 1 && ` (×${setting.multipliers[i]})`}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.is_active ? "default" : "outline"}>
                          {setting.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(setting)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(setting, !setting.is_active)}
                          >
                            {setting.is_active ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <Award className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Award className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No global streak settings configured.</p>
                <p className="text-sm">Add your first streak setting to get started.</p>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              {renderAddDialog()}
            </div>
          </TabsContent>
          
          <TabsContent value="establishment" className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Establishment Settings</AlertTitle>
              <AlertDescription>
                These settings are specific to individual establishments and will override global settings.
              </AlertDescription>
            </Alert>
            
            {establishmentSettings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Establishment</TableHead>
                    <TableHead>Grace Period</TableHead>
                    <TableHead>Milestones</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {establishmentSettings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell className="font-medium">{setting.name}</TableCell>
                      <TableCell>{setting.streak_type}</TableCell>
                      <TableCell>{setting.establishment_id}</TableCell>
                      <TableCell>{setting.grace_period_hours} hours</TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-sm">
                                {setting.milestones.length} milestones
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="p-2">
                                <p className="font-semibold mb-1">Milestones:</p>
                                <ul className="text-xs">
                                  {setting.milestones.map((milestone, i) => (
                                    <li key={i}>
                                      {milestone} days: {setting.point_values[i]} points
                                      {setting.multipliers[i] !== 1 && ` (×${setting.multipliers[i]})`}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <Badge variant={setting.is_active ? "default" : "outline"}>
                          {setting.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(setting)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(setting, !setting.is_active)}
                          >
                            {setting.is_active ? (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            ) : (
                              <Award className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <Award className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>No establishment-specific streak settings.</p>
                <p className="text-sm">Add establishment settings to override global settings.</p>
              </div>
            )}
            
            <div className="flex justify-end mt-4">
              {renderAddDialog()}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default StreakSettingsManager;
