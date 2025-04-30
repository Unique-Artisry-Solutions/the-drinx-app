
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface TimeWindowSelectorProps {
  isLightTheme: boolean;
  basePath: string;
}

const TimeWindowSelector: React.FC<TimeWindowSelectorProps> = ({ isLightTheme, basePath }) => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i;
    const amPm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return {
      value: hour.toString().padStart(2, '0') + ':00',
      label: `${displayHour}:00 ${amPm}`
    };
  });

  return (
    <div className="space-y-4">
      <FormField
        name={`${basePath}.timeWindow.enabled`}
        render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Switch 
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
              Enable Quiet Hours
            </FormLabel>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          name={`${basePath}.timeWindow.start`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                Start Time
              </FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value || "00:00"}
                disabled={!field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`start-${hour.value}`} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          name={`${basePath}.timeWindow.end`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                End Time
              </FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value || "08:00"}
                disabled={!field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`end-${hour.value}`} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default TimeWindowSelector;
