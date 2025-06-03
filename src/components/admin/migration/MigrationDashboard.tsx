
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  SkipForward
} from 'lucide-react';
import { useAdminMigration, type MigrationStep } from '@/hooks/admin/useAdminMigration';

const getStatusIcon = (status: MigrationStep['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-600 animate-pulse" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: MigrationStep['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'error':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const MigrationDashboard: React.FC = () => {
  const { state, actions } = useAdminMigration();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Admin System Migration</span>
            <div className="flex gap-2">
              {!state.isRunning ? (
                <Button onClick={actions.startMigration} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Start Migration
                </Button>
              ) : (
                <Button onClick={actions.pauseMigration} variant="outline" size="sm">
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button onClick={actions.resetMigration} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{state.overallProgress}%</span>
              </div>
              <Progress value={state.overallProgress} className="h-2" />
            </div>
            
            <div className="text-sm text-gray-600">
              {state.isRunning ? 'Migration in progress...' : 'Migration paused'}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {state.steps.map((step) => (
          <Card key={step.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <Badge className={getStatusColor(step.status)}>
                        {step.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {step.description}
                    </p>
                    {step.dependencies && (
                      <div className="text-xs text-gray-500">
                        Dependencies: {step.dependencies.join(', ')}
                      </div>
                    )}
                    <div className="mt-2">
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 ml-4">
                  {step.status === 'error' && (
                    <Button 
                      onClick={() => actions.retryStep(step.id)}
                      variant="outline" 
                      size="sm"
                    >
                      Retry
                    </Button>
                  )}
                  {step.status === 'pending' && (
                    <Button 
                      onClick={() => actions.skipStep(step.id)}
                      variant="ghost" 
                      size="sm"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MigrationDashboard;
