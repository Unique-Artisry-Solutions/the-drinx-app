
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Code, Database } from 'lucide-react';
import { FeatureItem } from '../types';

interface FeatureImplementationStatusProps {
  feature: FeatureItem;
}

export const FeatureImplementationStatus: React.FC<FeatureImplementationStatusProps> = ({ feature }) => {
  // Calculate UI implementation progress
  const uiStatus = feature.status;
  const uiProgress = feature.implementationProgress || (
    uiStatus === 'implemented' ? 100 :
    uiStatus === 'partial' ? 65 :
    uiStatus === 'in_progress' ? 45 :
    uiStatus === 'blocked' ? 30 : 10
  );

  // Get database implementation status
  const dbStatus = feature.dbStatus || feature.databaseStatus || 'not_started';
  const dbProgress = 
    dbStatus === 'complete' || dbStatus === 'implemented' ? 100 :
    dbStatus === 'in_progress' ? 50 :
    dbStatus === 'not_started' ? 0 : 25;

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'implemented':
      case 'complete':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'partial':
        return 'Partial';
      case 'blocked':
        return 'Blocked';
      case 'not_started':
        return 'Not Started';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case 'implemented':
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'partial':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'not_started':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">UI Implementation</span>
          </div>
          <Badge className={getStatusColorClass(uiStatus)}>
            {getStatusLabel(uiStatus)}
          </Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Progress value={uiProgress} className="h-2" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>UI Implementation: {uiProgress}% complete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Database Implementation</span>
          </div>
          <Badge className={getStatusColorClass(dbStatus)}>
            {getStatusLabel(dbStatus)}
          </Badge>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative">
                <Progress value={dbProgress} className="h-2" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Database Implementation: {dbProgress}% complete</p>
              {dbStatus === 'not_started' && feature.status === 'in_progress' && (
                <p className="text-xs text-amber-600 mt-1">
                  UI development started before database implementation
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
