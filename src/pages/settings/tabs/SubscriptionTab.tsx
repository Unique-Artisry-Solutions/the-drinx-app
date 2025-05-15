
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface SubscriptionTabProps {
  isLightTheme: boolean;
}

const SubscriptionTab: React.FC<SubscriptionTabProps> = ({ isLightTheme }) => {
  const { subscribedPromoters, isLoading } = useSubscriptions();
  const { toast } = useToast();
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Mock notification preferences since we haven't created the real table yet
  const [preferences, setPreferences] = useState({
    receiveEventUpdates: true,
    receiveDiscountCodes: true,
    receiveFlyers: true,
    receiveDirectMessages: true
  });

  const updatePreference = (key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const savePreferences = async () => {
    setSavingPreferences(true);
    // Mock API call - would save to a real notification preferences table
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSavingPreferences(false);
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <TabsContent value="subscriptions">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Followed Promoters
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage your promoter follows and notification preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid gap-6">
            {/* Following Preferences */}
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-4", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Notification Preferences
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className={isLightTheme ? "text-gray-800" : ""}>Event Updates</div>
                    <div className="text-sm text-gray-500">Receive notifications about new events</div>
                  </div>
                  <Switch 
                    checked={preferences.receiveEventUpdates}
                    onCheckedChange={(checked) => updatePreference('receiveEventUpdates', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className={isLightTheme ? "text-gray-800" : ""}>Discount Codes</div>
                    <div className="text-sm text-gray-500">Receive notifications about new discount codes</div>
                  </div>
                  <Switch 
                    checked={preferences.receiveDiscountCodes} 
                    onCheckedChange={(checked) => updatePreference('receiveDiscountCodes', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className={isLightTheme ? "text-gray-800" : ""}>Promotional Materials</div>
                    <div className="text-sm text-gray-500">Receive flyers and other promotional materials</div>
                  </div>
                  <Switch 
                    checked={preferences.receiveFlyers}
                    onCheckedChange={(checked) => updatePreference('receiveFlyers', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className={isLightTheme ? "text-gray-800" : ""}>Direct Messages</div>
                    <div className="text-sm text-gray-500">Allow promoters to send you direct messages</div>
                  </div>
                  <Switch 
                    checked={preferences.receiveDirectMessages}
                    onCheckedChange={(checked) => updatePreference('receiveDirectMessages', checked)}
                  />
                </div>
                
                <Button 
                  onClick={savePreferences} 
                  className="mt-4"
                  disabled={savingPreferences}
                >
                  {savingPreferences ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Preferences"}
                </Button>
              </div>
            </div>
            
            {/* Followed Promoters */}
            <div className={cn(
              "rounded-lg border p-4",
              isLightTheme ? "border-gray-200 bg-white" : "border-gray-700 bg-gray-800"
            )}>
              <h3 className={cn(
                "text-lg font-medium mb-4", 
                isLightTheme ? "text-gray-800" : ""
              )}>
                Followed Promoters
              </h3>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : subscribedPromoters.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <p>You are not following any promoters yet.</p>
                  <p className="mt-2">Follow promoters to receive updates about their events!</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {subscribedPromoters.map((sub: any) => (
                    <li key={sub.id} className={cn(
                      "flex items-center justify-between p-3 rounded-md",
                      isLightTheme ? "bg-gray-100" : "bg-gray-700"
                    )}>
                      <div>
                        <div className={isLightTheme ? "font-medium text-gray-800" : "font-medium"}>
                          {sub.promoter?.display_name || sub.promoter?.username || "Unknown Promoter"}
                        </div>
                        {sub.tier_id && (
                          <Badge variant="outline" className="mt-1">
                            Tier: {sub.tier_name || "Basic"}
                          </Badge>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubscriptionTab;
