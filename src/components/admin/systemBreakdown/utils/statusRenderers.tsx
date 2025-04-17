
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FeatureStatus, DatabaseStatus, AccessLevel } from '../types';
import { AlertCircle, Clock, CheckCircle, TimerIcon, AlertTriangle } from 'lucide-react';

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
 * Render a status badge with icon for better visualization
 */
export function renderStatusBadgeWithIcon(status: FeatureStatus) {
  switch(status) {
    case 'implemented':
      return (
        <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
          <CheckCircle size={14} />
          <span>Implemented</span>
        </Badge>
      );
    case 'in_progress':
      return (
        <Badge className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1">
          <Clock size={14} />
          <span>In Progress</span>
        </Badge>
      );
    case 'planned':
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1">
          <TimerIcon size={14} />
          <span>Planned</span>
        </Badge>
      );
    case 'blocked':
      return (
        <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
          <AlertCircle size={14} />
          <span>Blocked</span>
        </Badge>
      );
    case 'partial':
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
          <AlertTriangle size={14} />
          <span>Partial</span>
        </Badge>
      );
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
 * Get a label for attention status
 */
export function getAttentionLabel(status: FeatureStatus): string | null {
  switch(status) {
    case 'partial':
      return 'Needs Completion';
    case 'planned':
      return 'Not Started';
    case 'blocked':
      return 'Blocked - Urgent';
    case 'in_progress':
      return 'In Development';
    default:
      return null;
  }
}

/**
 * Get a status priority number (higher = needs more attention)
 */
export function getStatusPriority(status: FeatureStatus): number {
  switch(status) {
    case 'blocked': return 5;
    case 'planned': return 4;
    case 'partial': return 3;
    case 'in_progress': return 2;
    case 'implemented': return 1;
    default: return 0;
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
    <TooltipProvider>
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
    </TooltipProvider>
  );
}
