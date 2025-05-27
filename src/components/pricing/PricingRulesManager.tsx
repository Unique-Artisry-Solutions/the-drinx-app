
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePricingRules } from '@/hooks/promotional/usePricingRules';
import { PricingRule } from '@/types/promotional/PricingTypes';
import { Plus, Edit, Trash } from 'lucide-react';

interface PricingRulesManagerProps {
  promoterId: string;
  onCreateRule?: () => void;
  onEditRule?: (rule: PricingRule) => void;
}

export const PricingRulesManager: React.FC<PricingRulesManagerProps> = ({
  promoterId,
  onCreateRule,
  onEditRule
}) => {
  const { rules, isLoading, updateRule } = usePricingRules(promoterId);
  const [updatingRules, setUpdatingRules] = useState<Set<string>>(new Set());

  const handleToggleRule = async (rule: PricingRule) => {
    const ruleId = rule.id;
    setUpdatingRules(prev => new Set(prev).add(ruleId));
    
    try {
      await updateRule({
        id: ruleId,
        updates: { is_active: !rule.is_active }
      });
    } catch (error) {
      console.error('Error updating rule:', error);
    } finally {
      setUpdatingRules(prev => {
        const next = new Set(prev);
        next.delete(ruleId);
        return next;
      });
    }
  };

  const getRuleTypeColor = (type: string) => {
    switch (type) {
      case 'time_based': return 'bg-blue-100 text-blue-800';
      case 'demand_based': return 'bg-green-100 text-green-800';
      case 'inventory_based': return 'bg-orange-100 text-orange-800';
      case 'combined': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdjustmentDisplay = (rule: PricingRule) => {
    const sign = rule.adjustment_value > 0 ? '+' : '';
    const symbol = rule.price_adjustment_type === 'percentage' ? '%' : '$';
    return `${sign}${rule.adjustment_value}${symbol}`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pricing Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing Rules</CardTitle>
        <Button onClick={onCreateRule} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Rule
        </Button>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No pricing rules configured</p>
            <Button onClick={onCreateRule} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Rule
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{rule.rule_name}</h4>
                      <Badge className={getRuleTypeColor(rule.rule_type)}>
                        {rule.rule_type.replace('_', ' ')}
                      </Badge>
                      <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Priority: {rule.priority} • Adjustment: {getAdjustmentDisplay(rule)}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={() => handleToggleRule(rule)}
                      disabled={updatingRules.has(rule.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditRule?.(rule)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rule Details */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>
                    <strong>Effective:</strong> {new Date(rule.effective_from).toLocaleDateString()}
                    {rule.effective_until && ` - ${new Date(rule.effective_until).toLocaleDateString()}`}
                  </div>
                  
                  {rule.min_price && (
                    <div><strong>Min Price:</strong> ${rule.min_price}</div>
                  )}
                  
                  {rule.max_price && (
                    <div><strong>Max Price:</strong> ${rule.max_price}</div>
                  )}
                  
                  {Object.keys(rule.conditions).length > 0 && (
                    <div>
                      <strong>Conditions:</strong> {Object.keys(rule.conditions).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
