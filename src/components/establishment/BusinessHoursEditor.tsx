
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useState } from 'react'; // Commented out to preserve future functionality

interface BusinessHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface BusinessHoursEditorProps {
  hours: BusinessHour[];
  onUpdate: (hours: BusinessHour[]) => void;
}

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({ hours, onUpdate }) => {
  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    const updatedHours = hours.map(hour => 
      hour.day === day ? { ...hour, [field]: value } : hour
    );
    onUpdate(updatedHours);
  };

  const toggleClosed = (day: string) => {
    const updatedHours = hours.map(hour =>
      hour.day === day ? { ...hour, isClosed: !hour.isClosed } : hour
    );
    onUpdate(updatedHours);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Hours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {daysOfWeek.map((day) => {
          const dayHours = hours.find(h => h.day === day) || { 
            day, 
            open: '09:00', 
            close: '17:00', 
            isClosed: false 
          };
          
          return (
            <div key={day} className="flex items-center gap-4">
              <div className="w-20">
                <Label>{day}</Label>
              </div>
              
              {dayHours.isClosed ? (
                <div className="flex-1 text-gray-500">Closed</div>
              ) : (
                <div className="flex gap-2 flex-1">
                  <Input
                    type="time"
                    value={dayHours.open}
                    onChange={(e) => handleTimeChange(day, 'open', e.target.value)}
                    className="w-32"
                  />
                  <span className="self-center">-</span>
                  <Input
                    type="time"
                    value={dayHours.close}
                    onChange={(e) => handleTimeChange(day, 'close', e.target.value)}
                    className="w-32"
                  />
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleClosed(day)}
              >
                {dayHours.isClosed ? 'Open' : 'Close'}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BusinessHoursEditor;
