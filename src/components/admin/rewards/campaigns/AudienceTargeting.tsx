
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AudienceFilter {
  type: 'tier' | 'pointsRange' | 'activity' | 'joinDate' | 'demographics' | 'all';
  value: string;
  description: string;
}

interface AudienceTargetingProps {
  filters: AudienceFilter[];
  onFiltersChange: (filters: AudienceFilter[]) => void;
}

export const AudienceTargeting: React.FC<AudienceTargetingProps> = ({
  filters,
  onFiltersChange
}) => {
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [pointsRange, setPointsRange] = useState({ min: '', max: '' });

  const predefinedTiers = ['Bronze', 'Silver', 'Gold', 'Platinum'];

  const handleTierChange = (tier: string, checked: boolean) => {
    if (checked) {
      setSelectedTiers([...selectedTiers, tier]);
    } else {
      setSelectedTiers(selectedTiers.filter(t => t !== tier));
    }
  };

  const addTierFilter = () => {
    if (selectedTiers.length > 0) {
      const newFilter: AudienceFilter = {
        type: 'tier',
        value: selectedTiers.join(','),
        description: `Users in ${selectedTiers.join(', ')} tiers`
      };
      onFiltersChange([...filters, newFilter]);
      setSelectedTiers([]);
    }
  };

  const addPointsFilter = () => {
    if (pointsRange.min || pointsRange.max) {
      const newFilter: AudienceFilter = {
        type: 'pointsRange',
        value: `${pointsRange.min}-${pointsRange.max}`,
        description: `Users with ${pointsRange.min || '0'}-${pointsRange.max || '∞'} points`
      };
      onFiltersChange([...filters, newFilter]);
      setPointsRange({ min: '', max: '' });
    }
  };

  const removeFilter = (index: number) => {
    onFiltersChange(filters.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Targeting</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Tier Selection */}
          <div>
            <h4 className="font-medium mb-3">Target by Tier</h4>
            <div className="grid grid-cols-2 gap-2">
              {predefinedTiers.map(tier => (
                <div key={tier} className="flex items-center space-x-2">
                  <Checkbox
                    id={tier}
                    checked={selectedTiers.includes(tier)}
                    onCheckedChange={(checked) => handleTierChange(tier, !!checked)}
                  />
                  <label htmlFor={tier} className="text-sm">{tier}</label>
                </div>
              ))}
            </div>
            <Button
              onClick={addTierFilter}
              disabled={selectedTiers.length === 0}
              className="mt-2"
              size="sm"
            >
              Add Tier Filter
            </Button>
          </div>

          {/* Points Range */}
          <div>
            <h4 className="font-medium mb-3">Target by Points Range</h4>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min points"
                value={pointsRange.min}
                onChange={(e) => setPointsRange({ ...pointsRange, min: e.target.value })}
              />
              <span>to</span>
              <Input
                type="number"
                placeholder="Max points"
                value={pointsRange.max}
                onChange={(e) => setPointsRange({ ...pointsRange, max: e.target.value })}
              />
              <Button
                onClick={addPointsFilter}
                disabled={!pointsRange.min && !pointsRange.max}
                size="sm"
              >
                Add Points Filter
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div>
            <h4 className="font-medium mb-3">Active Filters</h4>
            <div className="space-y-2">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{filter.type}</Badge>
                    <span className="text-sm">{filter.description}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFilter(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
            {filters.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No filters applied. Campaign will target all users.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceTargeting;
