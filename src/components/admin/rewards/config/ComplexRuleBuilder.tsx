
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Settings } from 'lucide-react';

interface Rule {
  id: string;
  name: string;
  conditions: Condition[];
  actions: Action[];
  priority: number;
  isActive: boolean;
}

interface Condition {
  id: string;
  type: string;
  field: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: string;
  value: string;
  parameters?: Record<string, any>;
}

interface ComplexRuleBuilderProps {
  onRuleSave: (rule: Rule) => void;
  existingRule?: Rule;
}

export function ComplexRuleBuilder({ onRuleSave, existingRule }: ComplexRuleBuilderProps) {
  const [rule, setRule] = useState<Rule>(existingRule || {
    id: `rule-${Date.now()}`,
    name: '',
    conditions: [],
    actions: [],
    priority: 1,
    isActive: true
  });

  const conditionTypes = [
    { value: 'user_action', label: 'User Action' },
    { value: 'time_based', label: 'Time Based' },
    { value: 'points_based', label: 'Points Based' },
    { value: 'tier_based', label: 'Tier Based' }
  ];

  const actionTypes = [
    { value: 'award_points', label: 'Award Points' },
    { value: 'upgrade_tier', label: 'Upgrade Tier' },
    { value: 'send_notification', label: 'Send Notification' },
    { value: 'apply_multiplier', label: 'Apply Multiplier' }
  ];

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      type: '',
      field: '',
      operator: 'equals',
      value: ''
    };
    setRule(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const addAction = () => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      type: '',
      value: ''
    };
    setRule(prev => ({
      ...prev,
      actions: [...prev.actions, newAction]
    }));
  };

  const removeCondition = (id: string) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  const removeAction = (id: string) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.filter(a => a.id !== id)
    }));
  };

  const updateCondition = (id: string, field: keyof Condition, value: string) => {
    setRule(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const updateAction = (id: string, field: keyof Action, value: string) => {
    setRule(prev => ({
      ...prev,
      actions: prev.actions.map(a => 
        a.id === id ? { ...a, [field]: value } : a
      )
    }));
  };

  const handleSave = () => {
    if (rule.name && rule.conditions.length > 0 && rule.actions.length > 0) {
      onRuleSave(rule);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Complex Rule Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={rule.name}
              onChange={(e) => setRule(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter rule name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={rule.priority.toString()} 
              onValueChange={(value) => setRule(prev => ({ ...prev, priority: parseInt(value) }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">High (1)</SelectItem>
                <SelectItem value="2">Medium (2)</SelectItem>
                <SelectItem value="3">Low (3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Conditions</h4>
            <Button onClick={addCondition} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Condition
            </Button>
          </div>
          
          {rule.conditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <Select 
                value={condition.type} 
                onValueChange={(value) => updateCondition(condition.id, 'type', value)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Field"
                value={condition.field}
                onChange={(e) => updateCondition(condition.id, 'field', e.target.value)}
                className="flex-1"
              />
              
              <Input
                placeholder="Value"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                className="flex-1"
              />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeCondition(condition.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Actions</h4>
            <Button onClick={addAction} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Action
            </Button>
          </div>
          
          {rule.actions.map((action) => (
            <div key={action.id} className="flex items-center gap-2 p-3 border rounded-lg">
              <Select 
                value={action.type} 
                onValueChange={(value) => updateAction(action.id, 'type', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  {actionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                placeholder="Value"
                value={action.value}
                onChange={(e) => updateAction(action.id, 'value', e.target.value)}
                className="flex-1"
              />
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => removeAction(action.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Badge variant={rule.isActive ? "default" : "secondary"}>
            {rule.isActive ? "Active" : "Inactive"}
          </Badge>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setRule(prev => ({ ...prev, isActive: !prev.isActive }))}
            >
              {rule.isActive ? "Deactivate" : "Activate"}
            </Button>
            <Button onClick={handleSave}>Save Rule</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
