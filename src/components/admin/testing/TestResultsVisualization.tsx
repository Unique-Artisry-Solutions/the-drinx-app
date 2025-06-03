
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
    relationships: {
      validConstraints: number;
      totalConstraints: number;
      cacheHitRate: number;
    };
  };
}

const TestResultsVisualization: React.FC<TestResultsVisualizationProps> = ({ results }) => {
  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Database Relationships Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium mb-2">Constraint Validation</div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ 
                    width: `${(results.relationships.validConstraints / results.relationships.totalConstraints) * 100}%` 
                  }}
                />
              </div>
              <div className="text-sm mt-1">
                {results.relationships.validConstraints} / {results.relationships.totalConstraints} constraints valid
              </div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Cache Hit Rate</div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 bg-blue-500 rounded-full" 
                  style={{ width: `${results.relationships.cacheHitRate}%` }}
                />
              </div>
              <div className="text-sm mt-1">
                {results.relationships.cacheHitRate}% cache efficiency
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestResultsVisualization;
