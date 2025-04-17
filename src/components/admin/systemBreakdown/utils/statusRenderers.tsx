
// Make sure we're preserving the existing implementation but just checking the function signatures
// If this file exists and is correct, this won't change anything
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FeatureStatus, DatabaseStatus, AccessLevel } from '../types';

/**
 * Render a status badge with appropriate color
 */
export function renderStatusBadge(status: FeatureStatus) {
  switch(status) {
    case 'implemented':
      return <Badge className="bg-green-500 hover:bg-green-600">Implemented</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    case 'planned':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Planned</Badge>;
    case 'blocked':
      return <Badge className="bg-red-500 hover:bg-red-600">Blocked</Badge>;
    case 'partial':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>;
    default:
      return <Badge className="bg-gray-400 hover:bg-gray-500">Unknown</Badge>;
  }
}

/**
 * Helper to normalize database status values
 */
export function getNormalizedDbStatus(feature: { databaseStatus?: DatabaseStatus; dbStatus?: DatabaseStatus }): DatabaseStatus {
  return feature.dbStatus || feature.databaseStatus || 'not_started';
}

/**
 * Render a database status badge with appropriate color
 */
export function renderDatabaseStatusBadge(status: DatabaseStatus | undefined) {
  switch(status) {
    case 'complete':
    case 'implemented':
      return <Badge variant="outline" className="border-green-500 text-green-700">Complete</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="border-blue-500 text-blue-700">In Progress</Badge>;
    case 'not_started':
    default:
      return <Badge variant="outline" className="border-gray-300 text-gray-500">Not Started</Badge>;
  }
}

/**
 * Render an icon for access level with tooltip
 */
export function renderAccessIcon(access: AccessLevel | undefined) {
  if (!access || access === 'none') return null;
  
  const getColorClass = () => {
    switch(access) {
      case 'read': return 'text-blue-500';
      case 'write': return 'text-purple-500';
      case 'full': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`${getColorClass()}`}>
          {/* Icon here */}
          <span className="text-xs">{access.charAt(0).toUpperCase()}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{access} access</p>
      </TooltipContent>
    </Tooltip>
  );
}
