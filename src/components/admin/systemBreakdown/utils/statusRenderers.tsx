
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { FeatureItem, DatabaseStatus, AccessLevel } from '../types';

/**
 * Returns a badge component based on the feature status
 */
export function renderStatusBadge(status: string) {
  switch(status) {
    case 'implemented':
      return <Badge className="bg-green-500 hover:bg-green-600">Implemented</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    case 'partial':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>;
    case 'planned':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Planned</Badge>;
    case 'blocked':
      return <Badge className="bg-red-500 hover:bg-red-600">Blocked</Badge>;
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
  }
}

/**
 * Returns a badge component based on the database status
 */
export function renderDatabaseStatusBadge(status: string) {
  switch(status) {
    case 'completed':
      return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
    case 'in_progress':
      return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>;
    case 'partial':
      return <Badge className="bg-amber-500 hover:bg-amber-600">Partial</Badge>;
    case 'not_started':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Not Started</Badge>;
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
  }
}

/**
 * Returns an icon component based on the access level
 */
export function renderAccessIcon(access: string) {
  switch(access) {
    case 'full':
      return <ShieldCheck className="h-5 w-5 text-green-500" />;
    case 'partial':
      return <ShieldAlert className="h-5 w-5 text-amber-500" />;
    case 'none':
      return <ShieldX className="h-5 w-5 text-red-500" />;
    default:
      return <Shield className="h-5 w-5 text-gray-500" />;
  }
}

/**
 * Converts database status to a standardized format
 */
export function getNormalizedDbStatus(feature: FeatureItem): 'completed' | 'in_progress' | 'not_started' {
  if (!feature.databaseStatus) {
    return 'not_started';
  }
  
  if (feature.databaseStatus === 'completed' || feature.databaseStatus === 'implemented') {
    return 'completed';
  }
  
  if (feature.databaseStatus === 'in_progress' || feature.databaseStatus === 'partial') {
    return 'in_progress';
  }
  
  return 'not_started';
}

/**
 * Determines access level text based on the access level
 */
export function getAccessLevelText(accessLevel: AccessLevel | undefined): string {
  switch(accessLevel) {
    case 'full':
      return 'Full Access';
    case 'partial':
      return 'Partial Access';
    case 'none':
      return 'No Access';
    default:
      return 'Unknown';
  }
}

/**
 * Determines access color based on the access level
 */
export function getAccessLevelColor(accessLevel: AccessLevel | undefined): string {
  switch(accessLevel) {
    case 'full':
      return 'text-green-500';
    case 'partial':
      return 'text-amber-500';
    case 'none':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}
