
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Zap } from 'lucide-react';

interface TriggerCondition {
  id: string;
  type: string;
  operator: string;
  value: string;
  isActive: boolean;
}

interface TriggerConditionerProps {
  onConditionsChange: (conditions: TriggerCondition[]) => void;
}

export function TriggerConditioner({ onConditionsChange }: TriggerConditionerProps) {
  const [conditions, setConditions] = useState<TriggerCondition[]>([]);
  const [newCondition, setNewCondition] = useState({
    type: '',
    operator: '',
    value: ''
  });

  const conditionTypes = [
    { value: 'visit_count', label: 'Visit Count' },
    { value: 'spending_amount', label: 'Spending Amount' },
    { value: 'time_since_join', label: 'Time Since Join' },
    { value: 'points_balance', label: 'Points Balance' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'between', label: 'Between' }
  ];

  const addCondition = () => {
    if (!newCondition.type || !newCondition.operator || !newCondition.value) return;

    const condition: TriggerCondition = {
      id: `condition-${Date.now()}`,
      type: newCondition.type,
      operator: newCondition.operator,
      value: newCondition.value,
      isActive: true
    };

    const updatedConditions = [...conditions, condition];
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
    
    setNewCondition({ type: '', operator: '', value: '' });
  };

  const removeCondition = (conditionId: string) => {
    const updatedConditions = conditions.filter(c => c.id !== conditionId);
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
  };

  const toggleCondition = (conditionId: string) => {
    const updatedConditions = conditions.map(c =>
      c.id === conditionId ? { ...c, isActive: !c.isActive } : c
    );
    setConditions(updatedConditions);
    onConditionsChange(updatedConditions);
  };

  const getConditionLabel = (condition: TriggerCondition) => {
    const type = conditionTypes.find(t => t.value === condition.type)?.label || condition.type;
    const operator = operators.find(o => o.value === condition.operator)?.label || condition.operator;
    return `${type} ${operator} ${condition.value}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Trigger Conditions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Condition Type</Label>
            <Select 
              value={newCondition.type} 
              onValueChange={(value) => setNewCondition(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {conditionTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Operator</Label>
            <Select 
              value={newCondition.operator} 
              onValueChange={(value) => setNewCondition(prev => ({ ...prev, operator: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {operators.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              value={newCondition.value}
              onChange={(e) => setNewCondition(prev => ({ ...prev, value: e.target.value }))}
              placeholder="Enter value"
            />
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button onClick={addCondition} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        {conditions.length > 0 && (
          <div className="space-y-3">
            <Label>Active Conditions</Label>
            {conditions.map((condition) => (
              <div key={condition.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={condition.isActive}
                    onCheckedChange={() => toggleCondition(condition.id)}
                  />
                  <Badge variant={condition.isActive ? 'default' : 'secondary'}>
                    {getConditionLabel(condition)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCondition(condition.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {conditions.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No trigger conditions set</p>
            <p className="text-sm">Add conditions to control when rewards are triggered</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
