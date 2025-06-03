
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FeatureStatus, DatabaseStatus, AccessLevel } from '../types';
import { CheckCircle, Clock, Circle } from 'lucide-react';

/**
 * Render a status badge with appropriate color (simplified to 3 states)
 */
export function renderStatusBadge(status: FeatureStatus) {
  switch(status) {
    case 'implemented':
      return <Badge className="bg-green-500 hover:bg-green-600">Implemented</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    case 'not_started':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>;
    default:
      return <Badge className="bg-gray-400 hover:bg-gray-500">Unknown</Badge>;
  }
}

/**
 * Render a status badge with icon for better visualization (simplified)
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
    case 'not_started':
      return (
        <Badge className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1">
          <Circle size={14} />
          <span>Not Started</span>
        </Badge>
      );
    default:
      return <Badge className="bg-gray-400 hover:bg-gray-500">Unknown</Badge>;
  }
}

/**
 * Helper to normalize database status values (simplified)
 */
export function getNormalizedDbStatus(feature: { databaseStatus?: DatabaseStatus; dbStatus?: DatabaseStatus }): DatabaseStatus {
  return feature.dbStatus || feature.databaseStatus || 'not_started';
}

/**
 * Render a database status badge with appropriate color (simplified)
 */
export function renderDatabaseStatusBadge(status: DatabaseStatus | undefined) {
  switch(status) {
    case 'complete':
      return <Badge variant="outline" className="border-green-500 text-green-700">Complete</Badge>;
    case 'in_progress':
      return <Badge variant="outline" className="border-blue-500 text-blue-700">In Progress</Badge>;
    case 'not_started':
    default:
      return <Badge variant="outline" className="border-gray-300 text-gray-500">Not Started</Badge>;
  }
}

/**
 * Get a label for attention status (simplified)
 */
export function getAttentionLabel(status: FeatureStatus): string | null {
  switch(status) {
    case 'not_started':
      return 'Needs Planning';
    case 'in_progress':
      return 'In Development';
    case 'implemented':
      return 'Ready';
    default:
      return null;
  }
}

/**
 * Get a status priority number (higher = needs more attention)
 */
export function getStatusPriority(status: FeatureStatus): number {
  switch(status) {
    case 'not_started': return 3;
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
      case 'partial': return 'text-purple-500';
      case 'full': return 'text-green-500';
      case 'write': return 'text-purple-500';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`${getColorClass()}`}>
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

/**
 * Get status color for UI elements
 */
export function getStatusColor(status: FeatureStatus): string {
  switch(status) {
    case 'implemented':
      return 'text-green-600';
    case 'in_progress':
      return 'text-blue-600';
    case 'not_started':
      return 'text-gray-600';
    default:
      return 'text-gray-400';
  }
}

/**
 * Get database status color for UI elements
 */
export function getDatabaseStatusColor(status: DatabaseStatus): string {
  switch(status) {
    case 'complete':
      return 'text-green-600';
    case 'in_progress':
      return 'text-blue-600';
    case 'not_started':
      return 'text-gray-600';
    default:
      return 'text-gray-400';
  }
}
