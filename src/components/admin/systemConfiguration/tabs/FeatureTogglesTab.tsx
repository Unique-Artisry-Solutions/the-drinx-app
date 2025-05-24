
import React, { useEffect, useState } from 'react';
import { SettingsTabProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash, Save, AlertTriangle, Info } from 'lucide-react';
import { getAllFeatureFlags, updateFeatureFlag, createFeatureFlag, deleteFeatureFlag, associateFeatureWithTier } from '@/lib/features/admin';
import { FEATURES, featuresByTier, FeatureId } from '@/lib/features/registry';
import SystemSettingsTable from '../SystemSettingsTable';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

const FeatureTogglesTab: React.FC<SettingsTabProps> = () => {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [newFeatureDescription, setNewFeatureDescription] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureFlags();
  }, []);

  const fetchFeatureFlags = async () => {
    try {
      setIsLoading(true);
      const flags = await getAllFeatureFlags();
      setFeatureFlags(flags);
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load feature flags',
        description: 'Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFeatureFlag = async (id: string, currentStatus: boolean) => {
    try {
      await updateFeatureFlag(id, {
        status: !currentStatus
      });
      
      setFeatureFlags(prev => 
        prev.map(flag => 
          flag.id === id ? { ...flag, status: !currentStatus } : flag
        )
      );
      
      toast({
        title: 'Feature flag updated',
        description: `Feature has been ${!currentStatus ? 'enabled' : 'disabled'}.`,
      });
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update feature flag.',
      });
    }
  };

  const handleCreateFeature = async () => {
    try {
      const newFeature = await createFeatureFlag({
        name: newFeatureName,
        description: newFeatureDescription,
        status: false
      });
      
      setFeatureFlags(prev => [...prev, newFeature]);
      setNewFeatureDialogOpen(false);
      setNewFeatureName('');
      setNewFeatureDescription('');
      
      toast({
        title: 'Feature created',
        description: 'New feature flag has been created.',
      });
    } catch (error) {
      console.error('Error creating feature flag:', error);
      toast({
        variant: 'destructive',
        title: 'Creation failed',
        description: 'Could not create feature flag.',
      });
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (confirm('Are you sure you want to delete this feature flag? This action cannot be undone.')) {
      try {
        await deleteFeatureFlag(id);
        setFeatureFlags(prev => prev.filter(flag => flag.id !== id));
        
        toast({
          title: 'Feature deleted',
          description: 'Feature flag has been removed.',
        });
      } catch (error) {
        console.error('Error deleting feature flag:', error);
        toast({
          variant: 'destructive',
          title: 'Deletion failed',
          description: 'Could not delete feature flag.',
        });
      }
    }
  };

  // Helper function to safely check if a feature name is a valid FeatureId
  const isValidFeatureId = (name: string): name is FeatureId => {
    return Object.values(FEATURES).includes(name as any);
  };

  // Wrapper function for type safety
  const safeAssociateFeatureWithTier = async (featureId: string, tierId: string, isEnabled: boolean = true) => {
    // No explicit type conversion needed, just pass the values
    return await associateFeatureWithTier(featureId, tierId, isEnabled);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>Manage feature flags and access controls</CardDescription>
        </div>
        <Dialog open={newFeatureDialogOpen} onOpenChange={setNewFeatureDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Feature Flag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Feature Flag</DialogTitle>
              <DialogDescription>
                Add a new feature flag to control feature visibility.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Feature Name</label>
                <Input 
                  id="name" 
                  value={newFeatureName} 
                  onChange={(e) => setNewFeatureName(e.target.value)}
                  placeholder="FEATURE_NAME_UPPERCASE"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea 
                  id="description" 
                  value={newFeatureDescription} 
                  onChange={(e) => setNewFeatureDescription(e.target.value)}
                  placeholder="Describe what this feature does..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFeatureDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFeature}>Create Feature</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center text-muted-foreground">Loading feature flags...</div>
        ) : featureFlags.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <div className="flex justify-center mb-2">
              <Info className="h-10 w-10 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-medium">No feature flags found</h3>
            <p className="mt-1">Create a new feature flag to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left font-medium">Name</th>
                    <th className="p-2 text-left font-medium">Description</th>
                    <th className="p-2 text-left font-medium">Status</th>
                    <th className="p-2 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {featureFlags.map((flag) => (
                    <tr key={flag.id} className="border-b">
                      <td className="p-2">{flag.name}</td>
                      <td className="p-2">{flag.description}</td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={flag.status}
                            onCheckedChange={() => handleToggleFeatureFlag(flag.id, flag.status)}
                          />
                          <span className={flag.status ? 'text-green-500' : 'text-muted-foreground'}>
                            {flag.status ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </td>
                      <td className="p-2">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleDeleteFeature(flag.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">System Defined Features</h3>
              <p className="text-sm text-muted-foreground mb-4">
                These features are defined in the application code and cannot be modified directly.
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(FEATURES).map(([key, value]) => (
                  <Badge key={key} variant="outline" className="text-xs py-1">
                    {key}: {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureTogglesTab;
