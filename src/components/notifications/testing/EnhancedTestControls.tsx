
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestNotificationConfig } from '@/hooks/notifications/testing/useEnhancedNotificationTesting';

interface EnhancedTestControlsProps {
  config: TestNotificationConfig;
  onConfigChange: (config: TestNotificationConfig) => void;
  disabled?: boolean;
}

export const EnhancedTestControls: React.FC<EnhancedTestControlsProps> = ({
  config,
  onConfigChange,
  disabled = false
}) => {
  const updateConfig = (updates: Partial<TestNotificationConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <Card className="mt-4">
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="category">Notification Category</Label>
          <Select
            value={config.category}
            onValueChange={(value) => updateConfig({ category: value })}
            disabled={disabled}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="promotional">Promotional</SelectItem>
              <SelectItem value="alert">Alert</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Custom Content</Label>
          <Input
            id="content"
            value={config.content}
            onChange={(e) => updateConfig({ content: e.target.value })}
            placeholder="Enter notification content"
            disabled={disabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="delay">Delay (seconds)</Label>
          <Slider
            id="delay"
            min={0}
            max={10}
            step={1}
            value={[config.delay]}
            onValueChange={([value]) => updateConfig({ delay: value })}
            disabled={disabled}
          />
          <span className="text-sm text-gray-500">{config.delay} seconds</span>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="animate">Enable Animation</Label>
          <Switch
            id="animate"
            checked={config.animate}
            onCheckedChange={(checked) => updateConfig({ animate: checked })}
            disabled={disabled}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="screenReader">Screen Reader Preview</Label>
          <Switch
            id="screenReader"
            checked={config.useScreenReader}
            onCheckedChange={(checked) => updateConfig({ useScreenReader: checked })}
            disabled={disabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};
