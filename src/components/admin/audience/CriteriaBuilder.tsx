
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

interface Criterion {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface CriteriaBuilderProps {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
}

const CriteriaBuilder = ({ criteria, onCriteriaChange }: CriteriaBuilderProps) => {
  const [localCriteria, setLocalCriteria] = useState<Criterion[]>(criteria);

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: Date.now().toString(),
      field: '',
      operator: 'equals',
      value: ''
    };
    const updated = [...localCriteria, newCriterion];
    setLocalCriteria(updated);
    onCriteriaChange(updated);
  };

  const removeCriterion = (id: string) => {
    const updated = localCriteria.filter(c => c.id !== id);
    setLocalCriteria(updated);
    onCriteriaChange(updated);
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string) => {
    const updated = localCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
    setLocalCriteria(updated);
    onCriteriaChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segment Criteria</CardTitle>
        <CardDescription>
          Define the conditions that determine who belongs to this segment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {localCriteria.map((criterion) => (
          <div key={criterion.id} className="flex items-center space-x-2 p-4 border rounded">
            <div className="flex-1">
              <Label className="text-xs">Field</Label>
              <Select
                value={criterion.field}
                onValueChange={(value) => updateCriterion(criterion.id, 'field', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age">Age</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="spending">Total Spending</SelectItem>
                  <SelectItem value="visits">Visit Count</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-xs">Operator</Label>
              <Select
                value={criterion.operator}
                onValueChange={(value) => updateCriterion(criterion.id, 'operator', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Equals</SelectItem>
                  <SelectItem value="greater_than">Greater than</SelectItem>
                  <SelectItem value="less_than">Less than</SelectItem>
                  <SelectItem value="contains">Contains</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="text-xs">Value</Label>
              <Input
                value={criterion.value}
                onChange={(e) => updateCriterion(criterion.id, 'value', e.target.value)}
                placeholder="Enter value"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCriterion(criterion.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}

        <Button variant="outline" onClick={addCriterion} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Criterion
        </Button>
      </CardContent>
    </Card>
  );
};

export default CriteriaBuilder;
