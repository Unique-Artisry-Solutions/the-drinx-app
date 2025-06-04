
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { runRouteTests, testMobileNavigation, routeTestSuites } from '@/utils/routeTesting';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';

const RouteTestRunner: React.FC = () => {
  const { isDevelopment } = useDevelopmentMode();
  const [testResults, setTestResults] = useState<any>(null);
  const [mobileResults, setMobileResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isDevelopment) return null;

  const runTests = async () => {
    setIsRunning(true);
    
    // Run route validation tests
    const routeResults = runRouteTests();
    setTestResults(routeResults);
    
    // Run mobile compatibility tests
    const mobileTestResults = testMobileNavigation();
    setMobileResults(mobileTestResults);
    
    setIsRunning(false);
  };

  const getStatusBadge = (passed: boolean) => (
    <Badge variant={passed ? "default" : "destructive"} className="ml-2">
      {passed ? (
        <><CheckCircle className="w-3 h-3 mr-1" /> Pass</>
      ) : (
        <><XCircle className="w-3 h-3 mr-1" /> Fail</>
      )}
    </Badge>
  );

  return (
    <Card className="mt-8 border-2 border-blue-300 bg-blue-50">
      <CardHeader>
        <CardTitle className="text-base text-blue-800 flex items-center gap-2">
          🧪 Route Protection Test Suite
        </CardTitle>
        <CardDescription className="text-sm text-blue-700">
          Comprehensive testing for route protection, bypass flows, and mobile compatibility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>

          {testResults && (
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="details">Test Details</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Tests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-600">
                        {testResults.passed}
                      </div>
                      <p className="text-sm text-muted-foreground">Tests Passed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-600">
                        {testResults.failed}
                      </div>
                      <p className="text-sm text-muted-foreground">Tests Failed</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold">Test Suites Overview</h4>
                  {routeTestSuites.map(suite => {
                    const suiteResults = testResults.results.filter((r: any) => r.suite === suite.name);
                    const suitePassed = suiteResults.filter((r: any) => r.passed).length;
                    const suiteTotal = suiteResults.length;
                    const allPassed = suitePassed === suiteTotal;
                    
                    return (
                      <div key={suite.name} className="flex items-center justify-between p-2 bg-white rounded border">
                        <span className="font-medium">{suite.name}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-muted-foreground mr-2">
                            {suitePassed}/{suiteTotal}
                          </span>
                          {getStatusBadge(allPassed)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {testResults.results.map((result: any, index: number) => (
                    <div key={index} className={`p-3 rounded border ${
                      result.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{result.test}</div>
                          <div className="text-xs text-muted-foreground">
                            {result.path} - {result.context.userType || 'anonymous'}
                          </div>
                        </div>
                        {getStatusBadge(result.passed)}
                      </div>
                      {!result.passed && (
                        <div className="mt-2 text-xs">
                          <div className="text-red-600">
                            Expected: valid={result.expected.valid?.toString()}, redirect={result.expected.redirect || 'none'}
                          </div>
                          <div className="text-gray-600">
                            Actual: valid={result.actual.valid?.toString()}, redirect={result.actual.redirect || 'none'}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="mobile" className="space-y-4">
                {mobileResults && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">Mobile Compatibility</h4>
                      {getStatusBadge(mobileResults.compatible)}
                    </div>
                    
                    {mobileResults.issues.length > 0 && (
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Issues Found:</h5>
                        {mobileResults.issues.map((issue: string, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-orange-600">
                            <AlertCircle className="w-4 h-4" />
                            {issue}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {mobileResults.compatible && (
                      <div className="text-sm text-green-600">
                        ✅ All mobile compatibility checks passed
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RouteTestRunner;
