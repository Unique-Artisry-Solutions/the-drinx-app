
import React, { useEffect, useState } from 'react';
import { useFeatureToggles } from '@/hooks/admin/systemConfig/useFeatureToggles';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Spinner } from '@/components/ui/spinner';
import { FeatureFlag } from '@/components/admin/systemBreakdown/types/releaseTypes';

const FeatureTogglesTab: React.FC = () => {
  const { featureToggles, isLoading, error, fetchFeatureToggles, updateFeatureToggle, createFeatureToggle, deleteFeatureToggle } = useFeatureToggles();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newToggle, setNewToggle] = useState<Partial<FeatureFlag>>({ name: '', description: '', status: false });
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatureToggles();
  }, [fetchFeatureToggles]);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    await updateFeatureToggle(id, { status: newStatus });
  };

  const handleCreateToggle = async () => {
    if (!newToggle.name?.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Feature name is required',
        variant: 'destructive',
      });
      return;
    }

    const result = await createFeatureToggle(newToggle);
    if (result) {
      setIsCreateDialogOpen(false);
      setNewToggle({ name: '', description: '', status: false });
    }
  };

  const handleDeleteToggle = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feature toggle?')) {
      await deleteFeatureToggle(id);
    }
  };

  const filteredToggles = featureToggles.filter(toggle => 
    toggle.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    toggle.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading && featureToggles.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-red-800">Error loading feature toggles</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2" 
            onClick={() => fetchFeatureToggles()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Feature Toggles</h2>
          <p className="text-muted-foreground">Manage feature flags and toggles for the platform</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> 
          New Toggle
        </Button>
      </div>

      <Input 
        placeholder="Search by name or description..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredToggles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'No feature toggles match your search' : 'No feature toggles created yet'}
                </TableCell>
              </TableRow>
            ) : (
              filteredToggles.map((toggle) => (
                <TableRow key={toggle.id}>
                  <TableCell className="font-medium">{toggle.name}</TableCell>
                  <TableCell>{toggle.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={toggle.status} 
                        onCheckedChange={(checked) => handleStatusChange(toggle.id, checked)}
                      />
                      <Badge variant={toggle.status ? "success" : "secondary"}>
                        {toggle.status ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteToggle(toggle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Feature Toggle Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Feature Toggle</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="toggle-name" className="text-sm font-medium">
                Feature Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="toggle-name"
                placeholder="Enter feature name"
                value={newToggle.name}
                onChange={(e) => setNewToggle({ ...newToggle, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="toggle-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="toggle-description"
                placeholder="Enter description of what this feature does"
                value={newToggle.description || ''}
                onChange={(e) => setNewToggle({ ...newToggle, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="toggle-status"
                checked={!!newToggle.status}
                onCheckedChange={(checked) => setNewToggle({ ...newToggle, status: checked })}
              />
              <label htmlFor="toggle-status" className="text-sm font-medium">
                Enable feature toggle on creation
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateToggle}>
              Create Toggle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeatureTogglesTab;
