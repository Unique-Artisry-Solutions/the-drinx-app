import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import {
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormDescription
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import PrioritySelect from './PrioritySelect';
import TimeWindowSelector from './TimeWindowSelector';

interface NotificationCategoriesListProps {
  isLightTheme: boolean;
  isLoading?: boolean;
}

const notificationCategories = [
  {
    id: 'system-updates',
    title: 'System Announcements',
    description: 'Updates about the platform and important system changes',
    type: 'system' as const,
  },
  {
    id: 'bar-crawl',
    title: 'Bar Crawl Updates',
    description: 'Notifications about bar crawls you are participating in',
    type: 'bar-crawl' as const,
  },
  {
    id: 'establishment',
    title: 'Establishment Updates',
    description: 'Updates from establishments you follow',
    type: 'establishment' as const,
  },
  {
    id: 'promotions',
    title: 'Promotions and Events',
    description: 'Special offers and upcoming events',
    type: 'promotional' as const,
  }
];

const NotificationCategoriesList: React.FC<NotificationCategoriesListProps> = ({ isLightTheme, isLoading }) => {
  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className={cn("text-lg font-medium", isLightTheme ? "text-gray-700" : "")}>
        Notification Categories
      </h3>
      
      <Accordion type="multiple" defaultValue={['system-updates']}>
        {notificationCategories.map((category) => (
          <AccordionItem 
            value={category.id} 
            key={category.id}
            className={cn("border rounded-md mb-2", isLightTheme ? "border-gray-200" : "border-border")}
          >
            <AccordionTrigger className="px-4">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{category.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <FormField
                name={`notification_categories.${category.id}.enabled`}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 mb-4">
                    <div className="space-y-1">
                      <FormLabel className={isLightTheme ? "text-gray-700" : ""}>
                        {category.title}
                      </FormLabel>
                      <FormDescription className={cn(isLightTheme ? "text-gray-600" : "")}>
                        {category.description}
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

              <div className="space-y-6">
                <PrioritySelect 
                  name={`notification_categories.${category.id}.priority`}
                  isLightTheme={isLightTheme}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name={`notification_categories.${category.id}.channels.email`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className={cn("text-sm m-0", isLightTheme ? "text-gray-700" : "")}>
                          Email Notifications
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`notification_categories.${category.id}.channels.push`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className={cn("text-sm m-0", isLightTheme ? "text-gray-700" : "")}>
                          Push Notifications
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name={`notification_categories.${category.id}.sound`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className={cn("text-sm m-0", isLightTheme ? "text-gray-700" : "")}>
                          Sound
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    name={`notification_categories.${category.id}.vibration`}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className={cn("text-sm m-0", isLightTheme ? "text-gray-700" : "")}>
                          Vibration
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>

                <TimeWindowSelector 
                  basePath={`notification_categories.${category.id}`}
                  isLightTheme={isLightTheme}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default NotificationCategoriesList;
