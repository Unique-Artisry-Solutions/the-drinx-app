
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
  };
}

const TestReportSection: React.FC<TestReportSectionProps> = ({ results }) => {
  const { toast } = useToast();

  const handleDownloadReport = () => {
    toast({
      title: "Downloading report",
      description: "Your test report is being generated and will download shortly"
    });
    
    // Simulated report generation - replace with actual implementation
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
        </div>
      </CardContent>
    </Card>
  );
};

export default TestReportSection;
