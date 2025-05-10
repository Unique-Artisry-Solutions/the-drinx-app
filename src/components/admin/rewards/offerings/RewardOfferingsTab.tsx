import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RewardOffering, PerformanceTestResult } from '@/lib/rewards/types';
import { mapDbOfferingToClient } from '@/lib/rewards/utils/dataMappers';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface RewardOfferingsTabProps {
  establishmentId: string;
}

const RewardOfferingsTab = () => {
  const [rewardOfferings, setRewardOfferings] = useState<RewardOffering[]>([]);
  const [currentOffering, setCurrentOffering] = useState<RewardOffering>({
    id: '',
    name: '',
    description: '',
    pointCost: 0,
    availableQuantity: null,
    is_active: true,
    image_url: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const establishmentId = 'your-establishment-id'; // Replace with actual ID

  useEffect(() => {
    fetchRewardOfferings();
  }, []);

  const fetchRewardOfferings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_offerings')
        .select('*')
        .eq('establishment_id', establishmentId)
        .order('points_required', { ascending: true });
      
      if (error) throw error;
      
      // Map database fields to client interface
      const mappedData = data.map(mapDbOfferingToClient);
      setRewardOfferings(mappedData);
    } catch (error) {
      console.error('Error fetching reward offerings:', error);
      setError('Failed to load reward offerings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOffering(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleActive = async (offeringId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('reward_offerings')
        .update({ is_active: isActive })
        .eq('id', offeringId);

      if (error) throw error;

      setRewardOfferings(prev =>
        prev.map(offering =>
          offering.id === offeringId ? { ...offering, is_active: isActive } : offering
        )
      );
      toast({
        title: 'Reward offering status updated',
        description: `Reward offering ${isActive ? 'activated' : 'deactivated'} successfully.`,
      });
    } catch (error) {
      console.error('Error toggling reward offering status:', error);
      toast({
        title: 'Failed to update status',
        description: 'There was an error updating the reward offering status.',
        variant: 'destructive',
      });
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setCurrentOffering({
      id: '',
      name: '',
      description: '',
      pointCost: 0,
      availableQuantity: null,
      is_active: true,
      image_url: ''
    });
  };

  const startEditing = (offering: RewardOffering) => {
    setIsEditing(true);
    setCurrentOffering(offering);
  };

  const cancelAction = () => {
    setIsCreating(false);
    setIsEditing(false);
    setCurrentOffering({
      id: '',
      name: '',
      description: '',
      pointCost: 0,
      availableQuantity: null,
      is_active: true,
      image_url: ''
    });
  };

  const deleteOffering = async (offeringId: string) => {
    try {
      const { error } = await supabase
        .from('reward_offerings')
        .delete()
        .eq('id', offeringId);

      if (error) throw error;

      setRewardOfferings(prev => prev.filter(offering => offering.id !== offeringId));
      toast({
        title: 'Reward offering deleted',
        description: 'Reward offering deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting reward offering:', error);
      toast({
        title: 'Failed to delete',
        description: 'There was an error deleting the reward offering.',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      // Convert pointCost to points_required for database compatibility
      const offeringData = {
        name: currentOffering.name,
        description: currentOffering.description,
        points_required: currentOffering.pointCost, // Use the correct field name for database
        quantity_available: currentOffering.availableQuantity,
        expiration_days: currentOffering.availableQuantity ? currentOffering.availableQuantity : null,
        is_active: true,
        establishment_id: establishmentId,
        image_url: currentOffering.image_url || null
      };
      
      if (isCreating) {
        const { error } = await supabase
          .from('reward_offerings')
          .insert([offeringData]);
        
        if (error) throw error;
        toast({
          title: 'Reward offering created',
          description: 'Reward offering created successfully.',
        });
      } else if (isEditing) {
        const { error } = await supabase
          .from('reward_offerings')
          .update(offeringData)
          .eq('id', currentOffering.id);
        
        if (error) throw error;
        toast({
          title: 'Reward offering updated',
          description: 'Reward offering updated successfully.',
        });
      }
      
      fetchRewardOfferings();
      cancelAction();
    } catch (error) {
      console.error('Error creating/updating reward offering:', error);
      toast({
        title: 'Operation failed',
        description: 'Failed to create/update reward offering.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // When displaying reward offerings in the table, use the appropriate properties
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Reward Offerings</CardTitle>
          <CardDescription>
            Manage reward offerings for your establishment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            {!isCreating && !isEditing && (
              <Button onClick={startCreating}>Add Reward Offering</Button>
            )}
            {(isCreating || isEditing) && (
              <Button variant="secondary" onClick={cancelAction}>Cancel</Button>
            )}
          </div>

          {(isCreating || isEditing) && (
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>{isCreating ? 'Create Reward Offering' : 'Edit Reward Offering'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={currentOffering.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={currentOffering.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pointCost">Points Required</Label>
                    <Input
                      type="number"
                      id="pointCost"
                      name="pointCost"
                      value={currentOffering.pointCost}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="availableQuantity">Quantity Available (optional)</Label>
                    <Input
                      type="number"
                      id="availableQuantity"
                      name="availableQuantity"
                      value={currentOffering.availableQuantity || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      type="text"
                      id="image_url"
                      name="image_url"
                      value={currentOffering.image_url || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}

          {!isLoading && rewardOfferings.length === 0 && (
            <div className="text-center py-10 border rounded-md bg-muted/20">
              <h3 className="text-lg font-medium">No reward offerings found</h3>
              <p className="text-muted-foreground mt-2">
                Create your first reward offering to start rewarding your users
              </p>
            </div>
          )}

          {!isLoading && rewardOfferings.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Points Required</TableHead>
                  <TableHead>Quantity Available</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rewardOfferings.map((offering) => (
                  <TableRow key={offering.id}>
                    <TableCell>{offering.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{offering.description}</TableCell>
                    <TableCell>{offering.pointCost}</TableCell>
                    <TableCell>
                      {offering.availableQuantity ? `${offering.availableQuantity}` : 'Unlimited'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={offering.is_active ? "default" : "outline"}>
                        {offering.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(offering)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Reward Offering</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this reward offering? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteOffering(offering.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Switch
                          id={`active-${offering.id}`}
                          checked={offering.is_active}
                          onCheckedChange={(checked) => handleToggleActive(offering.id, checked)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardOfferingsTab;
