
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, LayoutDashboard, Settings, Eye } from 'lucide-react';
import type { CustomDashboard } from '@/services/reportingService';

interface CustomDashboardPanelProps {
  dashboards: CustomDashboard[];
  promoterId: string;
  isLoading: boolean;
}

const CustomDashboardPanel: React.FC<CustomDashboardPanelProps> = ({
  dashboards,
  promoterId,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Custom Dashboards</h3>
          <p className="text-sm text-muted-foreground">
            Create personalized views of your event data
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Dashboard
        </Button>
      </div>

      {/* Dashboards Grid */}
      {dashboards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Custom Dashboards</h3>
            <p className="text-muted-foreground mb-4">
              Create your first custom dashboard to visualize your data exactly how you want
            </p>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map(dashboard => (
            <Card key={dashboard.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      {dashboard.name}
                    </CardTitle>
                    {dashboard.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {dashboard.description}
                      </p>
                    )}
                  </div>
                  {dashboard.isDefault && (
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Widget Preview */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium mb-2">
                    {dashboard.layout.widgets.length} Widgets
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {dashboard.layout.widgets.slice(0, 4).map(widget => (
                      <div key={widget.id} className="bg-white p-2 rounded border text-xs">
                        <div className="font-medium">{widget.config.title}</div>
                        <div className="text-muted-foreground">{widget.type}</div>
                      </div>
                    ))}
                    {dashboard.layout.widgets.length > 4 && (
                      <div className="bg-white p-2 rounded border text-xs flex items-center justify-center text-muted-foreground">
                        +{dashboard.layout.widgets.length - 4} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Dashboard Info */}
                <div className="text-xs text-muted-foreground">
                  Last updated: {new Date(dashboard.updatedAt).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dashboard Templates</CardTitle>
          <p className="text-sm text-muted-foreground">
            Get started quickly with pre-built dashboard templates
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium mb-1">Event Overview</div>
              <div className="text-sm text-muted-foreground mb-3">
                Key metrics for event performance tracking
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium mb-1">Marketing Analytics</div>
              <div className="text-sm text-muted-foreground mb-3">
                Track campaign performance and ROI
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
              <div className="font-medium mb-1">Financial Dashboard</div>
              <div className="text-sm text-muted-foreground mb-3">
                Revenue, costs, and profit analysis
              </div>
              <Button size="sm" variant="outline" className="w-full">
                Use Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomDashboardPanel;
