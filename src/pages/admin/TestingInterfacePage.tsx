
import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, PlayCircle, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import TestResultsVisualization from '@/components/admin/testing/TestResultsVisualization';
import TestControls from '@/components/admin/testing/TestControls';
import TestReportSection from '@/components/admin/testing/TestReportSection';

const TestingInterfacePage = () => {
  const { toast } = useToast();
  
  const { data: testResults, isLoading, refetch } = useQuery({
    queryKey: ['testResults'],
    queryFn: async () => {
      // Simulated test results - replace with actual API call
      return {
        totalTests: 156,
        passed: 142,
        failed: 8,
        skipped: 6,
        performance: {
          avgResponseTime: 245,
          p95ResponseTime: 450,
          maxResponseTime: 850
        },
        relationships: {
          validConstraints: 24,
          totalConstraints: 26,
          invalidConstraints: 2,
          cacheHitRate: 92,
          validationDetails: [
            "Foreign key constraint violation: user_rewards.tier_id references non-existent reward_tiers.id",
            "Uniqueness constraint violation: duplicate entries in user_loyalty_points"
          ]
        }
      };
    }
  });

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader onLogout={() => {}} />
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Testing Interface</h1>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => {
                toast({
                  title: "Starting test run",
                  description: "Test execution has been initiated"
                });
              }}
            >
              <PlayCircle className="h-4 w-4" />
              Run Tests
            </Button>
          </div>
        </div>

        {testResults && !isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testResults.totalTests}</div>
                </CardContent>
              </Card>
              <Card className="bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Passed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Failed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Skipped</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-600">{testResults.skipped}</div>
                </CardContent>
              </Card>
            </div>

            <TestControls />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <TestResultsVisualization results={testResults} />
              <TestReportSection results={testResults} />
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TestingInterfacePage;
