
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CohortData {
  cohort: string;
  users: number;
  retention: Record<string, number>;
}

interface CohortAnalysisProps {
  data: CohortData[];
}

export function CohortAnalysis({ data }: CohortAnalysisProps) {
  // Prepare data for visualization
  const preparedData = data.map(cohort => ({
    cohort: cohort.cohort,
    'Week 1': cohort.retention['Week 1'],
    'Week 2': cohort.retention['Week 2'],
    'Week 3': cohort.retention['Week 3'],
    'Week 4': cohort.retention['Week 4'],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cohort Retention Analysis</CardTitle>
        <CardDescription>User retention based on signup date</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={preparedData}
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} unit="%" />
              <YAxis dataKey="cohort" type="category" width={80} />
              <Tooltip formatter={(value) => [`${value}%`, 'Retention']} />
              <Legend />
              <Bar dataKey="Week 1" fill="#8884d8" name="Week 1" />
              <Bar dataKey="Week 2" fill="#83a6ed" name="Week 2" />
              <Bar dataKey="Week 3" fill="#8dd1e1" name="Week 3" />
              <Bar dataKey="Week 4" fill="#82ca9d" name="Week 4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="overflow-x-auto mt-6 bg-card rounded-md border">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-4 py-3 text-left">Cohort</th>
                <th className="px-4 py-3 text-left">Users</th>
                <th className="px-4 py-3 text-left">Week 1</th>
                <th className="px-4 py-3 text-left">Week 2</th>
                <th className="px-4 py-3 text-left">Week 3</th>
                <th className="px-4 py-3 text-left">Week 4</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cohort) => (
                <tr key={cohort.cohort} className="border-b">
                  <td className="px-4 py-3">{cohort.cohort}</td>
                  <td className="px-4 py-3">{cohort.users}</td>
                  <td className="px-4 py-3">{cohort.retention['Week 1']}%</td>
                  <td className="px-4 py-3">{cohort.retention['Week 2']}%</td>
                  <td className="px-4 py-3">{cohort.retention['Week 3']}%</td>
                  <td className="px-4 py-3">{cohort.retention['Week 4']}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
