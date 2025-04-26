
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { useEventWizard } from './EventWizardContext';
import { cn } from '@/lib/utils';

interface NotificationSchedule {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor: string;
  locationBased: boolean;
  coordinates?: { latitude: number; longitude: number };
  targetRadius?: number;
}

const NotificationSchedulingStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();
  const [notificationSchedules, setNotificationSchedules] = useState<NotificationSchedule[]>(
    formData.notificationSchedules || []
  );
  const [currentNotification, setCurrentNotification] = useState<NotificationSchedule>({
    id: crypto.randomUUID(),
    title: '',
    content: '',
    priority: 'medium',
    scheduledFor: '',
    locationBased: false,
  });
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleAddNotification = () => {
    if (!currentNotification.title || !currentNotification.scheduledFor) {
      return;
    }

    const newSchedules = [...notificationSchedules, currentNotification];
    setNotificationSchedules(newSchedules);
    updateFormData({ notificationSchedules: newSchedules });
    
    // Reset form
    setCurrentNotification({
      id: crypto.randomUUID(),
      title: '',
      content: '',
      priority: 'medium',
      scheduledFor: '',
      locationBased: false,
    });
    setDate(undefined);
  };

  const handleRemoveNotification = (id: string) => {
    const updatedSchedules = notificationSchedules.filter((schedule) => schedule.id !== id);
    setNotificationSchedules(updatedSchedules);
    updateFormData({ notificationSchedules: updatedSchedules });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setCurrentNotification({
        ...currentNotification,
        scheduledFor: selectedDate.toISOString(),
      });
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Schedule Event Notifications</h3>
          <p className="text-sm text-gray-500 mb-4">
            Create scheduled notifications to promote your event and remind attendees.
          </p>
        </div>

        {/* Notification form */}
        <div className="space-y-4 border p-4 rounded-md bg-gray-50">
          <div>
            <Label htmlFor="notification-title">Notification Title</Label>
            <Input
              id="notification-title"
              value={currentNotification.title}
              onChange={(e) => setCurrentNotification({ ...currentNotification, title: e.target.value })}
              placeholder="Reminder: Event happening soon!"
            />
          </div>
          
          <div>
            <Label htmlFor="notification-content">Notification Content</Label>
            <Textarea
              id="notification-content"
              value={currentNotification.content}
              onChange={(e) => setCurrentNotification({ ...currentNotification, content: e.target.value })}
              placeholder="Don't forget our upcoming event this weekend!"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Schedule Date & Time</Label>
              <div className="mt-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>Notification Priority</Label>
              <RadioGroup
                value={currentNotification.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                  setCurrentNotification({ ...currentNotification, priority: value })
                }
                className="flex gap-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label htmlFor="priority-low">Low</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label htmlFor="priority-medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label htmlFor="priority-high">High</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="location-based"
                checked={currentNotification.locationBased}
                onCheckedChange={(checked) =>
                  setCurrentNotification({ ...currentNotification, locationBased: checked })
                }
              />
              <Label htmlFor="location-based">Location-based notification</Label>
            </div>

            {currentNotification.locationBased && (
              <div className="pl-6 space-y-3">
                <div>
                  <Label htmlFor="target-radius">Target Radius (miles)</Label>
                  <Input
                    id="target-radius"
                    type="number"
                    min="1"
                    max="100"
                    value={currentNotification.targetRadius || ''}
                    onChange={(e) =>
                      setCurrentNotification({
                        ...currentNotification,
                        targetRadius: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="5"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Users within this radius will receive the notification
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={handleAddNotification}
            className="w-full"
            disabled={!currentNotification.title || !currentNotification.scheduledFor}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Notification
          </Button>
        </div>

        {/* Scheduled notifications list */}
        {notificationSchedules.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Scheduled Notifications</h4>
            {notificationSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <p className="font-medium">{schedule.title}</p>
                  <p className="text-sm text-gray-600 truncate">{schedule.content}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      {schedule.scheduledFor ? format(new Date(schedule.scheduledFor), "PPP") : "Not scheduled"}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                      Priority: {schedule.priority}
                    </span>
                    {schedule.locationBased && (
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        Location-based {schedule.targetRadius && `(${schedule.targetRadius} miles)`}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveNotification(schedule.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSchedulingStep;
