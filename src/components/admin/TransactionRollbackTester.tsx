import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Database,
  Shield,
  RefreshCw
} from 'lucide-react';
import { transactionRollbackService, RollbackTestResult } from '@/services/TransactionRollbackService';
import { useToast } from '@/hooks/use-toast';

export const TransactionRollbackTester: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState<string>('');
  const [results, setResults] = useState<RollbackTestResult[]>([]);
  const [integrityStatus, setIntegrityStatus] = useState<{
    isValid: boolean;
    issues: string[];
    lastChecked?: Date;
  } | null>(null);
  const { toast } = useToast();

  const scenarios = transactionRollbackService.getScenarios();

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    try {
      const totalScenarios = scenarios.length;
      let completedScenarios = 0;
      const testResults: RollbackTestResult[] = [];
      
      for (const scenario of scenarios) {
        setCurrentTest(scenario.name);
        
        // Set test to running
        const runningResult: RollbackTestResult = {
          id: scenario.id,
          name: scenario.name,
          status: 'running'
        };
        testResults.push(runningResult);
        setResults([...testResults]);
        
        try {
          const result = await transactionRollbackService.runTest(scenario.id);
          
          // Update result
          const updatedResults = testResults.map(r => 
            r.id === scenario.id ? result : r
          );
          testResults.splice(testResults.findIndex(r => r.id === scenario.id), 1, result);
          setResults([...testResults]);
          
          completedScenarios++;
          setProgress((completedScenarios / totalScenarios) * 100);
          
          // Show toast for failed tests
          if (result.status === 'failed') {
            toast({
              title: 'Test Failed',
              description: `${result.name}: ${result.error}`,
              variant: 'destructive'
            });
          }
          
        } catch (error) {
          const failedResult: RollbackTestResult = {
            id: scenario.id,
            name: scenario.name,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          };
          
          const updatedResults = testResults.map(r => 
            r.id === scenario.id ? failedResult : r
          );
          testResults.splice(testResults.findIndex(r => r.id === scenario.id), 1, failedResult);
          setResults([...testResults]);
          
          completedScenarios++;
          setProgress((completedScenarios / totalScenarios) * 100);
        }
      }
      
      toast({
        title: 'Rollback Tests Completed',
        description: `${testResults.filter(r => r.status === 'passed').length}/${totalScenarios} tests passed`
      });
      
    } catch (error) {
      toast({
        title: 'Test Suite Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const runSingleTest = async (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return;

    setCurrentTest(scenario.name);
    
    // Update result to running
    const updatedResults = results.map(r => 
      r.id === scenarioId ? { ...r, status: 'running' as const } : r
    );
    setResults(updatedResults);
    
    try {
      const result = await transactionRollbackService.runTest(scenarioId);
      
      // Update with actual result
      const finalResults = results.map(r => 
        r.id === scenarioId ? result : r
      );
      setResults(finalResults);
      
      if (result.status === 'failed') {
        toast({
          title: 'Test Failed',
          description: `${result.name}: ${result.error}`,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Test Passed',
          description: result.name,
        });
      }
      
    } catch (error) {
      const failedResult: RollbackTestResult = {
        id: scenarioId,
        name: scenario.name,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      
      const finalResults = results.map(r => 
        r.id === scenarioId ? failedResult : r
      );
      setResults(finalResults);
      
      toast({
        title: 'Test Failed',
        description: failedResult.error,
        variant: 'destructive'
      });
    } finally {
      setCurrentTest('');
    }
  };

  const validateIntegrity = async () => {
    try {
      const result = await transactionRollbackService.validateDatabaseIntegrity();
      setIntegrityStatus({
        ...result,
        lastChecked: new Date()
      });
      
      if (result.isValid) {
        toast({
          title: 'Database Integrity Valid',
          description: 'All integrity checks passed'
        });
      } else {
        toast({
          title: 'Integrity Issues Found',
          description: `${result.issues.length} issues detected`,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Integrity Check Failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive'
      });
    }
  };

  const resetTests = () => {
    setResults([]);
    setProgress(0);
    setCurrentTest('');
    setIntegrityStatus(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.pending}>
        {status}
      </Badge>
    );
  };

  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const totalTests = scenarios.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Transaction Rollback Testing
          </CardTitle>
          <CardDescription>
            Comprehensive database transaction rollback testing and validation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run All Tests
            </Button>
            <Button 
              variant="outline" 
              onClick={validateIntegrity}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Check Integrity
            </Button>
            <Button 
              variant="outline" 
              onClick={resetTests}
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentTest && (
                <p className="text-sm text-muted-foreground">
                  Currently running: {currentTest}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{passedTests}</div>
              <p className="text-muted-foreground">Passed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{failedTests}</div>
              <p className="text-muted-foreground">Failed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalTests}</div>
              <p className="text-muted-foreground">Total Tests</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Integrity Status */}
      {integrityStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Database Integrity Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              {integrityStatus.isValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={integrityStatus.isValid ? 'text-green-700' : 'text-red-700'}>
                {integrityStatus.isValid ? 'All checks passed' : `${integrityStatus.issues.length} issues found`}
              </span>
            </div>
            {integrityStatus.issues.length > 0 && (
              <ul className="text-sm text-muted-foreground space-y-1">
                {integrityStatus.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertCircle className="h-3 w-3 mt-1 flex-shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            )}
            {integrityStatus.lastChecked && (
              <p className="text-xs text-muted-foreground mt-2">
                Last checked: {integrityStatus.lastChecked.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {scenarios.map((scenario) => {
          const result = results.find(r => r.id === scenario.id);
          
          return (
            <Card key={scenario.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {result && getStatusIcon(result.status)}
                  {scenario.name}
                </CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => runSingleTest(scenario.id)}
                      disabled={isRunning}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Run Test
                    </Button>
                    {result && (
                      <div className="flex items-center gap-2">
                        {result.duration && (
                          <span className="text-xs text-muted-foreground">
                            {result.duration}ms
                          </span>
                        )}
                        {getStatusBadge(result.status)}
                      </div>
                    )}
                  </div>
                  
                  {result?.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                  
                  {result?.details && (
                    <div className="text-xs text-muted-foreground">
                      <details>
                        <summary className="cursor-pointer">Test Details</summary>
                        <pre className="mt-1 p-2 bg-gray-50 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};