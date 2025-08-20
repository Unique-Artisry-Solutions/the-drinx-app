import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Activity, Zap, Shield } from 'lucide-react';
import { checkImpersonationHealth } from '@/utils/hardenedImpersonation';
import { impersonationStateManager } from '@/services/ImpersonationStateManager';
import { useToast } from '@/hooks/use-toast';

interface HealthStatus {
  healthy: boolean;
  issues: string[];
  autoHealed: boolean;
  actions: string[];
  lastCheck: number;
}

export const ImpersonationHealthMonitor: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);
  const { toast } = useToast();

  // Run health check
  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const result = await checkImpersonationHealth();
      setHealthStatus({
        ...result,
        lastCheck: Date.now()
      });

      if (result.autoHealed) {
        toast({
          title: "Auto-healed impersonation issues",
          description: `Fixed ${result.actions.length} issues automatically`,
        });
      }

      if (!result.healthy && result.issues.length > 0) {
        toast({
          title: "Impersonation health issues detected",
          description: `${result.issues.length} issues found`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('Health check failed:', error);
      toast({
        title: "Health check failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Manual state cleanup
  const performManualCleanup = () => {
    try {
      impersonationStateManager.clearAllState();
      toast({
        title: "State cleared",
        description: "All impersonation state has been cleared manually"
      });
      runHealthCheck(); // Re-check after cleanup
    } catch (error) {
      toast({
        title: "Cleanup failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  // Auto health check
  useEffect(() => {
    if (autoCheckEnabled) {
      const interval = setInterval(runHealthCheck, 30000); // Check every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoCheckEnabled]);

  // Initial health check
  useEffect(() => {
    runHealthCheck();
  }, []);

  const getHealthColor = () => {
    if (!healthStatus) return 'muted';
    return healthStatus.healthy ? 'success' : 'destructive';
  };

  const getHealthIcon = () => {
    if (isChecking) return <RefreshCw className="h-4 w-4 animate-spin" />;
    if (!healthStatus) return <Activity className="h-4 w-4" />;
    return healthStatus.healthy ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Impersonation Health Monitor
          <Badge variant={getHealthColor() as any}>
            {healthStatus?.healthy ? 'Healthy' : 'Issues Detected'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getHealthIcon()}
            <span className="text-sm">
              {isChecking ? 'Checking...' : 
               healthStatus?.healthy ? 'System healthy' : 
               `${healthStatus?.issues.length || 0} issues detected`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={runHealthCheck}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              Check Now
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAutoCheckEnabled(!autoCheckEnabled)}
            >
              <Activity className="h-4 w-4" />
              Auto: {autoCheckEnabled ? 'On' : 'Off'}
            </Button>
          </div>
        </div>

        {/* Last Check Time */}
        {healthStatus?.lastCheck && (
          <div className="text-xs text-muted-foreground">
            Last check: {new Date(healthStatus.lastCheck).toLocaleTimeString()}
          </div>
        )}

        {/* Issues */}
        {healthStatus?.issues && healthStatus.issues.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-destructive">Issues Found:</h4>
            <ul className="text-xs space-y-1">
              {healthStatus.issues.map((issue, index) => (
                <li key={index} className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3 text-destructive" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Auto-heal Actions */}
        {healthStatus?.autoHealed && healthStatus.actions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-success">Auto-heal Actions:</h4>
            <ul className="text-xs space-y-1">
              {healthStatus.actions.map((action, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Zap className="h-3 w-3 text-success" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Manual Actions */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium mb-2">Manual Actions:</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={performManualCleanup}
            >
              Clear All State
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>

        {/* State Information */}
        <div className="pt-4 border-t border-border">
          <details className="text-xs">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Current State Details
            </summary>
            <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
              {JSON.stringify(impersonationStateManager.getState(), null, 2)}
            </div>
          </details>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImpersonationHealthMonitor;