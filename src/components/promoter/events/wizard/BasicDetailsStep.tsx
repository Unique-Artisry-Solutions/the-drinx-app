
import React from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const BasicDetailsStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="event-name">Event Name</Label>
            <Input
              id="event-name"
              placeholder="Enter event name"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className={cn(
                "w-full",
                !formData.name && "border-red-300 focus:ring-red-500"
              )}
              required
            />
            {!formData.name && (
              <p className="text-red-500 text-sm mt-1">Event name is required</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="event-description">Description</Label>
            <Textarea
              id="event-description"
              placeholder="Describe your event"
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={4}
              className="w-full resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="event-date">Date</Label>
              <Input
                id="event-date"
                type="date"
                value={formData.date}
                onChange={(e) => updateFormData({ date: e.target.value })}
                className={cn(
                  "w-full",
                  !formData.date && "border-red-300 focus:ring-red-500"
                )}
                required
              />
              {!formData.date && (
                <p className="text-red-500 text-sm mt-1">Event date is required</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="event-time">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => updateFormData({ time: e.target.value })}
                className={cn(
                  "w-full",
                  !formData.time && "border-red-300 focus:ring-red-500"
                )}
                required
              />
              {!formData.time && (
                <p className="text-red-500 text-sm mt-1">Event time is required</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicDetailsStep;
