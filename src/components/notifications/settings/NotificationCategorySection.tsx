import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { NotificationType } from '@/types/notification';
import { cn } from '@/lib/utils';

interface NotificationCategorySectionProps {
  title: string;
  description: string;
  name: string;
  categoryId: string;
  type: NotificationType;
  isLightTheme: boolean;
}

const NotificationCategorySection: React.FC<NotificationCategorySectionProps> = ({
  title,
  description,
  name,
  categoryId,
  type,
  isLightTheme
}) => {
  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const basePath = `notification_categories.${categoryId}`;

  return (
    <Card className={cn("mb-4", isLightTheme ? "bg-gray-50 border-gray-200" : "")}>
      <CardContent className="pt-6">
        <FormField
          name={`${basePath}.enabled`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className={cn(isLightTheme ? "text-gray-700" : "")}>
                  {title}
                </FormLabel>
                <FormDescription className={cn(isLightTheme ? "text-gray-600" : "")}>
                  {description}
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

        <div className="mt-4">
          <FormField
            name={`${basePath}.priority`}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className={cn(isLightTheme ? "text-gray-700" : "")}>
                  Priority Level
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-2"
                  >
                    {priorityOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-1">
                        <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                        <Label htmlFor={`${name}-${option.value}`} className="text-sm">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            name={`${basePath}.channels.email`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                  Email Notifications
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name={`${basePath}.channels.push`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                  Push Notifications
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name={`${basePath}.sound`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                  Sound
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            name={`${basePath}.vibration`}
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className={cn("text-sm", isLightTheme ? "text-gray-700" : "")}>
                  Vibration
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCategorySection;
