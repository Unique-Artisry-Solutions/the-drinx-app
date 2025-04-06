
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { UserProfileFormData } from '../hooks/useProfileData';
import { useProfileFormContext } from '../hooks/useProfileFormContext';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';

interface AppearanceTabProps {
  profile: UserProfileFormData;
  isLightTheme: boolean;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ profile, isLightTheme }) => {
  const form = useProfileFormContext();
  
  return (
    <TabsContent value="appearance">
      <Card className={cn(
        "overflow-hidden",
        isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn(
            "text-xl",
            isLightTheme ? "text-gray-800" : ""
          )}>
            Appearance Settings
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Customize how the app looks
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-4">
          <FormField
            control={form.control}
            name="dark_mode"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between space-y-0 py-2">
                <div className="space-y-0.5">
                  <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                    Dark Mode
                  </FormLabel>
                  <FormDescription className={cn(
                    "text-sm", 
                    isLightTheme ? "text-gray-600" : "text-muted-foreground"
                  )}>
                    Use dark theme throughout the app
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AppearanceTab;
