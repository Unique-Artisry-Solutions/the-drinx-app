
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsLineChart from '@/components/charts/AnalyticsLineChart';

interface TestResultsVisualizationProps {
  results: {
    performance: {
      avgResponseTime: number;
      p95ResponseTime: number;
      maxResponseTime: number;
    };
  };
}

const TestResultsVisualization: React.FC<TestResultsVisualizationProps> = ({ results }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Performance Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <AnalyticsLineChart
            title=""
            data={[
              { name: '1h ago', time: '1h ago', value: results.performance.avgResponseTime - 20 },
              { name: '45m ago', time: '45m ago', value: results.performance.avgResponseTime - 10 },
              { name: '30m ago', time: '30m ago', value: results.performance.avgResponseTime },
              { name: '15m ago', time: '15m ago', value: results.performance.p95ResponseTime },
              { name: 'Now', time: 'Now', value: results.performance.maxResponseTime }
            ]}
            series={[
              { key: 'value', name: 'Response Time (ms)', color: '#8884d8' }
            ]}
            height={300}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TestResultsVisualization;
