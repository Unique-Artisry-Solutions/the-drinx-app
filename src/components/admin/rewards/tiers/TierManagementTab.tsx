import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { TierForm } from './TierForm';
import { TierCard } from './TierCard';
import { RewardTier, transformRewardTier } from '@/lib/rewards/types';

export const TierManagementTab = () => {
  const [tiers, setTiers] = useState<RewardTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedTier, setSelectedTier] = useState<RewardTier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_tiers')
        .select('*')
        .order('points_required', { ascending: true });
        
      if (error) throw error;
      
      // Transform the data using the helper function
      const transformedTiers = data?.map(tier => transformRewardTier(tier)) || [];
      setTiers(transformedTiers);
    } catch (error) {
      console.error('Error fetching tiers:', error);
      toast({
        title: 'Failed to load tiers',
        description: 'There was a problem loading the reward tiers.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTier = async (tierData: Partial<RewardTier>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('reward_tiers')
        .insert([tierData])
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Tier created',
        description: 'The reward tier has been created successfully.',
      });
      
      const newTier = transformRewardTier(data);
      setTiers([...tiers, newTier]);
      setIsCreating(false);
    } catch (error) {
      console.error('Error creating tier:', error);
      toast({
        title: 'Failed to create tier',
        description: 'There was a problem creating the reward tier.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTier = async (tierData: Partial<RewardTier>) => {
    if (!selectedTier) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('reward_tiers')
        .update(tierData)
        .eq('id', selectedTier.id)
        .select()
        .single();
        
      if (error) throw error;
      
      toast({
        title: 'Tier updated',
        description: 'The reward tier has been updated successfully.',
      });
      
      const updatedTier = transformRewardTier(data);
      setTiers(tiers.map(t => t.id === selectedTier.id ? updatedTier : t));
      setSelectedTier(null);
    } catch (error) {
      console.error('Error updating tier:', error);
      toast({
        title: 'Failed to update tier',
        description: 'There was a problem updating the reward tier.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTier = async (tierId: string) => {
    if (!confirm('Are you sure you want to delete this tier? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('reward_tiers')
        .delete()
        .eq('id', tierId);
        
      if (error) throw error;
      
      toast({
        title: 'Tier deleted',
        description: 'The reward tier has been deleted successfully.',
      });
      
      setTiers(tiers.filter(t => t.id !== tierId));
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast({
        title: 'Failed to delete tier',
        description: 'There was a problem deleting the reward tier.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Reward Tiers</CardTitle>
            <CardDescription>
              Manage the reward tiers for your loyalty program
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchTiers}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={isCreating} onOpenChange={setIsCreating}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Tier
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create New Reward Tier</DialogTitle>
                  <DialogDescription>
                    Define a new tier for your rewards program
                  </DialogDescription>
                </DialogHeader>
                <TierForm 
                  onSubmit={handleCreateTier}
                  isSubmitting={isSubmitting}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tiers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-4 text-muted-foreground">No reward tiers defined yet</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Tier
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map(tier => (
                <TierCard 
                  key={tier.id} 
                  tier={tier}
                  onEdit={() => setSelectedTier(tier)}
                  onDelete={() => handleDeleteTier(tier.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tier Dialog */}
      <Dialog open={!!selectedTier} onOpenChange={(open) => !open && setSelectedTier(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Reward Tier</DialogTitle>
            <DialogDescription>
              Update the details for this reward tier
            </DialogDescription>
          </DialogHeader>
          {selectedTier && (
            <TierForm 
              tier={selectedTier}
              onSubmit={handleUpdateTier}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
