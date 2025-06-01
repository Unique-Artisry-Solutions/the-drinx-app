
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronDown, 
  Settings, 
  Layers, 
  Calendar, 
  Globe, 
  Zap,
  Beaker,
  BadgePercent,
  Wand,
  Gauge
} from 'lucide-react';
import { AdvancedConfigOptions } from './AdvancedConfigOptions';
import { SeasonalTemplateSelector } from './SeasonalTemplateSelector';
import { ComplexRuleBuilder } from './ComplexRuleBuilder';
import { RuleImpactSimulator } from './RuleImpactSimulator';

// Placeholder data for demonstration
const programSettings = {
  name: "Premium Rewards Program",
  pointsPerDollar: 10,
  pointsForSignup: 500,
  pointsForReferral: 250,
  minPointsForRedemption: 1000,
  expiryDays: 365,
  isActive: true,
  allowNegativeBalance: false,
  requiresVerification: true,
  notificationEnabled: true,
};

const exchangeRates = {
  pointsToUsd: 0.01,
  usdToPoints: 100
};

const pointsCategories = [
  { id: 1, name: "Purchase", multiplier: 1.0 },
  { id: 2, name: "Review", multiplier: 0.5 },
  { id: 3, name: "Social Share", multiplier: 0.3 },
  { id: 4, name: "Birthday Bonus", multiplier: 2.0 }
];

// Sample A/B test configurations
const abTestConfigs = [
  { id: 1, name: "Standard vs Double Points", status: "active", variants: 2, conversions: "12% increase" },
  { id: 2, name: "Early Redemption Test", status: "scheduled", variants: 2, conversions: "Pending" },
  { id: 3, name: "Notification Frequency", status: "completed", variants: 3, conversions: "8% increase" }
];

// Sample seasonal templates
const seasonalTemplates = [
  { id: 1, name: "Holiday Season", startMonth: 11, endMonth: 12, pointsMultiplier: 1.5, description: "Increased points during holiday shopping season" },
  { id: 2, name: "Summer Promotion", startMonth: 6, endMonth: 8, pointsMultiplier: 1.25, description: "Summer special rewards" },
  { id: 3, name: "Back to School", startMonth: 8, endMonth: 9, pointsMultiplier: 1.35, description: "Special promotions for back to school shopping" }
];

export function RewardProgramConfig() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Reward Program Configuration
        </CardTitle>
        <CardDescription>
          Configure your rewards program settings, exchange rates, and advanced options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center gap-1">
              <Layers className="h-4 w-4" />
              <span>Points</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Categories</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-1">
              <Zap className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="program-name">Program Name</Label>
                  <Input id="program-name" defaultValue={programSettings.name} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="program-active">Program Active</Label>
                    <Switch id="program-active" defaultChecked={programSettings.isActive} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-negative">Allow Negative Balance</Label>
                    <Switch id="allow-negative" defaultChecked={programSettings.allowNegativeBalance} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="require-verification">Require Verification</Label>
                    <Switch id="require-verification" defaultChecked={programSettings.requiresVerification} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifications">Notifications Enabled</Label>
                    <Switch id="notifications" defaultChecked={programSettings.notificationEnabled} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="expiry-days">Points Expiry (Days)</Label>
                  <Input 
                    id="expiry-days" 
                    type="number" 
                    defaultValue={programSettings.expiryDays}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Set to 0 for no expiration
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="min-redemption">Minimum Points for Redemption</Label>
                  <Input 
                    id="min-redemption" 
                    type="number" 
                    defaultValue={programSettings.minPointsForRedemption}
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button>Save Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="points">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="points-per-dollar">Points Per Dollar</Label>
                  <Input 
                    id="points-per-dollar" 
                    type="number" 
                    defaultValue={programSettings.pointsPerDollar}
                  />
                </div>
                
                <div>
                  <Label htmlFor="signup-bonus">Signup Bonus Points</Label>
                  <Input 
                    id="signup-bonus" 
                    type="number" 
                    defaultValue={programSettings.pointsForSignup}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="referral-bonus">Referral Bonus Points</Label>
                  <Input 
                    id="referral-bonus" 
                    type="number" 
                    defaultValue={programSettings.pointsForReferral}
                  />
                </div>
                
                <div>
                  <Label>Points Exchange Rates</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <Label htmlFor="points-to-usd">Points to USD</Label>
                      <Input 
                        id="points-to-usd" 
                        type="number" 
                        defaultValue={exchangeRates.pointsToUsd}
                        step="0.001"
                      />
                    </div>
                    <div>
                      <Label htmlFor="usd-to-points">USD to Points</Label>
                      <Input 
                        id="usd-to-points" 
                        type="number" 
                        defaultValue={exchangeRates.usdToPoints}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-end">
              <Button>Save Points Settings</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="space-y-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 p-3 font-medium border-b">
                  <div className="col-span-5">Category Name</div>
                  <div className="col-span-5">Point Multiplier</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                
                {pointsCategories.map(category => (
                  <div key={category.id} className="grid grid-cols-12 p-3 items-center border-b last:border-0">
                    <div className="col-span-5">
                      <Input defaultValue={category.name} />
                    </div>
                    <div className="col-span-5">
                      <Input 
                        type="number" 
                        defaultValue={category.multiplier}
                        step="0.1"
                      />
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center">
                <Button className="ml-auto">
                  Add Category
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-end">
                <Button>Save Categories</Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            {/* A/B Testing Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-primary" />
                  A/B Testing for Reward Strategies
                </CardTitle>
                <CardDescription>
                  Configure and manage A/B tests to optimize your reward strategies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-4">
                  <div className="grid grid-cols-12 p-3 font-medium border-b">
                    <div className="col-span-4">Test Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Variants</div>
                    <div className="col-span-2">Conversions</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  {abTestConfigs.map(test => (
                    <div key={test.id} className="grid grid-cols-12 p-3 items-center border-b last:border-0">
                      <div className="col-span-4">{test.name}</div>
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          test.status === 'active' ? 'bg-green-100 text-green-800' : 
                          test.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {test.status}
                        </span>
                      </div>
                      <div className="col-span-2">{test.variants}</div>
                      <div className="col-span-2">{test.conversions}</div>
                      <div className="col-span-2 flex justify-end">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button>Create New A/B Test</Button>
              </CardContent>
            </Card>
            
            {/* Seasonal Templates Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Seasonal Promotion Templates
                </CardTitle>
                <CardDescription>
                  Create and manage seasonal promotion templates for recurring campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border mb-4">
                  <div className="grid grid-cols-12 p-3 font-medium border-b">
                    <div className="col-span-3">Template Name</div>
                    <div className="col-span-4">Period</div>
                    <div className="col-span-2">Multiplier</div>
                    <div className="col-span-3 text-right">Actions</div>
                  </div>
                  
                  {seasonalTemplates.map(template => (
                    <div key={template.id} className="grid grid-cols-12 p-3 items-center border-b last:border-0">
                      <div className="col-span-3">{template.name}</div>
                      <div className="col-span-4">
                        {new Date(2023, template.startMonth - 1).toLocaleString('default', { month: 'short' })} - 
                        {new Date(2023, template.endMonth - 1).toLocaleString('default', { month: 'short' })}
                      </div>
                      <div className="col-span-2">×{template.pointsMultiplier}</div>
                      <div className="col-span-3 flex justify-end">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Apply</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button>Create New Template</Button>
              </CardContent>
            </Card>
            
            {/* Complex Rule Conditions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wand className="h-5 w-5 text-primary" />
                  Complex Rule Conditions
                </CardTitle>
                <CardDescription>
                  Build complex, conditional reward rules with multiple criteria and actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-md mb-4 bg-muted/30">
                  <h4 className="font-medium mb-2">Example Complex Rule</h4>
                  <div className="space-y-2">
                    <div className="p-2 border rounded bg-background">
                      <p className="text-sm font-medium">IF</p>
                      <div className="pl-4 border-l-2 border-primary my-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">User Total Spend &gt; $100</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">AND</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Last Visit Within 30 Days</span>
                        </div>
                      </div>
                      <p className="text-sm font-medium">THEN</p>
                      <div className="pl-4 border-l-2 border-primary/60 my-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Add 500 Bonus Points</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">AND</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Send Special Offer Notification</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button>Create Complex Rule</Button>
              </CardContent>
            </Card>
            
            {/* Rule Impact Simulation */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Rule Impact Simulation
                </CardTitle>
                <CardDescription>
                  Simulate the impact of reward rules before deploying them
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="rule-type">Select Rule Type</Label>
                      <Select defaultValue="points_multiplier">
                        <SelectTrigger>
                          <SelectValue placeholder="Select rule type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="points_multiplier">Points Multiplier</SelectItem>
                          <SelectItem value="tier_upgrade">Tier Upgrade Rule</SelectItem>
                          <SelectItem value="bonus_points">Bonus Points Award</SelectItem>
                          <SelectItem value="special_offer">Special Offer Trigger</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="target-segment">Target User Segment</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Select user segment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="new">New Users (0-30 days)</SelectItem>
                          <SelectItem value="active">Active Users</SelectItem>
                          <SelectItem value="lapsed">Lapsed Users</SelectItem>
                          <SelectItem value="high_value">High Value Users</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="simulation-period">Simulation Period (Days)</Label>
                      <Input type="number" id="simulation-period" defaultValue={30} />
                    </div>
                    
                    <Button className="w-full">Run Simulation</Button>
                  </div>
                  
                  <div className="p-4 border rounded-md bg-muted/30">
                    <h3 className="text-sm font-medium mb-3">Simulation Results Preview</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Estimated Point Distribution:</span>
                        <span className="font-medium">45,250 points</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Estimated Cost:</span>
                        <span className="font-medium">$452.50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Affected Users:</span>
                        <span className="font-medium">128 users</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Projected Engagement Lift:</span>
                        <span className="font-medium text-green-600">+12.5%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Projected Revenue Impact:</span>
                        <span className="font-medium text-green-600">+$1,250.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>ROI Projection:</span>
                        <span className="font-medium text-green-600">2.76x</span>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm">Export Data</Button>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2">Cancel</Button>
              <Button>Save Advanced Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
