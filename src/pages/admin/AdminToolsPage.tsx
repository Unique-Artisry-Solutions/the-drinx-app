import React from 'react';
import { AdminPageLayout } from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  FileText, 
  Settings, 
  Download, 
  Upload, 
  RefreshCw,
  Wrench,
  Bug,
  Zap
} from 'lucide-react';

const AdminToolsPage: React.FC = () => {
  const pageConfig = {
    title: 'Admin Tools',
    description: 'Collection of administrative tools and utilities for system management',
    showBreadcrumbs: true,
    maxWidth: 'full' as const
  };

  const toolCategories = [
    {
      title: 'Database Tools',
      tools: [
        { name: 'Database Backup', description: 'Create system backup', icon: Database },
        { name: 'Data Export', description: 'Export data to CSV/JSON', icon: Download },
        { name: 'Data Import', description: 'Import data from files', icon: Upload },
        { name: 'Database Health Check', description: 'Check database integrity', icon: RefreshCw }
      ]
    },
    {
      title: 'System Maintenance',
      tools: [
        { name: 'Cache Clear', description: 'Clear system cache', icon: Zap },
        { name: 'Log Cleanup', description: 'Clean old log files', icon: FileText },
        { name: 'System Diagnostics', description: 'Run system diagnostics', icon: Bug },
        { name: 'Configuration Reset', description: 'Reset to default config', icon: Settings }
      ]
    },
    {
      title: 'Development Tools',
      tools: [
        { name: 'Component Catalog', description: 'Browse UI components', icon: Wrench },
        { name: 'API Testing', description: 'Test API endpoints', icon: RefreshCw },
        { name: 'Performance Monitor', description: 'Monitor system performance', icon: Zap },
        { name: 'Error Logs', description: 'View system error logs', icon: Bug }
      ]
    }
  ];

  const handleToolAction = (toolName: string) => {
    console.log(`Executing tool: ${toolName}`);
    // Tool action implementation would go here
  };

  return (
    <AdminPageLayout config={pageConfig}>
      <div className="space-y-8">
        {toolCategories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.tools.map((tool, toolIndex) => (
                <Card key={toolIndex} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-2">
                      <tool.icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {tool.description}
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleToolAction(tool.name)}
                    >
                      Execute
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh System Cache
              </Button>
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Backup Database
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                System Health Check
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default AdminToolsPage;