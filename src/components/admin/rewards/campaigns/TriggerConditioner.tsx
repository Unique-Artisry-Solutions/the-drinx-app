
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, X, Zap, Clock } from 'lucide-react';
import { TriggerCondition } from '@/lib/rewards/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface TriggerConditionerProps {
  triggers: TriggerCondition[];
  onChange: (triggers: TriggerCondition[]) => void;
}

export const TriggerConditioner = ({ triggers, onChange }: TriggerConditionerProps) => {
  const [triggerType, setTriggerType] = useState('schedule');
  const [triggerValue, setTriggerValue] = useState('');
  
  const addTrigger = () => {
    if (triggerType !== 'manual' && !triggerValue.trim()) return;
    
    let description = '';
    const value = triggerType === 'manual' ? 'manual' : triggerValue;
    
    switch (triggerType) {
      case 'schedule':
        description = `Scheduled: ${triggerValue}`;
        break;
      case 'event':
        description = `Event trigger: ${triggerValue}`;
        break;
      case 'manual':
        description = 'Manually triggered';
        break;
      default:
        description = `${triggerType}: ${triggerValue}`;
    }
    
    const newTrigger: TriggerCondition = {
      id: `trigger-${Date.now()}`,
      type: triggerType as TriggerCondition['type'],
      value,
      description
    };
    
    onChange([...triggers, newTrigger]);
    setTriggerValue('');
  };
  
  const removeTrigger = (triggerId: string) => {
    onChange(triggers.filter(trigger => trigger.id !== triggerId));
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Trigger Conditions
          </CardTitle>
          <CardDescription>
            Define when and how this campaign will be triggered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Select 
              value={triggerType} 
              onValueChange={setTriggerType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trigger type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="schedule">Time Schedule</SelectItem>
                <SelectItem value="event">User Event</SelectItem>
                <SelectItem value="manual">Manual Trigger</SelectItem>
              </SelectContent>
            </Select>
            
            {triggerType !== 'manual' && (
              <Input 
                placeholder={triggerType === 'schedule' ? 'e.g., Daily at 9am' : 'e.g., user_login, purchase'}
                value={triggerValue} 
                onChange={(e) => setTriggerValue(e.target.value)} 
                className="flex-1"
              />
            )}
            
            <Button onClick={addTrigger} type="button">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Trigger
            </Button>
          </div>
          
          {triggers.length === 0 ? (
            <Alert>
              <AlertTitle>No triggers defined</AlertTitle>
              <AlertDescription>
                Add at least one trigger condition to determine when this campaign will run.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-wrap gap-2">
              {triggers.map(trigger => (
                <Badge 
                  key={trigger.id} 
                  variant="secondary"
                  className="px-2 py-1 flex items-center gap-1"
                >
                  {trigger.description}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-2"
                    onClick={() => removeTrigger(trigger.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Automation Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch id="auto-start" />
              <Label htmlFor="auto-start">Automatically start campaign on start date</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="auto-end" defaultChecked />
              <Label htmlFor="auto-end">Automatically end campaign on end date</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Send notifications when campaign starts/ends</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
