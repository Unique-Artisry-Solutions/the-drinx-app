
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Rules, ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Rule {
  id: string;
  name: string;
  conditions: Condition[];
  actions: Action[];
  isActive: boolean;
}

interface Condition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Action {
  id: string;
  type: string;
  value: string;
}

interface ComplexRuleBuilderProps {
  onRulesChange: (rules: Rule[]) => void;
}

export function ComplexRuleBuilder({ onRulesChange }: ComplexRuleBuilderProps) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [openRule, setOpenRule] = useState<string | null>(null);

  const conditionFields = [
    { value: 'user_tier', label: 'User Tier' },
    { value: 'visit_count', label: 'Visit Count' },
    { value: 'spending_total', label: 'Total Spending' },
    { value: 'points_balance', label: 'Points Balance' },
    { value: 'last_visit', label: 'Last Visit' }
  ];

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'greater_than', label: 'Greater Than' },
    { value: 'less_than', label: 'Less Than' },
    { value: 'contains', label: 'Contains' }
  ];

  const actionTypes = [
    { value: 'award_points', label: 'Award Points' },
    { value: 'apply_multiplier', label: 'Apply Multiplier' },
    { value: 'grant_tier', label: 'Grant Tier' },
    { value: 'send_notification', label: 'Send Notification' }
  ];

  const createNewRule = () => {
    const newRule: Rule = {
      id: `rule-${Date.now()}`,
      name: 'New Rule',
      conditions: [],
      actions: [],
      isActive: true
    };
    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    setOpenRule(newRule.id);
    onRulesChange(updatedRules);
  };

  const updateRule = (ruleId: string, updates: Partial<Rule>) => {
    const updatedRules = rules.map(rule =>
      rule.id === ruleId ? { ...rule, ...updates } : rule
    );
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const deleteRule = (ruleId: string) => {
    const updatedRules = rules.filter(rule => rule.id !== ruleId);
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const addCondition = (ruleId: string) => {
    const newCondition: Condition = {
      id: `condition-${Date.now()}`,
      field: '',
      operator: '',
      value: ''
    };
    
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: [...rule.conditions, newCondition]
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const updateCondition = (ruleId: string, conditionId: string, field: keyof Condition, value: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.map(condition =>
            condition.id === conditionId
              ? { ...condition, [field]: value }
              : condition
          )
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const removeCondition = (ruleId: string, conditionId: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.filter(condition => condition.id !== conditionId)
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const addAction = (ruleId: string) => {
    const newAction: Action = {
      id: `action-${Date.now()}`,
      type: '',
      value: ''
    };
    
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: [...rule.actions, newAction]
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const updateAction = (ruleId: string, actionId: string, field: keyof Action, value: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.map(action =>
            action.id === actionId
              ? { ...action, [field]: value }
              : action
          )
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  const removeAction = (ruleId: string, actionId: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          actions: rule.actions.filter(action => action.id !== actionId)
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    onRulesChange(updatedRules);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Rules className="h-5 w-5" />
          Complex Rule Builder
        </CardTitle>
        <Button onClick={createNewRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {rules.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <Rules className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No rules configured</p>
            <p className="text-sm">Create rules to automate reward logic</p>
          </div>
        ) : (
          rules.map((rule) => (
            <Collapsible
              key={rule.id}
              open={openRule === rule.id}
              onOpenChange={(isOpen) => setOpenRule(isOpen ? rule.id : null)}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ChevronDown className="h-4 w-4" />
                        <span className="font-medium">{rule.name}</span>
                        <Badge variant={rule.isActive ? 'default' : 'secondary'}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{rule.conditions.length} conditions</span>
                        <span>•</span>
                        <span>{rule.actions.length} actions</span>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Rule Name</Label>
                      <Input
                        value={rule.name}
                        onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                        placeholder="Enter rule name"
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Conditions</Label>
                        <Button size="sm" onClick={() => addCondition(rule.id)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Condition
                        </Button>
                      </div>
                      {rule.conditions.map((condition) => (
                        <div key={condition.id} className="grid grid-cols-4 gap-2 items-end p-2 border rounded">
                          <Select 
                            value={condition.field} 
                            onValueChange={(value) => updateCondition(rule.id, condition.id, 'field', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                              {conditionFields.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Select 
                            value={condition.operator} 
                            onValueChange={(value) => updateCondition(rule.id, condition.id, 'operator', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              {operators.map((operator) => (
                                <SelectItem key={operator.value} value={operator.value}>
                                  {operator.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={condition.value}
                            onChange={(e) => updateCondition(rule.id, condition.id, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeCondition(rule.id, condition.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Actions</Label>
                        <Button size="sm" onClick={() => addAction(rule.id)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Action
                        </Button>
                      </div>
                      {rule.actions.map((_action, _index) => (
                        <div key={_action.id} className="grid grid-cols-3 gap-2 items-end p-2 border rounded">
                          <Select 
                            value={_action.type} 
                            onValueChange={(value) => updateAction(rule.id, _action.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Action" />
                            </SelectTrigger>
                            <SelectContent>
                              {actionTypes.map((actionType) => (
                                <SelectItem key={actionType.value} value={actionType.value}>
                                  {actionType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={_action.value}
                            onChange={(e) => updateAction(rule.id, _action.id, 'value', e.target.value)}
                            placeholder="Value"
                          />
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeAction(rule.id, _action.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => updateRule(rule.id, { isActive: !rule.isActive })}
                      >
                        {rule.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => deleteRule(rule.id)}
                      >
                        Delete Rule
                      </Button>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </CardContent>
    </Card>
  );
}
