import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';

interface Criteria {
  field: string;
  operator: string;
  value: string;
}

interface CriteriaBuilderProps {
  criteria: Criteria[];
  onCriteriaChange: (criteria: Criteria[]) => void;
}

const CriteriaBuilder = ({ criteria, onCriteriaChange }: CriteriaBuilderProps) => {
  const [newCriteria, setNewCriteria] = useState<Criteria>({ field: '', operator: '', value: '' });

  const availableFields = [
    { value: 'age', label: 'Age' },
    { value: 'location', label: 'Location' },
    { value: 'purchaseHistory', label: 'Purchase History' },
    { value: 'engagementScore', label: 'Engagement Score' }
  ];

  const availableOperators = {
    age: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '=', label: 'Equals' }
    ],
    location: [
      { value: 'is', label: 'Is' },
      { value: 'isNot', label: 'Is not' }
    ],
    purchaseHistory: [
      { value: 'contains', label: 'Contains' },
      { value: 'notContains', label: 'Not contains' }
    ],
    engagementScore: [
      { value: '>', label: 'Greater than' },
      { value: '<', label: 'Less than' },
      { value: '=', label: 'Equals' }
    ]
  };

  const handleCriteriaChange = (index: number, field: string, value: string) => {
    const updatedCriteria = [...criteria];
    updatedCriteria[index] = { ...updatedCriteria[index], [field]: value };
    onCriteriaChange(updatedCriteria);
  };

  const handleAddCriteria = () => {
    onCriteriaChange([...criteria, newCriteria]);
    setNewCriteria({ field: '', operator: '', value: '' });
  };

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteria = [...criteria];
    updatedCriteria.splice(index, 1);
    onCriteriaChange(updatedCriteria);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Define Audience Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Select
                value={criterion.field}
                onValueChange={(value) => handleCriteriaChange(index, 'field', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Field" />
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
                onValueChange={(value) => handleCriteriaChange(index, 'operator', value)}
                disabled={!criterion.field}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Operator" />
                </SelectTrigger>
                <SelectContent>
                  {criterion.field && availableOperators[criterion.field as keyof typeof availableOperators].map((operator) => (
                    <SelectItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="Enter Value"
                value={criterion.value}
                onChange={(e) => handleCriteriaChange(index, 'value', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCriteria(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center space-x-4">
            <Select
              value={newCriteria.field}
              onValueChange={(value) => setNewCriteria({ ...newCriteria, field: value })}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Field" />
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
              value={newCriteria.operator}
              onValueChange={(value) => setNewCriteria({ ...newCriteria, operator: value })}
              disabled={!newCriteria.field}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Operator" />
              </SelectTrigger>
              <SelectContent>
                {newCriteria.field && availableOperators[newCriteria.field as keyof typeof availableOperators].map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="text"
              placeholder="Enter Value"
              value={newCriteria.value}
              onChange={(e) => setNewCriteria({ ...newCriteria, value: e.target.value })}
            />
            <Button
              type="button"
              onClick={handleAddCriteria}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Criteria
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CriteriaBuilder;
