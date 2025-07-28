
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestTube, Users, Database, Settings } from 'lucide-react';
import TopNavigation from '@/components/TopNavigation';

const TestingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <TopNavigation />
      <div className="pt-20 container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">MVP Testing Suite</h1>
        <p className="text-gray-600">Comprehensive testing environment for all application features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Component Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test individual components and their functionality
            </p>
            <Button variant="outline" className="w-full">
              Run Component Tests
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Role Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test different user roles and permissions
            </p>
            <Button variant="outline" className="w-full">
              Test User Roles
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Testing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test database operations and queries
            </p>
            <Button variant="outline" className="w-full">
              Test Database
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Test system settings and configurations
            </p>
            <Button variant="outline" className="w-full">
              Test Configuration
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default TestingPage;
