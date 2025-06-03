
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Beaker, FileChartPie, Calendar, FlaskConical, GitCompare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export interface AdvancedConfigOptionsProps {
  onSave?: () => void;
}

export function AdvancedConfigOptions({ onSave }: AdvancedConfigOptionsProps) {
  const [activeTab, setActiveTab] = useState<string>('general');
  
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid grid-cols-4 mb-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="ab-testing">
              <span className="flex items-center gap-1">
                A/B Testing <Badge variant="outline" className="h-5 ml-1">New</Badge>
              </span>
            </TabsTrigger>
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="general" className="space-y-4 mt-0">
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
        </TabsContent>
        
        <TabsContent value="ab-testing" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <GitCompare className="h-4 w-4 text-primary" />
                  <Label htmlFor="enable-ab-testing" className="text-base">Enable A/B Testing</Label>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Test different reward strategies with user segments
                </p>
              </div>
              <Switch id="enable-ab-testing" />
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Variant A (Control)</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Point multiplier:</span>
                    <span className="font-medium">1x</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Redemption threshold:</span>
                    <span className="font-medium">500 points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>User segment:</span>
                    <span className="font-medium">50%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-muted/50">
                <CardHeader className="py-3">
                  <CardTitle className="text-sm">Variant B (Test)</CardTitle>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Point multiplier:</span>
                    <span className="font-medium">1.5x</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Redemption threshold:</span>
                    <span className="font-medium">450 points</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>User segment:</span>
                    <span className="font-medium">50%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Current Test Results</h4>
              <div className="p-3 bg-muted rounded-md">
                <div className="flex justify-between text-sm mb-2">
                  <span>Engagement rate:</span>
                  <span className="font-medium">A: 24% | B: 31%</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Redemption rate:</span>
                  <span className="font-medium">A: 14% | B: 18%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Retention impact:</span>
                  <span className="font-medium text-emerald-600">+7% for Variant B</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="seasonal" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="text-base font-medium">Seasonal Templates</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-3 border rounded-md bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Summer Special</span>
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Double points for summer beverages in June-August</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Automatically activates June 1st</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-3 border rounded-md bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Holiday Season</span>
                        <Badge variant="outline" className="bg-muted text-muted-foreground">Scheduled</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">+50% bonus points on all festive drinks</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Activates November 15th</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <div className="p-3 border rounded-md bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Back to School</span>
                  <Badge variant="outline" className="bg-muted text-muted-foreground">Draft</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Student special rewards program</p>
              </div>
              
              <div className="p-3 border rounded-md border-dashed flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary cursor-pointer transition-colors">
                <span className="text-sm">+ Add Template</span>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-start justify-between">
              <div>
                <Label htmlFor="auto-seasonal" className="text-base">Automatic Seasonal Activation</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically apply seasonal templates based on date
                </p>
              </div>
              <Switch id="auto-seasonal" defaultChecked />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rules" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical className="h-4 w-4 text-primary" />
              <h3 className="text-base font-medium">Advanced Rule Configuration</h3>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <h4 className="text-sm font-medium mb-2">Complex Rule Builder</h4>
              <div className="p-2 border bg-background rounded-md mb-3">
                <div className="flex gap-2 items-center text-xs">
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">IF</Badge>
                  <span>User visits establishment</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">AND</Badge>
                  <span>Orders signature drink</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">AND</Badge>
                  <span>Day of week is Friday</span>
                </div>
              </div>
              <div className="p-2 border bg-background rounded-md">
                <div className="flex gap-2 items-center text-xs">
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">THEN</Badge>
                  <span>Award 2x regular points</span>
                  <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">AND</Badge>
                  <span>Send special offer notification</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <h4 className="text-sm font-medium mb-2">Rule Impact Simulation</h4>
              <Card className="bg-muted/50">
                <CardContent className="py-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated points awarded/month:</span>
                      <span className="font-medium">+24,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated redemptions/month:</span>
                      <span className="font-medium">+45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Projected engagement increase:</span>
                      <span className="font-medium text-emerald-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly program cost:</span>
                      <span className="font-medium">$1,240</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <Label htmlFor="enable-simulation" className="text-base">Real-time Rule Simulation</Label>
                <p className="text-sm text-muted-foreground">
                  Preview impact before applying rule changes
                </p>
              </div>
              <Switch id="enable-simulation" defaultChecked />
            </div>
          </div>
        </TabsContent>
        
        <div className="pt-4 mt-2 border-t">
          <Button onClick={onSave} className="w-full">Save Advanced Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
