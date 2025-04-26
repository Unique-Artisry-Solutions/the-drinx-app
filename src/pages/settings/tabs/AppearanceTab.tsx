
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AppearanceTabProps {
  isLightTheme: boolean;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ isLightTheme }) => {
  return (
    <TabsContent value="appearance">
      <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
        <CardHeader>
          <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
            Appearance Settings
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Customize how the app looks for you
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className={cn(
              "text-lg font-medium", 
              isLightTheme ? "text-gray-800" : ""
            )}>
              Theme
            </h3>
            <RadioGroup defaultValue="system" className="gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className={isLightTheme ? "text-gray-700" : ""}>Light</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark" className={isLightTheme ? "text-gray-700" : ""}>Dark</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system" className={isLightTheme ? "text-gray-700" : ""}>System</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="pt-4">
            <Button className="w-full">Apply Changes</Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AppearanceTab;
