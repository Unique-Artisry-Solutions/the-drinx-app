
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Wand, Plus, Trash, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface Condition {
  id: string;
  type: string;
  operator: string;
  value: string;
  conjunction?: 'and' | 'or';
}

interface Action {
  id: string;
  type: string;
  value: string;
}

export interface ComplexRuleBuilderProps {
  onSave?: (rule: { name: string; description: string; conditions: Condition[]; actions: Action[] }) => void;
}

export function ComplexRuleBuilder({ onSave }: ComplexRuleBuilderProps) {
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', type: 'total_spend', operator: 'greater_than', value: '100' }
  ]);
  const [actions, setActions] = useState<Action[]>([
    { id: '1', type: 'award_points', value: '500' }
  ]);

  const conditionTypes = [
    { value: 'total_spend', label: 'User Total Spend' },
    { value: 'visit_count', label: 'Number of Visits' },
    { value: 'days_since_last_visit', label: 'Days Since Last Visit' },
    { value: 'purchase_category', label: 'Purchase Category' },
    { value: 'user_tier', label: 'User Tier' },
    { value: 'time_of_day', label: 'Time of Day' },
    { value: 'day_of_week', label: 'Day of Week' }
  ];

  const actionTypes = [
    { value: 'award_points', label: 'Award Points' },
    { value: 'multiply_points', label: 'Multiply Points' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'create_offer', label: 'Create Special Offer' },
    { value: 'upgrade_tier', label: 'Upgrade User Tier' }
  ];

  const operators = [
    { value: 'equal_to', label: 'Equal to' },
    { value: 'not_equal_to', label: 'Not equal to' },
    { value: 'greater_than', label: 'Greater than' },
    { value: 'less_than', label: 'Less than' },
    { value: 'contains', label: 'Contains' },
    { value: 'in_list', label: 'In list' }
  ];

  const addCondition = () => {
    const newCondition = {
      id: Date.now().toString(),
      type: 'total_spend',
      operator: 'greater_than',
      value: '',
      conjunction: 'and' as const
    };
    setConditions([...conditions, newCondition]);
  };

  const addAction = () => {
    const newAction = {
      id: Date.now().toString(),
      type: 'award_points',
      value: ''
    };
    setActions([...actions, newAction]);
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setConditions(conditions.map(condition => 
      condition.id === id ? { ...condition, [field]: value } : condition
    ));
  };

  const updateAction = (id: string, field: keyof Action, value: string) => {
    setActions(actions.map(action => 
      action.id === id ? { ...action, [field]: value } : action
    ));
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(condition => condition.id !== id));
    }
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter(action => action.id !== id));
    }
  };

  const handleSave = () => {
    if (onSave && ruleName) {
      onSave({
        name: ruleName,
        description: ruleDescription,
        conditions,
        actions
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand className="h-5 w-5 text-primary" />
          Complex Rule Builder
        </CardTitle>
        <CardDescription>
          Create sophisticated rules with multiple conditions and actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="rule-name">Rule Name</Label>
              <Input 
                id="rule-name" 
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
                placeholder="Enter a descriptive name for this rule"
              />
            </div>
            
            <div>
              <Label htmlFor="rule-description">Description</Label>
              <Textarea 
                id="rule-description" 
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Explain what this rule does and when it should trigger"
                rows={2}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">IF</h3>
            <div className="space-y-4">
              {conditions.map((condition, index) => (
                <div key={condition.id} className="grid gap-3 border p-3 rounded-md bg-muted/20">
                  {index > 0 && (
                    <div>
                      <Select
                        value={condition.conjunction}
                        onValueChange={(value) => updateCondition(condition.id, 'conjunction', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="and">AND</SelectItem>
                          <SelectItem value="or">OR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                      <Select
                        value={condition.type}
                        onValueChange={(value) => updateCondition(condition.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {conditionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-4">
                      <Select
                        value={condition.operator}
                        onValueChange={(value) => updateCondition(condition.id, 'operator', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map(op => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-3">
                      <Input 
                        value={condition.value}
                        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                        placeholder="Value"
                      />
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeCondition(condition.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addCondition}
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Condition
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-sm font-medium mb-2">THEN</h3>
            <div className="space-y-4">
              {actions.map((action, index) => (
                <div key={action.id} className="grid gap-3 border p-3 rounded-md bg-muted/20">
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-5">
                      <Select
                        value={action.type}
                        onValueChange={(value) => updateAction(action.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="col-span-6">
                      <Input 
                        value={action.value}
                        onChange={(e) => updateAction(action.id, 'value', e.target.value)}
                        placeholder={action.type === 'award_points' ? 
                          'Number of points' : 
                          action.type === 'send_notification' ? 
                          'Notification message' : 'Value'}
                      />
                    </div>
                    
                    <div className="col-span-1 flex items-center justify-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeAction(action.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                onClick={addAction}
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add Action
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button
              onClick={handleSave}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              Save Rule
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
