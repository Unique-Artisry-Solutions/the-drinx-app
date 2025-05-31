
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

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

export function CriteriaBuilder({ criteria, onCriteriaChange }: CriteriaBuilderProps) {
  const [availableFields] = useState([
    { value: 'age', label: 'Age' },
    { value: 'location', label: 'Location' },
    { value: 'points', label: 'Points Balance' },
    { value: 'tier', label: 'Tier Level' },
    { value: 'last_visit', label: 'Last Visit' }
  ]);

  const [operators] = useState([
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' }
  ]);

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: `criterion-${Date.now()}`,
      field: '',
      operator: '',
      value: ''
    };
    onCriteriaChange([...criteria, newCriterion]);
  };

  const removeCriterion = (id: string) => {
    onCriteriaChange(criteria.filter(c => c.id !== id));
  };

  const updateCriterion = (id: string, field: keyof Criterion, value: string) => {
    onCriteriaChange(criteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Audience Criteria</h3>
          <Button onClick={addCriterion} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Criterion
          </Button>
        </div>

        {criteria.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No criteria defined. Add criteria to segment your audience.
          </p>
        ) : (
          <div className="space-y-3">
            {criteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Select 
                  value={criterion.field} 
                  onValueChange={(value) => updateCriterion(criterion.id, 'field', value)}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((field) => (
                      <SelectItem key={field.value} value={field.value}>
                        {field.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={criterion.operator} 
                  onValueChange={(value) => updateCriterion(criterion.id, 'operator', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Operator" />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Value"
                  value={criterion.value}
                  onChange={(e) => updateCriterion(criterion.id, 'value', e.target.value)}
                  className="flex-1"
                />

                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => removeCriterion(criterion.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
