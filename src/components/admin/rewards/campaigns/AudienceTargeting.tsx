import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Users, Filter } from 'lucide-react';

interface AudienceTargetingProps {
  targeting: {
    type: string;
    segments: string[];
    criteria: {
      age?: { min?: number; max?: number };
      location?: string;
      interests?: string[];
    };
  };
  onTargetingChange: (targeting: any) => void;
}

const AudienceTargeting = ({ targeting, onTargetingChange }: AudienceTargetingProps) => {
  const [selectedType, setSelectedType] = useState(targeting.type || 'all');
  const [selectedSegments, setSelectedSegments] = useState(targeting.segments || []);
  const [ageRange, setAgeRange] = useState({
    min: targeting.criteria.age?.min || 18,
    max: targeting.criteria.age?.max || 65,
  });
  const [location, setLocation] = useState(targeting.criteria.location || '');
  const [interests, setInterests] = useState(targeting.criteria.interests || []);
  const [newInterest, setNewInterest] = useState('');

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    onTargetingChange({ ...targeting, type });
  };

  const handleSegmentToggle = (segment: string) => {
    const isSelected = selectedSegments.includes(segment);
    const updatedSegments = isSelected
      ? selectedSegments.filter((s) => s !== segment)
      : [...selectedSegments, segment];

    setSelectedSegments(updatedSegments);
    onTargetingChange({ ...targeting, segments: updatedSegments });
  };

  const handleAgeChange = (field: 'min' | 'max', value: number) => {
    const updatedAge = { ...ageRange, [field]: value };
    setAgeRange(updatedAge);
    onTargetingChange({
      ...targeting,
      criteria: { ...targeting.criteria, age: updatedAge },
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLocation = e.target.value;
    setLocation(newLocation);
    onTargetingChange({
      ...targeting,
      criteria: { ...targeting.criteria, location: newLocation },
    });
  };

  const handleAddInterest = () => {
    if (newInterest && !interests.includes(newInterest)) {
      const updatedInterests = [...interests, newInterest];
      setInterests(updatedInterests);
      onTargetingChange({
        ...targeting,
        criteria: { ...targeting.criteria, interests: updatedInterests },
      });
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    const updatedInterests = interests.filter((interest) => interest !== interestToRemove);
    setInterests(updatedInterests);
    onTargetingChange({
      ...targeting,
      criteria: { ...targeting.criteria, interests: updatedInterests },
    });
  };

  const availableSegments = ['Premium Customers', 'New Users', 'Inactive Users'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Targeting</CardTitle>
        <CardDescription>
          Define the audience for this campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Targeting Type</h4>
          <div className="flex space-x-4 mt-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('all')}
            >
              All Users
            </Button>
            <Button
              variant={selectedType === 'segments' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('segments')}
            >
              Specific Segments
            </Button>
            <Button
              variant={selectedType === 'criteria' ? 'default' : 'outline'}
              onClick={() => handleTypeChange('criteria')}
            >
              Custom Criteria
            </Button>
          </div>
        </div>

        {selectedType === 'segments' && (
          <div>
            <h4 className="text-sm font-medium">Select Segments</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableSegments.map((segment) => (
                <Badge
                  key={segment}
                  variant={selectedSegments.includes(segment) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleSegmentToggle(segment)}
                >
                  {segment}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {selectedType === 'criteria' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Age Range</h4>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  <Label htmlFor="minAge">Min</Label>
                  <Input
                    type="number"
                    id="minAge"
                    value={ageRange.min}
                    onChange={(e) => handleAgeChange('min', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
                <div className="flex items-center space-x-1">
                  <Label htmlFor="maxAge">Max</Label>
                  <Input
                    type="number"
                    id="maxAge"
                    value={ageRange.max}
                    onChange={(e) => handleAgeChange('max', parseInt(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Location</h4>
              <Input
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={handleLocationChange}
                className="mt-2"
              />
            </div>

            <div>
              <h4 className="text-sm font-medium">Interests</h4>
              <div className="flex items-center space-x-2 mt-2">
                <Input
                  type="text"
                  placeholder="Add interest"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                />
                <Button size="sm" onClick={handleAddInterest}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="gap-x-2 items-center">
                    {interest}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-1"
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AudienceTargeting;
