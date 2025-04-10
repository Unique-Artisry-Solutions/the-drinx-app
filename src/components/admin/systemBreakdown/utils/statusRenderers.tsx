
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, AlertTriangle, X, Users } from 'lucide-react';
import { FeatureStatus, DatabaseStatus, AccessLevel } from '../types';

/**
 * Renders a feature status badge with appropriate color and icon
 */
export const renderStatusBadge = (status: FeatureStatus) => {
  // Define badge variants based on status
  const variants: Record<FeatureStatus, { color: string; icon: React.ReactNode }> = {
    implemented: { color: 'bg-green-100 text-green-800', icon: <Check className="w-3 h-3 mr-1" /> },
    in_progress: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3 mr-1" /> },
    planned: { color: 'bg-gray-100 text-gray-800', icon: null },
    blocked: { color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="w-3 h-3 mr-1" /> },
    partial: { color: 'bg-amber-100 text-amber-800', icon: <Clock className="w-3 h-3 mr-1" /> }
  };
  
  const variant = variants[status] || variants.planned;
  
  return (
    <Badge className={variant.color} variant="outline">
      {variant.icon}
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
};

/**
 * Renders a database status badge with appropriate color
 */
export const renderDatabaseStatusBadge = (status: DatabaseStatus) => {
  // Define badge variants based on database status
  const variants: Record<DatabaseStatus, { color: string; icon: React.ReactNode }> = {
    implemented: { color: 'bg-green-100 text-green-800', icon: <Check className="w-3 h-3 mr-1" /> },
    in_progress: { color: 'bg-blue-100 text-blue-800', icon: <Clock className="w-3 h-3 mr-1" /> },
    not_started: { color: 'bg-gray-100 text-gray-800', icon: null },
    complete: { color: 'bg-green-100 text-green-800', icon: <Check className="w-3 h-3 mr-1" /> }
  };
  
  const variant = variants[status] || variants.not_started;
  
  return (
    <Badge className={variant.color} variant="outline">
      {variant.icon}
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
};

/**
 * Renders an icon representing access level
 */
export const renderAccessIcon = (accessLevel: AccessLevel) => {
  switch (accessLevel) {
    case 'full':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'write':
      return <Check className="h-5 w-5 text-blue-400" />;
    case 'read':
      return <Users className="h-5 w-5 text-gray-400" />;
    case 'none':
    default:
      return <X className="h-5 w-5 text-gray-300" />;
  }
};
