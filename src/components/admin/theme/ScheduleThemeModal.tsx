
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTheme, ThemePalette } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, Check } from 'lucide-react';
import { format } from 'date-fns';

type ScheduledTheme = {
  id: string;
  name: string;
  startDate: Date;
  endDate?: Date;
  time: string;
  palette: ThemePalette;
}

interface ScheduleThemeModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (theme: ScheduledTheme) => void;
}

const ScheduleThemeModal: React.FC<ScheduleThemeModalProps> = ({
  open,
  onClose,
  onSchedule
}) => {
  const { palette, savedPalettes } = useTheme();
  const { toast } = useToast();
  
  const [selectedThemeName, setSelectedThemeName] = useState<string>('Current Theme');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>('12:00');
  const [name, setName] = useState<string>('');
  const [step, setStep] = useState<1 | 2>(1);
  
  // Generate theme options from saved palettes plus current
  const themeOptions = [
    { name: 'Current Theme', palette },
    ...Object.entries(savedPalettes).map(([name, palette]) => ({ name, palette }))
  ];
  
  const handleSubmit = () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this scheduled theme',
        variant: 'destructive',
      });
      return;
    }
    
    if (!startDate) {
      toast({
        title: 'Start date required',
        description: 'Please select a start date for the scheduled theme',
        variant: 'destructive',
      });
      return;
    }
    
    // Find selected palette
    const selectedTheme = themeOptions.find(theme => theme.name === selectedThemeName);
    if (!selectedTheme) return;
    
    const newSchedule: ScheduledTheme = {
      id: crypto.randomUUID(),
      name,
      startDate,
      endDate,
      time,
      palette: selectedTheme.palette
    };
    
    onSchedule(newSchedule);
    toast({
      title: 'Theme scheduled',
      description: `Theme ${name} has been scheduled to apply on ${format(startDate, 'PP')} at ${time}`,
    });
    
    // Reset and close
    setSelectedThemeName('Current Theme');
    setStartDate(new Date());
    setEndDate(undefined);
    setTime('12:00');
    setName('');
    setStep(1);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Theme Change</DialogTitle>
          <DialogDescription>
            Set up automatic theme changes for specific dates or seasons
          </DialogDescription>
        </DialogHeader>
        
        {step === 1 ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Schedule Name</Label>
                <Input
                  id="schedule-name"
                  placeholder="e.g., Summer Theme, Holiday Special"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Theme</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {themeOptions.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setSelectedThemeName(theme.name)}
                      className={`p-3 rounded-md border flex flex-col items-center gap-2 text-sm ${
                        selectedThemeName === theme.name ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                      }`}
                    >
                      <div className="flex gap-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.palette.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.palette.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.palette.accent }}></div>
                      </div>
                      <span className="text-xs">{theme.name}</span>
                      {selectedThemeName === theme.name && (
                        <Check className="h-4 w-4 text-primary absolute top-1 right-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <div className="border rounded-md p-3">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => date < (startDate || new Date())}
                    initialFocus
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-time" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Activation Time
                </Label>
                <Input
                  id="schedule-time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setStep(1)} className="sm:mr-auto">
                Back
              </Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Schedule Theme</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleThemeModal;
