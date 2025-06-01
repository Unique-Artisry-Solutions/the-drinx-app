
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, addWeeks, addDays } from 'date-fns';

interface CampaignSchedulerProps {
  onSchedule: (startDate: Date, endDate: Date) => void;
}

export const CampaignScheduler: React.FC<CampaignSchedulerProps> = ({ onSchedule }) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleQuickSchedule = (type: 'week' | 'month') => {
    const start = new Date();
    const end = type === 'week' ? addWeeks(start, 1) : addDays(start, 30);
    setStartDate(start);
    setEndDate(end);
    onSchedule(start, end);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Tabs defaultValue="manual">
            <TabsList>
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="quick">Quick Schedule</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="rounded-md border"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="rounded-md border"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={() => handleQuickSchedule('week')} variant="outline">
              Schedule for 1 Week
            </Button>
            <Button onClick={() => handleQuickSchedule('month')} variant="outline">
              Schedule for 1 Month
            </Button>
          </div>

          {startDate && endDate && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm">
                Campaign will run from {format(startDate, 'PPP')} to {format(endDate, 'PPP')}
              </p>
            </div>
          )}

          <Button 
            onClick={() => startDate && endDate && onSchedule(startDate, endDate)}
            disabled={!startDate || !endDate}
          >
            Schedule Campaign
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignScheduler;
