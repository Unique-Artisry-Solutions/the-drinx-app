
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash, Save, AlertTriangle, Info } from 'lucide-react';
import { getAllFeatureFlags, updateFeatureFlag, createFeatureFlag, deleteFeatureFlag, associateFeatureWithTier } from '@/lib/features/admin';
import { FEATURES, featuresByTier } from '@/lib/features/registry';
import SystemSettingsTable from '../SystemSettingsTable';

interface FeatureTogglesTabProps {
  settings: any[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: any;
  changeReason: string;
  onEditClick: (settingId: string, currentValue: any) => void;
  onSaveClick: (settingId: string, isProtected: boolean) => void;
  onCancelClick: () => void;
  setEditValue: (value: any) => void;
  setChangeReason: (reason: string) => void;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

const FeatureTogglesTab: React.FC<FeatureTogglesTabProps> = ({
  settings,
  isLoading: settingsLoading,
  editingSettingId,
  editValue,
  changeReason,
  onEditClick,
  onSaveClick,
  onCancelClick,
  setEditValue,
  setChangeReason,
}) => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeatureDialog, setNewFeatureDialog] = useState(false);
  const [editFeatureDialog, setEditFeatureDialog] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false);
  const [tierMappingDialog, setTierMappingDialog] = useState(false);
  
  // Form states
  const [newFeature, setNewFeature] = useState<{name: string; description: string; status: boolean}>({
    name: '',
    description: '',
    status: false
  });
  
  const [editFeature, setEditFeature] = useState<FeatureFlag | null>(null);
  const [featureToDelete, setFeatureToDelete] = useState<FeatureFlag | null>(null);
  const [featureToMap, setFeatureToMap] = useState<FeatureFlag | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [isEnabled, setIsEnabled] = useState(true);
  
  // Tab state
  const [activeTab, setActiveTab] = useState("features");

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const featuresData = await getAllFeatureFlags();
      setFeatures(featuresData);
    } catch (error) {
      console.error("Error fetching features:", error);
      toast({
        title: "Error",
        description: "Failed to load feature flags",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleCreateFeature = async () => {
    try {
      await createFeatureFlag({
        name: newFeature.name,
        description: newFeature.description,
        status: newFeature.status
      });
      
      toast({
        title: "Success",
        description: "Feature flag created successfully",
      });
      
      setNewFeatureDialog(false);
      setNewFeature({ name: '', description: '', status: false });
      fetchFeatures();
    } catch (error) {
      console.error("Error creating feature:", error);
      toast({
        title: "Error",
        description: "Failed to create feature flag",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFeature = async () => {
    if (!editFeature) return;
    
    try {
      await updateFeatureFlag(editFeature.id, {
        status: editFeature.status,
        description: editFeature.description
      });
      
      toast({
        title: "Success",
        description: "Feature flag updated successfully",
      });
      
      setEditFeatureDialog(false);
      setEditFeature(null);
      fetchFeatures();
    } catch (error) {
      console.error("Error updating feature:", error);
      toast({
        title: "Error",
        description: "Failed to update feature flag",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFeature = async () => {
    if (!featureToDelete) return;
    
    try {
      await deleteFeatureFlag(featureToDelete.id);
      
      toast({
        title: "Success",
        description: "Feature flag deleted successfully",
      });
      
      setDeleteConfirmDialog(false);
      setFeatureToDelete(null);
      fetchFeatures();
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast({
        title: "Error",
        description: "Failed to delete feature flag",
        variant: "destructive",
      });
    }
  };

  const handleAssociateFeatureWithTier = async () => {
    if (!featureToMap || !selectedTier) return;
    
    try {
      await associateFeatureWithTier(featureToMap.id, selectedTier, isEnabled);
      
      toast({
        title: "Success",
        description: `Feature "${featureToMap.name}" ${isEnabled ? 'enabled' : 'disabled'} for ${selectedTier} tier`,
      });
      
      setTierMappingDialog(false);
      setFeatureToMap(null);
      setSelectedTier('');
      setIsEnabled(true);
    } catch (error) {
      console.error("Error mapping feature to tier:", error);
      toast({
        title: "Error",
        description: "Failed to associate feature with tier",
        variant: "destructive",
      });
    }
  };

  const toggleFeatureStatus = async (feature: FeatureFlag) => {
    try {
      await updateFeatureFlag(feature.id, {
        status: !feature.status
      });
      fetchFeatures();
      
      toast({
        title: "Status Updated",
        description: `Feature "${feature.name}" is now ${!feature.status ? 'enabled' : 'disabled'}`,
      });
    } catch (error) {
      console.error("Error toggling feature status:", error);
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Feature Management</CardTitle>
            <CardDescription>Configure and manage feature flags and subscription tiers</CardDescription>
          </div>
          <Button onClick={() => setNewFeatureDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Feature Flag
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="features">Feature Flags</TabsTrigger>
            <TabsTrigger value="tiers">Tier Management</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="features">
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="loader">Loading feature flags...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature Name</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-left p-2 w-24">Status</th>
                      <th className="text-left p-2 w-32">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {features.map((feature) => (
                      <tr key={feature.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{feature.name}</td>
                        <td className="p-2 text-muted-foreground">{feature.description || '-'}</td>
                        <td className="p-2">
                          <Switch
                            checked={feature.status}
                            onCheckedChange={() => toggleFeatureStatus(feature)}
                            aria-label={`${feature.name} status`}
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setEditFeature(feature);
                                setEditFeatureDialog(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-blue-600"
                              onClick={() => {
                                setFeatureToMap(feature);
                                setTierMappingDialog(true);
                              }}
                            >
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600"
                              onClick={() => {
                                setFeatureToDelete(feature);
                                setDeleteConfirmDialog(true);
                              }}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {features.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-muted-foreground">
                          No feature flags found. Click "New Feature Flag" to create one.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tiers">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['free', 'basic', 'premium', 'vip'].map((tier) => {
                const tierFeatures = featuresByTier[tier] || [];
                
                return (
                  <Card key={tier} className="overflow-hidden">
                    <CardHeader className={`
                      ${tier === 'free' ? 'bg-gray-100' : ''} 
                      ${tier === 'basic' ? 'bg-blue-50' : ''}
                      ${tier === 'premium' ? 'bg-purple-50' : ''}
                      ${tier === 'vip' ? 'bg-amber-50' : ''}
                    `}>
                      <CardTitle className="capitalize">{tier} Tier</CardTitle>
                      <CardDescription>
                        {tierFeatures.length} features enabled
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ul className="divide-y">
                        {tierFeatures.map((featureId) => {
                          const feature = features.find(f => f.name === featureId);
                          
                          return (
                            <li key={featureId} className="p-3 flex justify-between items-center">
                              <span className="text-sm">{featureId}</span>
                              <Switch 
                                checked={true} 
                                onCheckedChange={() => {/* Handle change */}}
                                aria-label={`${featureId} status for ${tier} tier`}
                              />
                            </li>
                          );
                        })}
                        
                        {tierFeatures.length === 0 && (
                          <li className="p-3 text-center text-muted-foreground text-sm">
                            No features enabled for this tier
                          </li>
                        )}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <SystemSettingsTable 
              settings={settings.filter(setting => setting.category === 'feature_flags')}
              isLoading={settingsLoading}
              editingSettingId={editingSettingId}
              editValue={editValue}
              changeReason={changeReason}
              onEditClick={onEditClick}
              onSaveClick={onSaveClick}
              onCancelClick={onCancelClick}
              setEditValue={setEditValue}
              setChangeReason={setChangeReason}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Create Feature Dialog */}
      <Dialog open={newFeatureDialog} onOpenChange={setNewFeatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Feature Flag</DialogTitle>
            <DialogDescription>
              Add a new feature flag to the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Feature Name</Label>
              <Input
                id="name"
                placeholder="FEATURE_NAME"
                value={newFeature.name}
                onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
              />
              <p className="text-sm text-muted-foreground">
                Use UPPERCASE_WITH_UNDERSCORES format (e.g., FEATURE_ANALYTICS)
              </p>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Describe what this feature does"
                value={newFeature.description}
                onChange={(e) => setNewFeature({...newFeature, description: e.target.value})}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="status"
                checked={newFeature.status}
                onCheckedChange={(checked) => setNewFeature({...newFeature, status: checked})}
              />
              <Label htmlFor="status">Enable feature by default</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewFeatureDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateFeature} disabled={!newFeature.name.trim()}>Create Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Feature Dialog */}
      <Dialog open={editFeatureDialog} onOpenChange={setEditFeatureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Feature Flag</DialogTitle>
            <DialogDescription>
              Update feature flag details
            </DialogDescription>
          </DialogHeader>
          
          {editFeature && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Feature Name</Label>
                <Input
                  id="edit-name"
                  value={editFeature.name}
                  disabled
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={editFeature.description}
                  onChange={(e) => setEditFeature({...editFeature, description: e.target.value})}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-status"
                  checked={editFeature.status}
                  onCheckedChange={(checked) => setEditFeature({...editFeature, status: checked})}
                />
                <Label htmlFor="edit-status">Feature enabled</Label>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFeatureDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateFeature}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmDialog} onOpenChange={setDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feature flag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {featureToDelete && (
            <div className="py-4">
              <p><strong>Feature name:</strong> {featureToDelete.name}</p>
              <p><strong>Description:</strong> {featureToDelete.description || '-'}</p>
              <p><strong>Status:</strong> {featureToDelete.status ? 'Enabled' : 'Disabled'}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteFeature}>Delete Feature</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tier Mapping Dialog */}
      <Dialog open={tierMappingDialog} onOpenChange={setTierMappingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Tier Access</DialogTitle>
            <DialogDescription>
              {featureToMap && (
                <>Control which subscription tiers have access to <strong>{featureToMap.name}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tier">Subscription Tier</Label>
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger id="tier">
                  <SelectValue placeholder="Select a tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="tier-enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
              <Label htmlFor="tier-enabled">Enable feature for this tier</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setTierMappingDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAssociateFeatureWithTier}
              disabled={!selectedTier}
            >
              Save Tier Setting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default FeatureTogglesTab;
