
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Users, Target, Filter } from 'lucide-react';

interface AudienceTargetingProps {
  onTargetingChange?: (targeting: any) => void;
}

const AudienceTargeting = ({ onTargetingChange }: AudienceTargetingProps) => {
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [targetingRules, setTargetingRules] = useState({
    minAge: '',
    maxAge: '',
    location: '',
    tier: ''
  });

  const availableSegments = [
    { id: 'high-value', name: 'High Value Customers', size: 1250 },
    { id: 'loyal', name: 'Loyal Customers', size: 890 },
    { id: 'new-users', name: 'New Users', size: 2100 },
    { id: 'inactive', name: 'Inactive Users', size: 540 }
  ];

  const handleSegmentToggle = (segmentId: string) => {
    const updated = selectedSegments.includes(segmentId)
      ? selectedSegments.filter(id => id !== segmentId)
      : [...selectedSegments, segmentId];
    
    setSelectedSegments(updated);
    onTargetingChange?.({ segments: updated, rules: targetingRules });
  };

  const handleRuleChange = (key: string, value: string) => {
    const updated = { ...targetingRules, [key]: value };
    setTargetingRules(updated);
    onTargetingChange?.({ segments: selectedSegments, rules: updated });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Audience Targeting
          </CardTitle>
          <CardDescription>
            Define which audience segments this campaign should target
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-base font-medium">Select Audience Segments</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {availableSegments.map((segment) => (
                <div key={segment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={segment.id}
                    checked={selectedSegments.includes(segment.id)}
                    onCheckedChange={() => handleSegmentToggle(segment.id)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={segment.id} className="font-medium">
                      {segment.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {segment.size.toLocaleString()} users
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <Label className="text-base font-medium">Additional Targeting Rules</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="tier">Tier Level</Label>
                <Select 
                  value={targetingRules.tier} 
                  onValueChange={(value) => handleRuleChange('tier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tiers</SelectItem>
                    <SelectItem value="bronze">Bronze</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Select 
                  value={targetingRules.location} 
                  onValueChange={(value) => handleRuleChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedSegments.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Estimated Reach</span>
                <Badge>
                  <Users className="h-3 w-3 mr-1" />
                  {availableSegments
                    .filter(s => selectedSegments.includes(s.id))
                    .reduce((sum, s) => sum + s.size, 0)
                    .toLocaleString()} users
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on selected segments and targeting rules
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Preview Audience
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceTargeting;
