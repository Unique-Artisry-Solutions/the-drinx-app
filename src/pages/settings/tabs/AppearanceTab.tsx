
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { UserProfile } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';

interface AppearanceTabProps {
  profile: UserProfile;
  isLightTheme: boolean;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ profile, isLightTheme }) => {
  const { handleToggle } = useProfileFormContext();
  
  return (
    <TabsContent value="appearance">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Appearance Settings
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className={isLightTheme ? "text-gray-700" : ""}>
                Dark Mode
              </Label>
              <p className={cn(
                "text-sm", 
                isLightTheme ? "text-gray-600" : "text-muted-foreground"
              )}>
                Use dark theme throughout the app
              </p>
            </div>
            <Switch
              checked={profile.dark_mode}
              onCheckedChange={(checked) => handleToggle('dark_mode', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AppearanceTab;
