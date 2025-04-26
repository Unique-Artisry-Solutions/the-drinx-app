
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface AccountTabProps {
  isLightTheme: boolean;
}

const AccountTab: React.FC<AccountTabProps> = ({ isLightTheme }) => {
  return (
    <Card className={isLightTheme ? "bg-[#f5f3ed] border-gray-200" : ""}>
      <CardHeader>
        <CardTitle className={isLightTheme ? "text-gray-800" : ""}>
          Account Information
        </CardTitle>
        <CardDescription className={isLightTheme ? "text-gray-600" : ""}>
          Update your personal information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className={isLightTheme ? "text-gray-700" : ""}>
            Display Name
          </label>
          <Input 
            placeholder="Your display name" 
            className={isLightTheme ? "bg-white border-gray-200" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <label className={isLightTheme ? "text-gray-700" : ""}>
            Bio
          </label>
          <Textarea 
            placeholder="Tell us about yourself"
            className={cn(
              "h-24",
              isLightTheme ? "bg-white border-gray-200" : ""
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountTab;
