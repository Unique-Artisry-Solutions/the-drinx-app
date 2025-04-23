
import React, { useState } from 'react';
import { Bell, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotificationTesting } from '@/hooks/notifications/useNotificationTesting';
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
  const { sendTestNotification, isLoading, error } = useNotificationTesting();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [type, setType] = useState('default');

  const handleSendTest = () => {
    sendTestNotification({
      priority,
      type,
      title: `Test ${priority} priority notification`,
      content: `This is a test notification with ${priority} priority and type: ${type}`,
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Test Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Priority Level</Label>
          <RadioGroup
            defaultValue="medium"
            onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setPriority(value)}
            className="flex flex-wrap gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="low" />
              <Label htmlFor="low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="high" />
              <Label htmlFor="high">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="urgent" id="urgent" />
              <Label htmlFor="urgent">Urgent</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Notification Type</Label>
          <Select onValueChange={setType} defaultValue="default">
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
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </div>
        )}

        <Button 
          onClick={handleSendTest} 
          disabled={isLoading}
          className="w-full"
          aria-label="Send test notification"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4 animate-pulse" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Send Test Notification
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationTestPanel;
