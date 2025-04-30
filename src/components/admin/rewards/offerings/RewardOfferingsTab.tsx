
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  RewardOffering,
  PerformanceTestResult 
} from '@/lib/rewards/types';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  Award,
  CircleCheck,
  Package,
  Clock,
  MoreVertical,
  Plus,
  Trash2, 
  Edit,
  Calendar,
  ChevronRight,
  ChevronLeft,
  RefreshCw
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { PerformanceTestCard } from '../system-overview/PerformanceTestCard';
import { formatDistanceToNow } from 'date-fns';

interface RewardOfferingFormData {
  id?: string;
  name: string;
  description: string;
  points_required: number;
  quantity_available: number | null;
  expiration_days: number | null;
  is_active: boolean;
  image_url: string;
  establishment_id: string;
}

export function RewardOfferingsTab() {
  // State variables
  const [offerings, setOfferings] = useState<RewardOffering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentOffering, setCurrentOffering] = useState<RewardOfferingFormData | null>(null);
  const [offeringToDelete, setOfferingToDelete] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<PerformanceTestResult | null>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);
  const [performanceError, setPerformanceError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const { toast } = useToast();

  const totalPages = Math.ceil(totalCount / pageSize);

  // Load reward offerings
  useEffect(() => {
    fetchOfferings();
  }, [activeTab, page]);

  const fetchOfferings = async () => {
    setIsLoading(true);
    try {
      // Build query based on active tab
      let query = supabase
        .from('reward_offerings')
        .select('*', { count: 'exact' });
        
      // Apply status filter
      if (activeTab === 'active') {
        query = query.eq('is_active', true);
      } else if (activeTab === 'inactive') {
        query = query.eq('is_active', false);
      }
      
      // Add pagination
      const startIndex = (page - 1) * pageSize;
      query = query.range(startIndex, startIndex + pageSize - 1);
      
      const { data, count, error } = await query;
      
      if (error) throw error;
      
      setOfferings(data || []);
      if (count !== null) {
        setTotalCount(count);
      }
    } catch (error) {
      console.error('Error fetching offerings:', error);
      toast({
        title: "Error",
        description: "Failed to load reward offerings",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test system performance
  const testPerformance = async () => {
    setPerformanceLoading(true);
    setPerformanceError(null);
    try {
      const { data, error } = await supabase
        .rpc('test_reward_system_performance');
      
      if (error) throw error;
      
      if (data) {
        const formattedData: PerformanceTestResult = {};
        data.forEach((row: any) => {
          formattedData[row.test_name] = {
            duration_ms: row.duration_ms,
            status: row.duration_ms < 500 ? 'fast' :
                   row.duration_ms < 1500 ? 'average' : 'slow',
            rows_processed: row.rows_processed
          };
        });
        setPerformanceData(formattedData);
      }
    } catch (error) {
      console.error('Performance test error:', error);
      setPerformanceError(error as Error);
    } finally {
      setPerformanceLoading(false);
    }
  };

  // Export offerings data
  const exportOfferings = () => {
    // Convert offerings to CSV
    if (!offerings.length) return;
    
    const headers = ['Name', 'Description', 'Points Required', 'Quantity', 'Expiration Days', 'Status'];
    const rows = offerings.map(o => [
      o.name,
      o.description || '',
      o.points_required,
      o.quantity_available || 'Unlimited',
      o.expiration_days || 'None',
      o.is_active ? 'Active' : 'Inactive'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'reward_offerings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Reward offerings exported successfully"
    });
  };

  // Create or update offering
  const handleSaveOffering = async () => {
    if (!currentOffering) return;
    
    try {
      const { id, ...offeringData } = currentOffering;
      
      if (id) {
        // Update existing
        const { error } = await supabase
          .from('reward_offerings')
          .update(offeringData)
          .eq('id', id);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Reward offering updated successfully"
        });
      } else {
        // Create new
        const { error } = await supabase
          .from('reward_offerings')
          .insert(offeringData);
          
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "New reward offering created successfully"
        });
      }
      
      setIsDialogOpen(false);
      fetchOfferings();
    } catch (error) {
      console.error('Error saving offering:', error);
      toast({
        title: "Error",
        description: "Failed to save reward offering",
        variant: "destructive"
      });
    }
  };

  // Delete offering
  const handleConfirmDelete = async () => {
    if (!offeringToDelete) return;
    
    try {
      const { error } = await supabase
        .from('reward_offerings')
        .delete()
        .eq('id', offeringToDelete);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Reward offering deleted successfully"
      });
      
      setIsDeleteDialogOpen(false);
      fetchOfferings();
    } catch (error) {
      console.error('Error deleting offering:', error);
      toast({
        title: "Error",
        description: "Failed to delete reward offering",
        variant: "destructive"
      });
    }
  };

  // Open dialog to create new offering
  const handleAddNew = () => {
    // Default to the first establishment for now - in a real app, would be selected
    setCurrentOffering({
      name: '',
      description: '',
      points_required: 100,
      quantity_available: null,
      expiration_days: null,
      is_active: true,
      image_url: '',
      establishment_id: 'default'
    });
    setIsDialogOpen(true);
  };

  // Open dialog to edit existing offering
  const handleEdit = (offering: RewardOffering) => {
    setCurrentOffering({
      id: offering.id,
      name: offering.name,
      description: offering.description || '',
      points_required: offering.points_required,
      quantity_available: offering.quantity_available,
      expiration_days: offering.expiration_days,
      is_active: offering.is_active,
      image_url: offering.image_url || '',
      establishment_id: offering.establishment_id || 'default'
    });
    setIsDialogOpen(true);
  };

  // Open dialog to confirm deletion
  const handleDelete = (id: string) => {
    setOfferingToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Format availability display text
  const formatAvailability = (offering: RewardOffering) => {
    if (offering.quantity_available === null) return 'Unlimited';
    return `${offering.quantity_available} remaining`;
  };

  // Format expiration display text
  const formatExpiration = (offering: RewardOffering) => {
    if (offering.expiration_days === null) return 'Never expires';
    return `${offering.expiration_days} days`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reward Offerings</h2>
          <p className="text-muted-foreground">
            Manage the rewards that users can redeem with their points
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Offering
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex-1" />
        
        <Button variant="outline" onClick={exportOfferings}>
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main offerings table */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>Reward Catalog</CardTitle>
            <CardDescription>
              Available rewards for your loyalty program
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-6 text-center text-muted-foreground">
                Loading reward offerings...
              </div>
            ) : offerings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Expiration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {offerings.map((offering) => (
                    <TableRow key={offering.id}>
                      <TableCell className="font-medium">{offering.name}</TableCell>
                      <TableCell>{offering.points_required}</TableCell>
                      <TableCell>{formatAvailability(offering)}</TableCell>
                      <TableCell>{formatExpiration(offering)}</TableCell>
                      <TableCell>
                        <Badge variant={offering.is_active ? "default" : "secondary"}>
                          {offering.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(offering)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(offering.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                No reward offerings found. Create one to get started.
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance metrics */}
        <div className="space-y-6">
          <PerformanceTestCard
            performanceTest={performanceData}
            isLoading={performanceLoading}
            error={performanceError}
            onRefresh={testPerformance}
            onExport={exportOfferings}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Redemption Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-2xl font-bold">3.2k</div>
                    <div className="text-xs text-muted-foreground">Total Redeemed</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-2xl font-bold">14.7%</div>
                    <div className="text-xs text-muted-foreground">Redemption Rate</div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-2xl font-bold">24h</div>
                    <div className="text-xs text-muted-foreground">Avg Time to Redeem</div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-2">Most Popular Rewards</h4>
                  <div className="space-y-2">
                    {['Free Mocktail', 'Discount Coupon', 'VIP Entry'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="text-sm">{item}</div>
                        <div className="text-sm text-muted-foreground">
                          {[820, 645, 412][i]} redeemed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit/Create dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {currentOffering?.id ? 'Edit Reward Offering' : 'Create Reward Offering'}
            </DialogTitle>
            <DialogDescription>
              {currentOffering?.id
                ? 'Update the details for this reward offering.'
                : 'Add a new reward to your loyalty program.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={currentOffering?.name || ''}
                onChange={(e) => setCurrentOffering(prev => prev ? {...prev, name: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                className="col-span-3"
                value={currentOffering?.description || ''}
                onChange={(e) => setCurrentOffering(prev => prev ? {...prev, description: e.target.value} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points Required
              </Label>
              <Input
                id="points"
                type="number"
                min="1"
                className="col-span-3"
                value={currentOffering?.points_required || ''}
                onChange={(e) => setCurrentOffering(prev => 
                  prev ? {...prev, points_required: parseInt(e.target.value) || 0} : null)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity Available
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <Input
                  id="quantity"
                  type="number"
                  placeholder="Leave blank for unlimited"
                  value={currentOffering?.quantity_available === null ? '' : currentOffering?.quantity_available}
                  onChange={(e) => setCurrentOffering(prev => 
                    prev ? {...prev, quantity_available: e.target.value ? parseInt(e.target.value) : null} : null)}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unlimited"
                    checked={currentOffering?.quantity_available === null}
                    onCheckedChange={(checked) => 
                      setCurrentOffering(prev => prev ? {...prev, quantity_available: checked ? null : 10} : null)}
                  />
                  <Label htmlFor="unlimited">Unlimited</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiration" className="text-right">
                Expiration Days
              </Label>
              <div className="col-span-3 flex items-center gap-4">
                <Input
                  id="expiration"
                  type="number"
                  placeholder="Days until expiration after redemption"
                  value={currentOffering?.expiration_days === null ? '' : currentOffering?.expiration_days}
                  onChange={(e) => setCurrentOffering(prev => 
                    prev ? {...prev, expiration_days: e.target.value ? parseInt(e.target.value) : null} : null)}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    id="no-expiration"
                    checked={currentOffering?.expiration_days === null}
                    onCheckedChange={(checked) => 
                      setCurrentOffering(prev => prev ? {...prev, expiration_days: checked ? null : 30} : null)}
                  />
                  <Label htmlFor="no-expiration">Never expires</Label>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image_url" className="text-right">
                Image URL
              </Label>
              <Input
                id="image_url"
                className="col-span-3"
                value={currentOffering?.image_url || ''}
                onChange={(e) => setCurrentOffering(prev => prev ? {...prev, image_url: e.target.value} : null)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={currentOffering?.is_active}
                  onCheckedChange={(checked) => 
                    setCurrentOffering(prev => prev ? {...prev, is_active: checked} : null)}
                />
                <Label htmlFor="status">
                  {currentOffering?.is_active ? 'Active' : 'Inactive'}
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveOffering}>
              {currentOffering?.id ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this reward offering? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
