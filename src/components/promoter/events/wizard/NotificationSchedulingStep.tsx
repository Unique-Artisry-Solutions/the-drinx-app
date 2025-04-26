
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon, MapPin, Plus, Trash } from 'lucide-react';
import { useEventWizard } from './EventWizardContext';
import { useUserLocation } from '@/hooks/useUserLocation';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea';

const NotificationSchedulingStep = () => {
  const { formData, updateFormData } = useEventWizard();
  const { userLocation, isLoading: isLocationLoading } = useUserLocation();
  const [notificationSchedules, setNotificationSchedules] = useState(formData.notificationSchedules || []);
  
  const addNotification = () => {
    const newNotification = {
      id: uuidv4(),
      title: `Reminder: ${formData.name}`,
      content: `Don't forget about ${formData.name} happening soon!`,
      priority: 'medium' as const,
      scheduledFor: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      locationBased: false
    };
    
    const updatedNotifications = [...notificationSchedules, newNotification];
    setNotificationSchedules(updatedNotifications);
    updateFormData({ notificationSchedules: updatedNotifications });
  };
  
  const removeNotification = (id: string) => {
    const updatedNotifications = notificationSchedules.filter(n => n.id !== id);
    setNotificationSchedules(updatedNotifications);
    updateFormData({ notificationSchedules: updatedNotifications });
  };
  
  const updateNotification = (id: string, updates: Partial<any>) => {
    const updatedNotifications = notificationSchedules.map(notification => {
      if (notification.id === id) {
        return { ...notification, ...updates };
      }
      return notification;
    });
    
    setNotificationSchedules(updatedNotifications);
    updateFormData({ notificationSchedules: updatedNotifications });
  };
  
  const handleLocationToggle = (id: string, checked: boolean) => {
    updateNotification(id, { 
      locationBased: checked,
      coordinates: checked ? {
        latitude: userLocation?.latitude || 0,
        longitude: userLocation?.longitude || 0
      } : undefined,
      targetRadius: checked ? 10000 : undefined // Default 10km radius in meters
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Notification Scheduling</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set up notifications to remind attendees about your event
        </p>
      </div>
      
      <div className="space-y-4">
        {notificationSchedules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border border-dashed">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No notifications scheduled yet
            </p>
            <Button onClick={addNotification} variant="outline">Add a notification</Button>
          </div>
        ) : (
          <>
            {notificationSchedules.map((notification, index) => (
              <Card key={notification.id} className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Notification #{index + 1}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeNotification(notification.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${notification.id}`}>Title</Label>
                    <Input 
                      id={`title-${notification.id}`}
                      value={notification.title} 
                      onChange={(e) => updateNotification(notification.id, { title: e.target.value })}
                      placeholder="Notification title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor={`priority-${notification.id}`}>Priority</Label>
                    <Select 
                      value={notification.priority} 
                      onValueChange={(value) => updateNotification(notification.id, { priority: value })}
                    >
                      <SelectTrigger id={`priority-${notification.id}`}>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor={`content-${notification.id}`}>Content</Label>
                  <Textarea 
                    id={`content-${notification.id}`}
                    value={notification.content}
                    onChange={(e) => updateNotification(notification.id, { content: e.target.value })}
                    placeholder="Notification content"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor={`scheduled-${notification.id}`}>Scheduled For</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {notification.scheduledFor ? (
                            format(new Date(notification.scheduledFor), "PPP p")
                          ) : (
                            <span>Pick a date and time</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={notification.scheduledFor ? new Date(notification.scheduledFor) : undefined}
                          onSelect={(date) => date && updateNotification(
                            notification.id, 
                            { scheduledFor: date.toISOString() }
                          )}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id={`location-based-${notification.id}`}
                    checked={notification.locationBased}
                    onCheckedChange={(checked) => 
                      handleLocationToggle(notification.id, checked === true)
                    }
                    disabled={isLocationLoading || !userLocation}
                  />
                  <Label 
                    htmlFor={`location-based-${notification.id}`}
                    className="flex items-center"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Location-based notification
                    {(isLocationLoading || !userLocation) && (
                      <span className="text-sm text-gray-500 ml-2">(Location unavailable)</span>
                    )}
                  </Label>
                </div>
                
                {notification.locationBased && notification.coordinates && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Latitude</Label>
                      <Input 
                        value={notification.coordinates.latitude.toFixed(6)}
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Longitude</Label>
                      <Input 
                        value={notification.coordinates.longitude.toFixed(6)}
                        readOnly
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`radius-${notification.id}`}>Radius (meters)</Label>
                      <Input 
                        id={`radius-${notification.id}`}
                        type="number"
                        min={100}
                        max={50000}
                        value={notification.targetRadius || 10000}
                        onChange={(e) => updateNotification(
                          notification.id, 
                          { targetRadius: parseInt(e.target.value) }
                        )}
                      />
                    </div>
                  </div>
                )}
              </Card>
            ))}
            
            <Button 
              onClick={addNotification} 
              variant="outline" 
              className="w-full mt-4"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Notification
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSchedulingStep;
