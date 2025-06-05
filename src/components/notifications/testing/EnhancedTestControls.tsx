
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useNotifications } from '@/hooks/core';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EnhancedTestConfig {
  category: string;
  content: string;
  delay: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  animate: boolean;
  useScreenReader: boolean;
}

const EnhancedTestControls: React.FC = () => {
  const { state, actions } = useNotifications();
  const { isLoading } = state;
  const { sendTestNotification } = actions;
  
  const [config, setConfig] = React.useState<EnhancedTestConfig>({
    category: 'test',
    content: 'Enhanced test notification',
    delay: 0,
    priority: 'medium',
    animate: true,
    useScreenReader: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendTestNotification(config.category);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Notification Category</Label>
            <Input
              id="category"
              value={config.category}
              onChange={(e) => setConfig(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Enter category"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              value={config.content}
              onChange={(e) => setConfig(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Notification content"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="delay">Delay (seconds)</Label>
            <Input
              id="delay"
              type="number"
              min="0"
              value={config.delay}
              onChange={(e) => setConfig(prev => ({ ...prev, delay: Number(e.target.value) }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority Level</Label>
            <RadioGroup
              value={config.priority}
              onValueChange={(value: any) => setConfig(prev => ({ ...prev, priority: value }))}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="priority-low" />
                <Label htmlFor="priority-low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="priority-medium" />
                <Label htmlFor="priority-medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="priority-high" />
                <Label htmlFor="priority-high">High</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="priority-urgent" />
                <Label htmlFor="priority-urgent">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.animate}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, animate: checked }))}
              id="animate"
            />
            <Label htmlFor="animate">Enable Animation</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={config.useScreenReader}
              onCheckedChange={(checked) => setConfig(prev => ({ ...prev, useScreenReader: checked }))}
              id="screenReader"
            />
            <Label htmlFor="screenReader">Screen Reader Announcement</Label>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Advanced Test Notification"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EnhancedTestControls;
