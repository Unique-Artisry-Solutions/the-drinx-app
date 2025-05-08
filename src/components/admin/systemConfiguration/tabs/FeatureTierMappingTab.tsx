
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllFeatureFlags, associateFeatureWithTier } from '@/lib/features/admin';
import { FEATURES, featureRegistry, featuresByTier } from '@/lib/features/registry';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  status: boolean;
}

interface TierMapping {
  tierId: string;
  featureId: string;
  isEnabled: boolean;
}

const FeatureTierMappingTab: React.FC = () => {
  const { toast } = useToast();
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [mappings, setMappings] = useState<TierMapping[]>([]);
  const [bulkSelectedFeatures, setBulkSelectedFeatures] = useState<string[]>([]);
  const [bulkSelectedTiers, setBulkSelectedTiers] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<'enable' | 'disable'>('enable');

  const tiers = ['free', 'basic', 'premium', 'vip'];

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    setIsLoading(true);
    try {
      const featuresData = await getAllFeatureFlags();
      setFeatures(featuresData);
      
      // Create initial mappings from registry
      const initialMappings: TierMapping[] = [];
      
      tiers.forEach(tierId => {
        const tierFeatures = featuresByTier[tierId] || [];
        
        featuresData.forEach(feature => {
          initialMappings.push({
            tierId,
            featureId: feature.name,
            isEnabled: tierFeatures.includes(feature.name)
          });
        });
      });
      
      setMappings(initialMappings);
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

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleTierToggle = async (featureId: string, tierId: string, isChecked: boolean) => {
    try {
      // Find the feature in our state
      const feature = features.find(f => f.name === featureId);
      if (!feature) return;
      
      // Update the mapping in our state
      setMappings(prev => 
        prev.map(mapping => 
          mapping.featureId === featureId && mapping.tierId === tierId
            ? { ...mapping, isEnabled: isChecked }
            : mapping
        )
      );
      
      // Save to database
      await associateFeatureWithTier(feature.id, tierId, isChecked);
      
      toast({
        title: "Success",
        description: `Feature "${featureId}" ${isChecked ? 'enabled' : 'disabled'} for ${tierId} tier`,
      });
    } catch (error) {
      console.error("Error updating tier mapping:", error);
      toast({
        title: "Error",
        description: "Failed to update tier mapping",
        variant: "destructive",
      });
      
      // Revert our state change on error
      setMappings(prev => 
        prev.map(mapping => 
          mapping.featureId === featureId && mapping.tierId === tierId
            ? { ...mapping, isEnabled: !isChecked }
            : mapping
        )
      );
    }
  };
  
  const isFeatureEnabledForTier = (featureId: string, tierId: string): boolean => {
    const mapping = mappings.find(m => m.featureId === featureId && m.tierId === tierId);
    return mapping ? mapping.isEnabled : false;
  };
  
  const handleBulkToggleFeature = (featureId: string) => {
    if (bulkSelectedFeatures.includes(featureId)) {
      setBulkSelectedFeatures(bulkSelectedFeatures.filter(id => id !== featureId));
    } else {
      setBulkSelectedFeatures([...bulkSelectedFeatures, featureId]);
    }
  };
  
  const handleBulkToggleTier = (tierId: string) => {
    if (bulkSelectedTiers.includes(tierId)) {
      setBulkSelectedTiers(bulkSelectedTiers.filter(id => id !== tierId));
    } else {
      setBulkSelectedTiers([...bulkSelectedTiers, tierId]);
    }
  };
  
  const handleBulkApply = async () => {
    if (bulkSelectedFeatures.length === 0 || bulkSelectedTiers.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one feature and one tier",
        variant: "destructive",
      });
      return;
    }
    
    const isEnabled = bulkAction === 'enable';
    const totalOperations = bulkSelectedFeatures.length * bulkSelectedTiers.length;
    let successCount = 0;
    
    try {
      // Update mappings first in UI
      setMappings(prev => 
        prev.map(mapping => 
          bulkSelectedFeatures.includes(mapping.featureId) && bulkSelectedTiers.includes(mapping.tierId)
            ? { ...mapping, isEnabled }
            : mapping
        )
      );
      
      // Then update in database
      for (const featureId of bulkSelectedFeatures) {
        const feature = features.find(f => f.name === featureId);
        if (!feature) continue;
        
        for (const tierId of bulkSelectedTiers) {
          try {
            await associateFeatureWithTier(feature.id, tierId, isEnabled);
            successCount++;
          } catch (error) {
            console.error(`Error updating mapping for ${featureId} and tier ${tierId}:`, error);
          }
        }
      }
      
      toast({
        title: "Bulk Update Complete",
        description: `Successfully updated ${successCount} of ${totalOperations} feature-tier mappings`,
      });
      
      // Reset selections
      setBulkSelectedFeatures([]);
      setBulkSelectedTiers([]);
      
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast({
        title: "Error",
        description: "Some mappings could not be updated",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Tier Feature Mapping</CardTitle>
        <CardDescription>Manage which features are available to each subscription tier</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="mapping">
          <TabsList className="mb-6">
            <TabsTrigger value="mapping">Feature Mapping</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mapping">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-6">
                <div className="loader">Loading features...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Feature</th>
                      <th className="text-left p-2">Description</th>
                      {(selectedTier === 'all' ? tiers : [selectedTier]).map(tier => (
                        <th key={tier} className="text-center p-2 capitalize">{tier}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.map((feature) => (
                      <tr key={feature.id} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{feature.name}</td>
                        <td className="p-2 text-muted-foreground">{feature.description || '-'}</td>
                        {(selectedTier === 'all' ? tiers : [selectedTier]).map(tier => (
                          <td key={`${feature.id}-${tier}`} className="p-2 text-center">
                            <Switch
                              checked={isFeatureEnabledForTier(feature.name, tier)}
                              onCheckedChange={(isChecked) => handleTierToggle(feature.name, tier, isChecked)}
                              aria-label={`${feature.name} access for ${tier} tier`}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                    
                    {filteredFeatures.length === 0 && (
                      <tr>
                        <td colSpan={2 + (selectedTier === 'all' ? tiers.length : 1)} className="text-center py-6 text-muted-foreground">
                          No features match your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bulk">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Select Features</CardTitle>
                  <CardDescription>Choose features to modify</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      placeholder="Search features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="mb-4"
                    />
                    
                    {filteredFeatures.map(feature => (
                      <div key={feature.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`feature-${feature.id}`}
                          checked={bulkSelectedFeatures.includes(feature.name)}
                          onCheckedChange={() => handleBulkToggleFeature(feature.name)}
                        />
                        <Label 
                          htmlFor={`feature-${feature.id}`}
                          className="cursor-pointer"
                        >
                          {feature.name}
                        </Label>
                      </div>
                    ))}
                    
                    {filteredFeatures.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        No features match your search criteria.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Tiers</CardTitle>
                    <CardDescription>Choose subscription tiers to modify</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tiers.map(tier => (
                        <div key={tier} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`tier-${tier}`}
                            checked={bulkSelectedTiers.includes(tier)}
                            onCheckedChange={() => handleBulkToggleTier(tier)}
                          />
                          <Label 
                            htmlFor={`tier-${tier}`}
                            className="cursor-pointer capitalize"
                          >
                            {tier}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Action</CardTitle>
                    <CardDescription>Apply changes to selected features and tiers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label>Action</Label>
                        <Select value={bulkAction} onValueChange={(value) => setBulkAction(value as 'enable' | 'disable')}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="enable">Enable Features</SelectItem>
                            <SelectItem value="disable">Disable Features</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        onClick={handleBulkApply}
                        disabled={bulkSelectedFeatures.length === 0 || bulkSelectedTiers.length === 0}
                        className="w-full"
                      >
                        Apply to {bulkSelectedFeatures.length} feature(s) and {bulkSelectedTiers.length} tier(s)
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FeatureTierMappingTab;
