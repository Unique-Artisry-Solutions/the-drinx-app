
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
  className?: string;
}

// Generate time options in 30-minute intervals
const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute of [0, 30]) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const time = `${formattedHour}:${formattedMinute}`;
      
      // Convert to 12-hour format for display
      const hourFor12HrFormat = hour % 12 || 12;
      const amPm = hour < 12 ? 'AM' : 'PM';
      const displayTime = `${hourFor12HrFormat}:${formattedMinute} ${amPm}`;
      
      options.push({ value: time, label: displayTime });
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select time',
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert time to display format (12-hour)
  const formatDisplayTime = (time: string | undefined) => {
    if (!time) return '';
    
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return '';
    
    const hourFor12HrFormat = hours % 12 || 12;
    const amPm = hours < 12 ? 'AM' : 'PM';
    return `${hourFor12HrFormat}:${minutes.toString().padStart(2, '0')} ${amPm}`;
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className={cn("w-full justify-between", className)}
        >
          {value ? formatDisplayTime(value) : placeholder}
          <Clock className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="max-h-60 overflow-y-auto">
          {timeOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-3 py-2 text-sm outline-none",
                value === option.value 
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
