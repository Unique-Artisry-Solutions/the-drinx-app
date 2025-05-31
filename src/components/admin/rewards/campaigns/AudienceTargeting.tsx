import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AudienceTargetingProps {
  selectedAudiences: string[];
  onAudienceChange: (audiences: string[]) => void;
}

export function AudienceTargeting({ selectedAudiences, onAudienceChange }: AudienceTargetingProps) {
  const [targetingType, setTargetingType] = useState('segments');

  // Mock audience data - preserved as placeholder
  const audienceSegments = [
    { id: 'vip', name: 'VIP Members', size: 1200, description: 'High-value customers' },
    { id: 'new', name: 'New Users', size: 3400, description: 'Recently joined users' },
    { id: 'loyal', name: 'Loyal Customers', size: 856, description: 'Frequent visitors' }
  ];

  const handleAudienceToggle = (audienceId: string) => {
    const updated = selectedAudiences.includes(audienceId)
      ? selectedAudiences.filter(id => id !== audienceId)
      : [...selectedAudiences, audienceId];
    onAudienceChange(updated);
  };

  const getTotalReach = () => {
    return audienceSegments
      .filter(segment => selectedAudiences.includes(segment.id))
      .reduce((total, segment) => total + segment.size, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Targeting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Targeting Method</Label>
          <Select value={targetingType} onValueChange={setTargetingType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="segments">Audience Segments</SelectItem>
              <SelectItem value="criteria">Custom Criteria</SelectItem>
              <SelectItem value="all">All Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {targetingType === 'segments' && (
          <div className="space-y-4">
            <Label>Select Audience Segments</Label>
            {audienceSegments.map((segment) => (
              <div key={segment.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={segment.id}
                  checked={selectedAudiences.includes(segment.id)}
                  onCheckedChange={() => handleAudienceToggle(segment.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={segment.id} className="font-medium">
                    {segment.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">{segment.description}</p>
                  <Badge variant="outline" className="mt-1">
                    {segment.size.toLocaleString()} users
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedAudiences.length > 0 && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Estimated Reach</span>
              <Badge variant="default">
                {getTotalReach().toLocaleString()} users
              </Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onAudienceChange([])}>
            Clear Selection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onAudienceChange(audienceSegments.map(s => s.id))}
          >
            Select All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
