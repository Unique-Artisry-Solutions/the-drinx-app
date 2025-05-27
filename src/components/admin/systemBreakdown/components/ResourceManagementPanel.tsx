
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Server, DollarSign, Gauge } from 'lucide-react';

interface ResourceManagementPanelProps {
  resourceData: {
    developers: number;
    infrastructure: number;
    budget: number;
    capacity: number;
  };
}

const ResourceManagementPanel: React.FC<ResourceManagementPanelProps> = ({
  resourceData
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Development Team</span>
              </div>
              <div className="text-2xl font-bold">{resourceData.developers}</div>
              <Badge variant="outline">Active Developers</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Infrastructure</span>
              </div>
              <div className="text-2xl font-bold">{resourceData.infrastructure}</div>
              <Badge variant="outline">Services Running</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Budget</span>
              </div>
              <div className="text-2xl font-bold">${resourceData.budget.toLocaleString()}</div>
              <Badge variant="outline">Monthly</Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium">Capacity</span>
              </div>
              <Progress value={resourceData.capacity} className="h-2" />
              <span className="text-sm text-muted-foreground">{resourceData.capacity}% utilized</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resource Allocation */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Frontend Development</span>
              <div className="flex items-center gap-2">
                <Progress value={35} className="w-32 h-2" />
                <span className="text-sm">35%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Backend Development</span>
              <div className="flex items-center gap-2">
                <Progress value={40} className="w-32 h-2" />
                <span className="text-sm">40%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Testing & QA</span>
              <div className="flex items-center gap-2">
                <Progress value={15} className="w-32 h-2" />
                <span className="text-sm">15%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">DevOps & Infrastructure</span>
              <div className="flex items-center gap-2">
                <Progress value={10} className="w-32 h-2" />
                <span className="text-sm">10%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResourceManagementPanel;
