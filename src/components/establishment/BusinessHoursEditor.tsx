
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  isClosed: boolean;
}

interface BusinessHoursEditorProps {
  hours: BusinessHour[];
  onUpdate?: (hours: BusinessHour[]) => void;
  setHours?: React.Dispatch<React.SetStateAction<BusinessHour[]>>;
  isEditing?: boolean;
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const BusinessHoursEditor: React.FC<BusinessHoursEditorProps> = ({ 
  hours, 
  onUpdate, 
  setHours, 
  isEditing = true 
}) => {
  const handleTimeChange = (day: string, field: 'open' | 'close', value: string) => {
    const updatedHours = hours.map(hour => 
      hour.day === day ? { ...hour, [field]: value } : hour
    );
    
    if (onUpdate) {
      onUpdate(updatedHours);
    } else if (setHours) {
      setHours(updatedHours);
    }
  };

  const toggleClosed = (day: string) => {
    const updatedHours = hours.map(hour =>
      hour.day === day ? { ...hour, isClosed: !hour.isClosed } : hour
    );
    
    if (onUpdate) {
      onUpdate(updatedHours);
    } else if (setHours) {
      setHours(updatedHours);
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {daysOfWeek.map((day) => {
            const dayHours = hours.find(h => h.day === day) || { 
              day, 
              open: '09:00', 
              close: '17:00', 
              isClosed: false 
            };
            
            return (
              <div key={day} className="flex justify-between">
                <span className="capitalize font-medium">{day}</span>
                <span className="text-gray-600">
                  {dayHours.isClosed ? 'Closed' : `${dayHours.open} - ${dayHours.close}`}
                </span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

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
                <Label className="capitalize">{day}</Label>
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
