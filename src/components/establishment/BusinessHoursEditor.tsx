
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Plus, Trash2 } from 'lucide-react';

export type BusinessHour = {
  day: string;
  openTime: string;
  closeTime: string;
};

interface BusinessHoursEditorProps {
  hours: BusinessHour[];
  setHours: React.Dispatch<React.SetStateAction<BusinessHour[]>>;
  isEditing: boolean;
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({
  hours,
  setHours,
  isEditing,
}) => {
  const handleAddHours = () => {
    const newDay = daysOfWeek.find(day => !hours.some(hour => hour.day === day)) || 'Monday';
    setHours([...hours, { day: newDay, openTime: '09:00', closeTime: '17:00' }]);
  };

  const handleRemoveHours = (index: number) => {
    setHours(hours.filter((_, i) => i !== index));
  };

  const handleHoursChange = (
    index: number,
    field: keyof BusinessHour,
    value: string
  ) => {
    const updatedHours = [...hours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setHours(updatedHours);
  };

  if (!isEditing) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2 text-left">Business Hours</h3>
        {hours.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            {hours.map((hour, index) => (
              <React.Fragment key={index}>
                <div>{hour.day}</div>
                <div>{hour.openTime} - {hour.closeTime}</div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No business hours specified.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Business Hours</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddHours}
          disabled={hours.length >= 7}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Hours
        </Button>
      </div>

      {hours.map((hour, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center border p-2 rounded-md">
          <div>
            <Label htmlFor={`day-${index}`} className="sr-only">
              Day
            </Label>
            <select
              id={`day-${index}`}
              value={hour.day}
              onChange={(e) => handleHoursChange(index, 'day', e.target.value)}
              className="w-full rounded-md border border-input p-2 text-sm"
            >
              {daysOfWeek.map((day) => (
                <option 
                  key={day} 
                  value={day}
                  disabled={hours.some(h => h.day === day && h !== hour)}
                >
                  {day}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div className="grid grid-cols-2 gap-2 w-full">
              <Input
                type="time"
                value={hour.openTime}
                onChange={(e) => handleHoursChange(index, 'openTime', e.target.value)}
                className="text-sm"
              />
              <Input
                type="time"
                value={hour.closeTime}
                onChange={(e) => handleHoursChange(index, 'closeTime', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveHours(index)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove</span>
            </Button>
          </div>
        </div>
      ))}
      
      {hours.length === 0 && (
        <p className="text-sm text-gray-500 italic">No business hours added yet.</p>
      )}
    </div>
  );
};

export default BusinessHoursEditor;
