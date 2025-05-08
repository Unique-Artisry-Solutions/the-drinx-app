
import React, { useState, useEffect } from 'react';
import { SettingsTabProps } from '../types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { associateFeatureWithTier } from '@/lib/features/admin';
import { FEATURES, featureRegistry, featuresByTier, FeatureId } from '@/lib/features/registry';
import FeatureBadge from '@/components/pricing/FeatureBadge';

const tiers = ['free', 'basic', 'premium', 'vip'];

const FeatureTierMappingTab: React.FC<SettingsTabProps> = () => {
  const [selectedTier, setSelectedTier] = useState('free');
  const [mappings, setMappings] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTierFeatures(selectedTier);
  }, [selectedTier]);

  const loadTierFeatures = async (tier: string) => {
    setIsLoading(true);
    try {
      // Get features for this tier from the registry
      const tierFeatures = featuresByTier[tier] || [];
      
      // Create a mapping of all features to their enabled status for this tier
      const newMappings: Record<string, boolean> = {};
      
      Object.values(FEATURES).forEach(featureId => {
        newMappings[featureId] = tierFeatures.includes(featureId);
      });
      
      setMappings(newMappings);
    } catch (error) {
      console.error('Error loading tier features:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load tier features',
        description: 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to safely check if a feature ID is a valid FeatureId
  const isValidFeatureId = (id: string): id is FeatureId => {
    return Object.values(FEATURES).includes(id as any);
  };

  const handleToggleFeature = async (featureId: string, currentStatus: boolean) => {
    try {
      // Type guard to ensure featureId is a valid FeatureId
      if (isValidFeatureId(featureId)) {
        // Update the database
        await associateFeatureWithTier(featureId, selectedTier, !currentStatus);
        
        // Update local state
        setMappings(prev => ({
          ...prev,
          [featureId]: !currentStatus
        }));
        
        toast({
          title: 'Feature mapping updated',
          description: `${featureRegistry[featureId]?.name} is now ${!currentStatus ? 'enabled' : 'disabled'} for ${selectedTier} tier`,
        });
      } else {
        throw new Error('Invalid feature ID');
      }
    } catch (error) {
      console.error('Error updating feature tier mapping:', error);
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: 'Could not update feature mapping',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Tier Mapping</CardTitle>
        <CardDescription>Manage which features are available in each subscription tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="tier-select" className="text-sm font-medium">Select Subscription Tier</label>
            <Select value={selectedTier} onValueChange={setSelectedTier}>
              <SelectTrigger id="tier-select" className="w-full sm:w-[240px]">
                <SelectValue placeholder="Select a tier" />
              </SelectTrigger>
              <SelectContent>
                {tiers.map(tier => (
                  <SelectItem key={tier} value={tier}>
                    <div className="flex items-center gap-2">
                      <FeatureBadge tier={tier as any} />
                      <span className="capitalize">{tier}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="py-6 text-center text-muted-foreground">Loading features...</div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Feature</th>
                      <th className="p-2 text-left font-medium">Description</th>
                      <th className="p-2 text-center font-medium">Enabled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(mappings).map(([featureId, isEnabled]) => {
                      // Type guard to ensure featureId is a valid FeatureId
                      if (!isValidFeatureId(featureId)) return null;
                      
                      const feature = featureRegistry[featureId];
                      return (
                        <tr key={featureId} className="border-b">
                          <td className="p-2 font-medium">{feature?.name || featureId}</td>
                          <td className="p-2 text-muted-foreground">{feature?.description || 'No description'}</td>
                          <td className="p-2">
                            <div className="flex justify-center">
                              <Switch
                                checked={isEnabled}
                                onCheckedChange={() => handleToggleFeature(featureId, isEnabled)}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => loadTierFeatures(selectedTier)}>
                  Reset Changes
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureTierMappingTab;
