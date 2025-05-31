import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';

interface Criterion {
  id: string;
  type: 'demographic' | 'behavior' | 'engagement' | 'transaction';
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in_range';
  value: string | number | string[];
}

interface CriteriaBuilderProps {
  criteria: Criterion[];
  onCriteriaChange: (criteria: Criterion[]) => void;
}

export function CriteriaBuilder({ criteria, onCriteriaChange }: CriteriaBuilderProps) {
  const [editingCriterion, setEditingCriterion] = useState<string | null>(null);

  // Field options for different criterion types - preserved as placeholder
  const fieldOptions = {
    demographic: ['age', 'location', 'gender', 'occupation'],
    behavior: ['visit_frequency', 'last_visit', 'favorite_establishments', 'check_ins'],
    engagement: ['app_opens', 'recipe_saves', 'social_shares', 'review_count'],
    transaction: ['total_spent', 'average_order', 'purchase_frequency', 'preferred_payment']
  };

  const operatorOptions = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Not Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' },
    { value: 'in_range', label: 'In Range' }
  ];

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: `criterion_${Date.now()}`,
      type: 'demographic',
      field: 'age',
      operator: 'equals',
      value: ''
    };
    onCriteriaChange([...criteria, newCriterion]);
    setEditingCriterion(newCriterion.id);
  };

  const updateCriterion = (id: string, updates: Partial<Criterion>) => {
    const updatedCriteria = criteria.map(criterion =>
      criterion.id === id ? { ...criterion, ...updates } : criterion
    );
    onCriteriaChange(updatedCriteria);
  };

  const removeCriterion = (id: string) => {
    const filteredCriteria = criteria.filter(criterion => criterion.id !== id);
    onCriteriaChange(filteredCriteria);
  };

  const formatCriterionDisplay = (criterion: Criterion) => {
    return `${criterion.field} ${criterion.operator.replace('_', ' ')} ${criterion.value}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Audience Criteria</h3>
        <Button onClick={addCriterion} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Criterion
        </Button>
      </div>

      <div className="space-y-3">
        {criteria.map((criterion) => (
          <Card key={criterion.id} className="p-4">
            {editingCriterion === criterion.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    value={criterion.type}
                    onValueChange={(value: Criterion['type']) => updateCriterion(criterion.id, { type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demographic">Demographic</SelectItem>
                      <SelectItem value="behavior">Behavior</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="transaction">Transaction</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={criterion.field}
                    onValueChange={(value) => updateCriterion(criterion.id, { field: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions[criterion.type].map((field) => (
                        <SelectItem key={field} value={field}>
                          {field.replace('_', ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={criterion.operator}
                    onValueChange={(value: Criterion['operator']) => updateCriterion(criterion.id, { operator: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {operatorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={criterion.value.toString()}
                    onChange={(e) => updateCriterion(criterion.id, { value: e.target.value })}
                    placeholder="Enter value"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingCriterion(null)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCriterion(criterion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{criterion.type}</Badge>
                  <span className="text-sm font-medium">
                    {formatCriterionDisplay(criterion)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingCriterion(criterion.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCriterion(criterion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {criteria.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No criteria defined. Add criteria to build your audience segment.</p>
        </Card>
      )}
    </div>
  );
}
