
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CohortData {
  cohort: string;
  week0: number;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

export function CohortAnalysis() {
  const [timeframe, setTimeframe] = useState('weekly');

  // Mock cohort data - preserved as placeholder
  const cohortData: CohortData[] = [
    { cohort: 'Jan 2024', week0: 100, week1: 85, week2: 72, week3: 68, week4: 65 },
    { cohort: 'Feb 2024', week0: 100, week1: 88, week2: 75, week3: 71, week4: 68 },
    { cohort: 'Mar 2024', week0: 100, week1: 82, week2: 69, week3: 64, week4: 62 }
  ];

  const getRetentionColor = (retention: number) => {
    if (retention >= 80) return 'bg-green-500';
    if (retention >= 60) return 'bg-yellow-500';
    if (retention >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Cohort Analysis</CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-6 gap-2 text-sm font-medium">
            <div>Cohort</div>
            <div>Week 0</div>
            <div>Week 1</div>
            <div>Week 2</div>
            <div>Week 3</div>
            <div>Week 4</div>
          </div>
          
          {cohortData.map((cohort) => (
            <div key={cohort.cohort} className="grid grid-cols-6 gap-2 text-sm">
              <div className="font-medium">{cohort.cohort}</div>
              <Badge variant="outline">{cohort.week0}%</Badge>
              <div className={`h-6 rounded flex items-center justify-center text-white text-xs ${getRetentionColor(cohort.week1)}`}>
                {cohort.week1}%
              </div>
              <div className={`h-6 rounded flex items-center justify-center text-white text-xs ${getRetentionColor(cohort.week2)}`}>
                {cohort.week2}%
              </div>
              <div className={`h-6 rounded flex items-center justify-center text-white text-xs ${getRetentionColor(cohort.week3)}`}>
                {cohort.week3}%
              </div>
              <div className={`h-6 rounded flex items-center justify-center text-white text-xs ${getRetentionColor(cohort.week4)}`}>
                {cohort.week4}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
