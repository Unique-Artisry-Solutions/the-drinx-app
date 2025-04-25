
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export const RolloutTimeline: React.FC = () => {
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-sm font-medium mb-2">Rollout Status</h3>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Beta Testing in Progress</p>
            <p className="text-sm text-gray-500">
              Currently being tested with a select group of 15 promoters. Gathering feedback on communication system and event creation workflow.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 bg-blue-50 p-3 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">Launch Timeline</h4>
        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span>Alpha Testing</span>
            <Badge className="bg-green-100 text-green-800">Completed</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Beta Program</span>
            <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Feature Freeze</span>
            <Badge className="bg-gray-100 text-gray-800">Sep 2025</Badge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span>Public Launch</span>
            <Badge className="bg-gray-100 text-gray-800">Oct 2025</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};
