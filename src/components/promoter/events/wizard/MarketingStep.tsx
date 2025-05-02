
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useEventWizard } from './EventWizardContext';
import { Input } from '@/components/ui/input';

const MarketingStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();

  // Initialize notification schedules if not already present
  const notificationSchedules = formData.notificationSchedules || [];

  const addNotificationSchedule = () => {
    const newSchedule = {
      id: Date.now().toString(),
      title: '',
      content: '',
      priority: 'medium' as const,
      scheduledFor: '',
      locationBased: false
    };
    
    updateFormData({
      notificationSchedules: [...notificationSchedules, newSchedule]
    });
  };

  const updateNotificationSchedule = (index: number, data: any) => {
    const updatedSchedules = [...notificationSchedules];
    updatedSchedules[index] = { ...updatedSchedules[index], ...data };
    
    updateFormData({
      notificationSchedules: updatedSchedules
    });
  };

  const removeNotificationSchedule = (index: number) => {
    const updatedSchedules = notificationSchedules.filter((_, i) => i !== index);
    
    updateFormData({
      notificationSchedules: updatedSchedules
    });
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Marketing & Notifications</h3>
          <p className="text-gray-500 mb-4">
            Set up notification schedules to remind attendees about your event.
          </p>
        </div>

        {notificationSchedules.map((schedule, index) => (
          <div key={schedule.id} className="border p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Notification #{index + 1}</h4>
              <button
                type="button"
                onClick={() => removeNotificationSchedule(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor={`notification-title-${index}`}>Title</Label>
                <Input
                  id={`notification-title-${index}`}
                  value={schedule.title}
                  onChange={(e) => updateNotificationSchedule(index, { title: e.target.value })}
                  placeholder="Notification title"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`notification-content-${index}`}>Content</Label>
                <Input
                  id={`notification-content-${index}`}
                  value={schedule.content}
                  onChange={(e) => updateNotificationSchedule(index, { content: e.target.value })}
                  placeholder="Notification message"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor={`notification-date-${index}`}>Date & Time</Label>
                <Input
                  id={`notification-date-${index}`}
                  type="datetime-local"
                  value={schedule.scheduledFor}
                  onChange={(e) => updateNotificationSchedule(index, { scheduledFor: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <button
            type="button"
            onClick={addNotificationSchedule}
            className="text-purple-600 font-medium flex items-center"
          >
            + Add notification schedule
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingStep;
