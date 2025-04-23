
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel
} from '@/components/ui/form';

interface QuietHoursSettingsProps {
  isLightTheme: boolean;
}

const QuietHoursSettings: React.FC<QuietHoursSettingsProps> = ({ isLightTheme }) => {
  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
        Global Quiet Hours
      </h3>
      <Card className={cn(isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
        <CardContent className="pt-6">
          <FormField
            name="global_quiet_hours.enabled"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between mb-4">
                <FormLabel className={isLightTheme ? "text-gray-700 mb-0" : "mb-0"}>
                  Enable Quiet Hours
                </FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="global_quiet_hours.start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                    Start Time
                  </FormLabel>
                  <FormControl>
                    <input 
                      type="time"
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        isLightTheme ? "bg-white border-gray-200" : ""
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              name="global_quiet_hours.end"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                    End Time
                  </FormLabel>
                  <FormControl>
                    <input 
                      type="time"
                      className={cn(
                        "flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                        isLightTheme ? "bg-white border-gray-200" : ""
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuietHoursSettings;
