
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Clock, Database, GitBranch, LayoutGrid } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const Phase2Planning: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-blue-500" />
            Phase 2: Planning
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Detailed project planning and resource allocation for promoter system development.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Technical Architecture</h3>
              <p className="text-xs text-gray-600">Designed system architecture with scalability considerations for high-volume event traffic</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Database Schema Design</h3>
              <p className="text-xs text-gray-600">Created database schemas for promoter profiles, events, communications, and analytics</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">API Endpoint Planning</h3>
              <p className="text-xs text-gray-600">Defined RESTful API endpoints for all promoter system functionalities</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Resource Allocation</h3>
              <p className="text-xs text-gray-600">Estimated resource requirements and allocated development team capacity</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium">Implementation Timeline</h3>
              <p className="text-xs text-gray-600">Created phased implementation timeline with milestones for feature delivery</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium mb-2">Key Planning Artifacts</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <h5 className="text-xs font-medium">Database Schema</h5>
              </div>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Tables Created</span>
                  <span className="text-xs font-medium">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Relationships</span>
                  <span className="text-xs font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Indexes</span>
                  <span className="text-xs font-medium">24</span>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-blue-600" />
                <h5 className="text-xs font-medium">API Endpoints</h5>
              </div>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Event Management</span>
                  <span className="text-xs font-medium">12 endpoints</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Communication</span>
                  <span className="text-xs font-medium">8 endpoints</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-700">Analytics</span>
                  <span className="text-xs font-medium">6 endpoints</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Phase2Planning;
