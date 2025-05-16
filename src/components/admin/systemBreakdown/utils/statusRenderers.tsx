import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, HelpCircle, AlertTriangle, Shield, User, Lock } from 'lucide-react';
import { FeatureStatus, DatabaseStatus, FeatureItem, AccessLevel } from '../types';

export const renderStatusIcon = (status: FeatureStatus): React.ReactNode => {
  switch (status) {
    case 'implemented':
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'in_progress':
    case 'partial':
      return <Clock className="h-4 w-4 text-blue-500" />;
    case 'blocked':
    case 'on-hold':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'planned':
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
    case 'testing':
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-500" />;
  }
};

export const renderStatusBadge = (status: FeatureStatus | string): React.ReactNode => {
  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'implemented':
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'in_progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'partial':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'blocked':
    case 'on-hold':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'planned':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    case 'testing':
      bgColor = 'bg-purple-100';
      textColor = 'text-purple-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  return (
    <Badge className={`${bgColor} ${textColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </Badge>
  );
};

export const renderDatabaseStatusBadge = (status?: DatabaseStatus | string): React.ReactNode => {
  if (!status) return null;

  let bgColor = '';
  let textColor = '';

  switch (status) {
    case 'complete':
    case 'implemented':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      break;
    case 'in_progress':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      break;
    case 'partial':
      bgColor = 'bg-amber-100';
      textColor = 'text-amber-800';
      break;
    case 'blocked':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      break;
    case 'not_started':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
  }

  const label = status === 'complete' || status === 'implemented' ? 'Complete' : 
               status === 'in_progress' ? 'In Progress' : 
               status === 'partial' ? 'Partial' : 
               status === 'blocked' ? 'Blocked' : 'Not Started';

  return (
    <Badge className={`${bgColor} ${textColor} ml-2`}>
      DB: {label}
    </Badge>
  );
};

// Update the renderAccessIcon function to use aria-label instead of title
export const renderAccessIcon = (access?: AccessLevel): React.ReactNode => {
  if (!access || access === 'none') {
    return <Lock className="h-4 w-4 text-gray-400" aria-label="No Access" />;
  }
  
  switch (access) {
    case 'read':
      return <User className="h-4 w-4 text-blue-500" aria-label="Read Access" />;
    case 'write':
      return <User className="h-4 w-4 text-green-500" aria-label="Write Access" />;
    case 'full':
      return <Shield className="h-4 w-4 text-purple-500" aria-label="Full Access" />;
    default:
      return <Lock className="h-4 w-4 text-gray-400" aria-label="No Access" />;
  }
};

// Additional utility functions for status handling
export const getStatusPriority = (status: FeatureStatus): number => {
  switch (status) {
    case 'blocked': return 0;
    case 'on-hold': return 1;
    case 'in_progress': return 2;
    case 'testing': return 3;
    case 'partial': return 4;
    case 'planned': return 5;
    case 'implemented': return 6;
    case 'completed': return 7;
    default: return 8;
  }
};

export const getAttentionLabel = (status: FeatureStatus): string => {
  switch (status) {
    case 'blocked': return 'Needs immediate attention';
    case 'on-hold': return 'Waiting for decision';
    case 'in_progress': return 'Currently being developed';
    case 'testing': return 'In testing phase';
    case 'partial': return 'Partially implemented';
    case 'planned': return 'Scheduled for development';
    case 'implemented': return 'Fully implemented';
    case 'completed': return 'Completed and verified';
    default: return 'Status unknown';
  }
};
