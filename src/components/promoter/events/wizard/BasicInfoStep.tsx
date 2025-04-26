
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { useEventWizard } from './EventWizardContext';
import { cn } from '@/lib/utils';

const BasicInfoStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();
  const [date, setDate] = React.useState<Date | undefined>(
    formData.date ? new Date(formData.date) : undefined
  );

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      updateFormData({ date: selectedDate.toISOString().split('T')[0] });
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 space-y-4">
        <div>
          <Label htmlFor="event-name" className="text-base font-medium">Event Name</Label>
          <Input
            id="event-name"
            placeholder="Enter event name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="event-description" className="text-base font-medium">Description</Label>
          <Textarea
            id="event-description"
            placeholder="Describe your event"
            value={formData.description}
            onChange={(e) => updateFormData({ description: e.target.value })}
            rows={5}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-base font-medium">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full mt-1 justify-start text-left",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div>
            <Label htmlFor="event-time" className="text-base font-medium">Time</Label>
            <div className="flex items-center mt-1">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <Input
                id="event-time"
                type="time"
                value={formData.time}
                onChange={(e) => updateFormData({ time: e.target.value })}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoStep;
