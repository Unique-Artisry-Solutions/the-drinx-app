
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TriggerCondition {
  type: 'visit' | 'purchase' | 'checkin' | 'review' | 'referral';
  value: string;
  description: string;
}

interface TriggerConditionerProps {
  conditions: TriggerCondition[];
  onConditionsChange: (conditions: TriggerCondition[]) => void;
}

export const TriggerConditioner: React.FC<TriggerConditionerProps> = ({
  conditions,
  onConditionsChange
}) => {
  const [newCondition, setNewCondition] = useState<TriggerCondition>({
    type: 'visit',
    value: '',
    description: ''
  });

  const addCondition = () => {
    if (newCondition.value && newCondition.description) {
      onConditionsChange([...conditions, newCondition]);
      setNewCondition({ type: 'visit', value: '', description: '' });
    }
  };

  const removeCondition = (index: number) => {
    onConditionsChange(conditions.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Trigger Conditions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select
              value={newCondition.type}
              onValueChange={(value: TriggerCondition['type']) =>
                setNewCondition({ ...newCondition, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visit">Visit</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="checkin">Check-in</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Value"
              value={newCondition.value}
              onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
            />
            
            <Input
              placeholder="Description"
              value={newCondition.description}
              onChange={(e) => setNewCondition({ ...newCondition, description: e.target.value })}
            />
            
            <Button onClick={addCondition}>Add Condition</Button>
          </div>

          <div className="space-y-2">
            {conditions.map((condition, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <Badge variant="outline">{condition.type}</Badge>
                <span className="font-medium">{condition.value}</span>
                <span className="text-muted-foreground flex-1">{condition.description}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCondition(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {conditions.length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No trigger conditions configured. Add conditions above.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerConditioner;
