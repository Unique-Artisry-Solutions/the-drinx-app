
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CohortAnalysis = () => {
  const [selectedCohort, setSelectedCohort] = useState('new_users');
  const [selectedMetric, setSelectedMetric] = useState('retention_rate');

  const cohortOptions = [
    { value: 'new_users', label: 'New Users' },
    { value: 'active_users', label: 'Active Users' },
    { value: 'paying_users', label: 'Paying Users' },
  ];

  const metricOptions = [
    { value: 'retention_rate', label: 'Retention Rate' },
    { value: 'conversion_rate', label: 'Conversion Rate' },
    { value: 'average_spend', label: 'Average Spend' },
  ];

  // Mock data for cohort analysis with proper typing
  const cohortData: Record<string, Record<string, number[]>> = {
    new_users: {
      retention_rate: [65, 55, 45, 35, 25, 15],
      conversion_rate: [5, 8, 12, 15, 18, 20],
      average_spend: [10, 15, 20, 25, 30, 35],
    },
    active_users: {
      retention_rate: [80, 75, 70, 65, 60, 55],
      conversion_rate: [10, 14, 18, 22, 26, 30],
      average_spend: [20, 28, 36, 44, 52, 60],
    },
    paying_users: {
      retention_rate: [90, 85, 80, 75, 70, 65],
      conversion_rate: [20, 25, 30, 35, 40, 45],
      average_spend: [50, 60, 70, 80, 90, 100],
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cohort Analysis</CardTitle>
          <CardDescription>
            Analyze user behavior based on cohorts and metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Cohort
              </label>
              <Select value={selectedCohort} onValueChange={setSelectedCohort}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cohort" />
                </SelectTrigger>
                <SelectContent>
                  {cohortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Metric
              </label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metricOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">
              {cohortOptions.find(o => o.value === selectedCohort)?.label} - {metricOptions.find(m => m.value === selectedMetric)?.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {cohortData[selectedCohort]?.[selectedMetric]?.join(', ') || 'No data available'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortAnalysis;
