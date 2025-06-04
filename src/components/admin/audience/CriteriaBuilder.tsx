
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export interface CriteriaBuilderProps {
  onAddCriterion: (criterion: { type: string; operator: string; value: string }) => void;
}

export const CriteriaBuilder: React.FC<CriteriaBuilderProps> = ({ onAddCriterion }) => {
  const [criteria, setCriteria] = useState<Array<{ type: string; operator: string; value: string }>>([]);
  const [currentType, setCurrentType] = useState('');
  const [currentOperator, setCurrentOperator] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  const handleAddCriterion = () => {
    if (currentType && currentOperator && currentValue) {
      const newCriterion = { type: currentType, operator: currentOperator, value: currentValue };
      setCriteria([...criteria, newCriterion]);
      onAddCriterion(newCriterion);
      setCurrentType('');
      setCurrentOperator('');
      setCurrentValue('');
    }
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <Select value={currentType} onValueChange={setCurrentType}>
          <SelectTrigger>
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="age">Age</SelectItem>
            <SelectItem value="location">Location</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={currentOperator} onValueChange={setCurrentOperator}>
          <SelectTrigger>
            <SelectValue placeholder="Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
          </SelectContent>
        </Select>
        
        <Input
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          placeholder="Value"
        />
      </div>
      
      <Button onClick={handleAddCriterion} disabled={!currentType || !currentOperator || !currentValue}>
        Add Criterion
      </Button>
      
      <div className="flex flex-wrap gap-2">
        {criteria.map((criterion, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {criterion.type} {criterion.operator} {criterion.value}
            <Button
              size="sm"
              variant="ghost"
              className="h-4 w-4 p-0"
              onClick={() => removeCriterion(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CriteriaBuilder;
