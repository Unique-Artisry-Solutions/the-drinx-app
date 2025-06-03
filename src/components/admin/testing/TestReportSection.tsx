
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestReportSectionProps {
  results: {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    performance: {
      avgResponseTime: number;
      p95ResponseTime: number;
      maxResponseTime: number;
    };
    relationships: {
      validConstraints: number;
      invalidConstraints: number;
      cacheHitRate: number;
      validationDetails: string[];
    };
  };
}

const TestReportSection: React.FC<TestReportSectionProps> = ({ results }) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      title: "Downloading report",
      description: "Your test report is being generated and will download shortly"
    });
    
    const report = JSON.stringify(results, null, 2);
    const blob = new Blob([report], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test-report.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Test Report</CardTitle>
        <Button onClick={handleDownloadReport} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Total Tests: {results.totalTests}</li>
            <li className="text-green-600">Passed: {results.passed}</li>
            <li className="text-red-600">Failed: {results.failed}</li>
            <li className="text-gray-600">Skipped: {results.skipped}</li>
          </ul>
          
          <h3 className="text-lg font-semibold mt-4 mb-2">Performance Metrics</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Average Response Time: {results.performance.avgResponseTime}ms</li>
            <li>95th Percentile: {results.performance.p95ResponseTime}ms</li>
            <li>Maximum Response Time: {results.performance.maxResponseTime}ms</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4 mb-2">Relationship Validation</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Valid Constraints: {results.relationships.validConstraints}</li>
            <li>Invalid Constraints: {results.relationships.invalidConstraints}</li>
            <li>Cache Hit Rate: {results.relationships.cacheHitRate}%</li>
          </ul>

          {results.relationships.validationDetails.length > 0 && (
            <div className="mt-4">
              <h4 className="text-md font-semibold mb-2">Validation Details:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {results.relationships.validationDetails.map((detail, index) => (
                  <li key={index} className="text-sm">{detail}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestReportSection;
