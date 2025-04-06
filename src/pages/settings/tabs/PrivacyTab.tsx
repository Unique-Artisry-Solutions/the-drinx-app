
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PrivacyTabProps {
  isLightTheme: boolean;
}

const PrivacyTab: React.FC<PrivacyTabProps> = ({ isLightTheme }) => {
  return (
    <TabsContent value="privacy">
      <Card className={cn(
        "overflow-hidden",
        isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""
      )}>
        <CardHeader className="pb-4">
          <CardTitle className={cn(
            "text-xl",
            isLightTheme ? "text-gray-800" : ""
          )}>
            Privacy Settings
          </CardTitle>
          <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
            Manage your privacy preferences
          </CardDescription>
        </CardHeader>
        
        <CardContent className="py-4">
          <p className={cn(
            "text-sm",
            isLightTheme ? "text-gray-600" : "text-muted-foreground"
          )}>
            Privacy settings will be available in a future update.
          </p>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PrivacyTab;
