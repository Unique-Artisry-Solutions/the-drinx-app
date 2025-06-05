
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRoleBasedNotificationTesting, NotificationRole } from '@/hooks/notifications/testing/useRoleBasedNotificationTesting';

const roleOptions: { value: NotificationRole; label: string }[] = [
  { value: 'user-to-promoter', label: 'User → Promoter' },
  { value: 'promoter-to-user', label: 'Promoter → User' },
  { value: 'user-to-establishment', label: 'User → Establishment' },
  { value: 'establishment-to-user', label: 'Establishment → User' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const categoryOptions = [
  { value: 'message', label: 'Message' },
  { value: 'alert', label: 'Alert' },
  { value: 'promotion', label: 'Promotion' },
  { value: 'system', label: 'System' },
];

const RoleBasedNotificationTester = () => {
  const {
    config,
    setConfig,
    isLoading,
    error,
    sendRoleBasedNotification
  } = useRoleBasedNotificationTesting();

  const handleRoleChange = (role: NotificationRole) => {
    setConfig(prev => ({ ...prev, role }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Role-based Notification Testing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Notification Role</Label>
            <Select
              value={config.role}
              onValueChange={(value) => handleRoleChange(value as NotificationRole)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role type" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Priority Level</Label>
            <RadioGroup 
              value={config.priority}
              onValueChange={(value: any) => setConfig(prev => ({ ...prev, priority: value }))}
              className="flex space-x-4 mt-2"
            >
              {priorityOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`priority-${option.value}`} />
                  <Label htmlFor={`priority-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={config.category}
              onValueChange={(value) => setConfig(prev => ({ ...prev, category: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderId">Sender ID</Label>
            <Input
              id="senderId"
              value={config.senderId}
              onChange={(e) => setConfig(prev => ({ ...prev, senderId: e.target.value }))}
              placeholder="Enter sender ID"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiverId">Receiver ID</Label>
            <Input
              id="receiverId"
              value={config.receiverId}
              onChange={(e) => setConfig(prev => ({ ...prev, receiverId: e.target.value }))}
              placeholder="Enter receiver ID"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Notification Content</Label>
            <Input
              id="content"
              value={config.content}
              onChange={(e) => setConfig(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Enter notification content"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 mt-2">
              {error}
            </div>
          )}

          <Button 
            onClick={sendRoleBasedNotification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Sending..." : "Send Test Notification"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleBasedNotificationTester;
