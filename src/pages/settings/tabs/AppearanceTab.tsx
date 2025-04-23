
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { useNotificationFormContext } from '../hooks/useNotificationFormContext';

interface AppearanceTabProps {
  isLightTheme: boolean;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ isLightTheme }) => {
  // Since dark mode isn't part of the profile form, let's use local state for now
  const [darkMode, setDarkMode] = React.useState(false);
  
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
          <div className="flex items-center justify-between space-y-0">
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
            <Switch
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AppearanceTab;
