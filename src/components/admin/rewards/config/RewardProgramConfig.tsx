
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Award, Check, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export function RewardProgramConfig() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  const [config, setConfig] = useState({
    isEnabled: true,
    pointsPerPurchaseDollar: 10,
    signupBonus: 100,
    referralBonus: 50,
    checkInPoints: 5,
    minimumRedemptionPoints: 100,
    pointsExpirationDays: 365,
    tierAnalyticsEnabled: true
  });

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      // Update system settings
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          key: 'rewards.program_config',
          value: config,
          category: 'rewards',
          description: 'Reward program configuration'
        });

      if (error) throw error;
      
      toast({
        title: "Configuration saved",
        description: "The reward program settings have been updated"
      });
    } catch (error) {
      console.error("Error saving reward config:", error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Reward Program Configuration
        </CardTitle>
        <Button onClick={handleSaveConfig} disabled={isSaving}>
          {isSaving ? (
            <span className="flex items-center gap-2">Saving... <Save className="h-4 w-4 animate-spin" /></span>
          ) : (
            <span className="flex items-center gap-2">Save Changes <Save className="h-4 w-4" /></span>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="earning">Point Earning</TabsTrigger>
            <TabsTrigger value="redemption">Redemption</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Program Status</h3>
                <p className="text-sm text-muted-foreground">Enable or disable the entire rewards program</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="program-enabled"
                  checked={config.isEnabled}
                  onCheckedChange={(checked) => setConfig({...config, isEnabled: checked})}
                />
                <Label htmlFor="program-enabled">{config.isEnabled ? 'Enabled' : 'Disabled'}</Label>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Tier Analytics</h3>
                <p className="text-sm text-muted-foreground">Track and analyze tier progression metrics</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="tier-analytics"
                  checked={config.tierAnalyticsEnabled}
                  onCheckedChange={(checked) => setConfig({...config, tierAnalyticsEnabled: checked})}
                />
                <Label htmlFor="tier-analytics">{config.tierAnalyticsEnabled ? 'Enabled' : 'Disabled'}</Label>
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Points Expiration</h3>
                <p className="text-sm text-muted-foreground">Number of days before points expire (0 for never)</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.pointsExpirationDays}
                  onChange={(e) => setConfig({...config, pointsExpirationDays: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="earning" className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Points per Dollar</h3>
                <p className="text-sm text-muted-foreground">Points earned per dollar spent</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.pointsPerPurchaseDollar}
                  onChange={(e) => setConfig({...config, pointsPerPurchaseDollar: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Signup Bonus</h3>
                <p className="text-sm text-muted-foreground">Points awarded to new users who join</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.signupBonus}
                  onChange={(e) => setConfig({...config, signupBonus: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Referral Bonus</h3>
                <p className="text-sm text-muted-foreground">Points awarded for successful referrals</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.referralBonus}
                  onChange={(e) => setConfig({...config, referralBonus: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Check-in Points</h3>
                <p className="text-sm text-muted-foreground">Points awarded for checking in at an establishment</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.checkInPoints}
                  onChange={(e) => setConfig({...config, checkInPoints: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="redemption" className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-medium">Minimum Redemption</h3>
                <p className="text-sm text-muted-foreground">Minimum points required for any redemption</p>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  value={config.minimumRedemptionPoints}
                  onChange={(e) => setConfig({...config, minimumRedemptionPoints: parseInt(e.target.value)})}
                  min={0}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <h3 className="text-sm font-medium">Redemption Rules</h3>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Points cannot be redeemed if the account is less than 7 days old</li>
                <li>Only active tier rewards can be redeemed</li>
                <li>Points are subtracted immediately upon redemption</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
