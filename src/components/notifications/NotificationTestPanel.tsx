
import React, { useState, KeyboardEvent } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/core';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NotificationTestPanel = () => {
  const { state, actions } = useNotifications();
  const { isLoading, error } = state;
  const { sendTestNotification } = actions;
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [type, setType] = useState('default');

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSendTest();
    }
  };

  const handleSendTest = async () => {
    await sendTestNotification(type);
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span>Test Notifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent 
        className="space-y-4"
        onKeyDown={handleKeyPress}
      >
        <div 
          className="space-y-2"
          role="group" 
          aria-labelledby="priority-label"
        >
          <Label id="priority-label">Priority Level (use arrow keys to navigate)</Label>
          <RadioGroup
            defaultValue="medium"
            onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}
            className="flex flex-wrap gap-4"
            aria-label="Select notification priority"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="low" 
                id="low"
                aria-describedby="low-label"
              />
              <Label id="low-label" htmlFor="low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="medium" 
                id="medium" 
                aria-describedby="medium-label"
              />
              <Label id="medium-label" htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="high" 
                id="high" 
                aria-describedby="high-label"
              />
              <Label id="high-label" htmlFor="high">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="urgent" 
                id="urgent" 
                aria-describedby="urgent-label"
              />
              <Label id="urgent-label" htmlFor="urgent">Urgent</Label>
            </div>
          </RadioGroup>
        </div>

        <div 
          className="space-y-2"
          role="group" 
          aria-labelledby="type-label"
        >
          <Label id="type-label">Notification Type (press Space to open)</Label>
          <Select 
            onValueChange={setType} 
            defaultValue="default"
            aria-label="Select notification type"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error && (
          <div 
            className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded"
            role="alert"
            aria-live="assertive"
          >
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            {error}
          </div>
        )}

        <Button 
          onClick={handleSendTest} 
          disabled={isLoading}
          className="w-full"
          aria-label={isLoading ? "Sending test notification..." : "Send test notification (press Enter)"}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4 animate-pulse" aria-hidden="true" />
              <span>Sending...</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span>Send Test Notification</span>
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationTestPanel;
