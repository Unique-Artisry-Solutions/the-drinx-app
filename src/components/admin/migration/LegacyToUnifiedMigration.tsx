
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Database, 
  Table, 
  BarChart3,
  Settings
} from 'lucide-react';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  component: 'legacy' | 'unified';
}

export const LegacyToUnifiedMigration: React.FC = () => {
  const [migrationSteps] = useState<MigrationStep[]>([
    {
      id: 'tables',
      title: 'Data Tables',
      description: 'Migrate from legacy EstablishmentsTable/CocktailsTable to unified AdminDataTable',
      status: 'completed',
      component: 'unified'
    },
    {
      id: 'services',
      title: 'Data Services',
      description: 'Replace direct API calls with unified BaseAdminService pattern',
      status: 'completed',
      component: 'unified'
    },
    {
      id: 'state',
      title: 'State Management',
      description: 'Migrate from basic useState to useAdminService hook pattern',
      status: 'completed',
      component: 'unified'
    },
    {
      id: 'charts',
      title: 'Charts & Stats',
      description: 'Replace custom stat cards with reusable AdminStatsCard component',
      status: 'completed',
      component: 'unified'
    }
  ]);

  const getStatusIcon = (status: MigrationStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <Circle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: MigrationStep['status']) => {
    const variants = {
      completed: 'default',
      'in-progress': 'secondary',
      error: 'destructive',
      pending: 'outline'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const completedSteps = migrationSteps.filter(step => step.status === 'completed').length;
  const totalSteps = migrationSteps.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Legacy to Unified Migration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Migration completed successfully! All components have been updated to use the new unified admin system.
              </AlertDescription>
            </Alert>

            <div className="flex items-center justify-between text-sm">
              <span>Migration Progress</span>
              <span className="font-medium">{completedSteps}/{totalSteps} completed</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(completedSteps / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {migrationSteps.map((step, index) => (
          <Card key={step.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(step.status)}
                  <div>
                    <h3 className="font-medium">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(step.status)}
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">Legacy</Badge>
                    <ArrowRight className="h-3 w-3" />
                    <Badge variant="default">Unified</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Unified System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Consistent APIs</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                All admin services follow the same pattern with standardized CRUD operations
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Table className="h-4 w-4 text-green-600" />
                <span className="font-medium">Reusable Components</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Single AdminDataTable component handles all entity types with configuration
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Better State Management</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                useAdminService hook provides caching, error handling, and optimistic updates
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Type Safety</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                Full TypeScript support with proper interfaces and type checking
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
