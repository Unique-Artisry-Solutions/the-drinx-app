
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Beaker, FileChart } from 'lucide-react';

export interface AdvancedConfigOptionsProps {
  onSave?: () => void;
}

export function AdvancedConfigOptions({ onSave }: AdvancedConfigOptionsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Beaker className="h-5 w-5 text-primary" />
          Advanced Configuration Options
        </CardTitle>
        <CardDescription>
          Configure advanced reward program options and experimental features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="advanced-analytics" className="text-base">Enhanced Analytics</Label>
              <p className="text-sm text-muted-foreground">
                Enable detailed reports and predictive analytics
              </p>
            </div>
            <Switch id="advanced-analytics" />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="ai-recommendations" className="text-base">AI-Powered Recommendations</Label>
              <p className="text-sm text-muted-foreground">
                Use machine learning to optimize reward strategies
              </p>
            </div>
            <Switch id="ai-recommendations" />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dynamic-pricing" className="text-base">Dynamic Point Values</Label>
              <p className="text-sm text-muted-foreground">
                Automatically adjust point values based on demand
              </p>
            </div>
            <Switch id="dynamic-pricing" />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="fraud-detection" className="text-base">Advanced Fraud Detection</Label>
              <p className="text-sm text-muted-foreground">
                Enable AI-based fraud prevention system
              </p>
            </div>
            <Switch id="fraud-detection" defaultChecked />
          </div>
          
          <div className="pt-4">
            <Button onClick={onSave} className="w-full">Save Advanced Settings</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
