
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, Calendar as CalendarIcon, X, Plus } from 'lucide-react';
import ScheduleThemeModal from './ScheduleThemeModal';
import { format } from 'date-fns';
import { ThemePalette } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

type ScheduledTheme = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  time: string;
  palette: ThemePalette;
}

const ThemeScheduler: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedules, setSchedules] = useState<ScheduledTheme[]>([]);
  const { toast } = useToast();
  
  const handleAddSchedule = (newSchedule: ScheduledTheme) => {
    setSchedules([...schedules, newSchedule]);
  };
  
  const handleRemoveSchedule = (id: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== id));
    toast({
      title: 'Schedule removed',
      description: 'The theme schedule has been removed',
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-500" />
              Theme Scheduler
            </CardTitle>
            <CardDescription>
              Schedule automatic theme changes for specific dates and events
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Theme
          </Button>
        </CardHeader>
        
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarIcon className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p>No scheduled theme changes</p>
              <p className="text-sm mt-1">
                Schedule a theme to change automatically on specific dates
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: schedule.palette.primary }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: schedule.palette.secondary }}></div>
                    </div>
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <div className="flex text-sm text-muted-foreground gap-3">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(schedule.startDate, 'PP')}
                          {schedule.endDate && ` to ${format(schedule.endDate, 'PP')}`}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {schedule.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleRemoveSchedule(schedule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <ScheduleThemeModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleAddSchedule}
      />
    </>
  );
};

export default ThemeScheduler;
