
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import TestUserManager from '@/components/testing/TestUserManager';
import TestingDashboard from '@/components/testing/TestingDashboard';
import { 
  TestTube, 
  Users, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Globe,
  Smartphone
} from 'lucide-react';

const TestingPage: React.FC = () => {
  const testingGuidelines = [
    {
      title: 'Multi-Browser Testing',
      description: 'Test in Chrome, Firefox, and Safari',
      icon: <Globe className="h-4 w-4" />,
      status: 'required'
    },
    {
      title: 'Mobile Responsiveness',
      description: 'Test on mobile devices and tablets',
      icon: <Smartphone className="h-4 w-4" />,
      status: 'required'
    },
    {
      title: 'Real-time Features',
      description: 'Test messaging and notifications with multiple tabs',
      icon: <CheckCircle className="h-4 w-4" />,
      status: 'critical'
    },
    {
      title: 'Error Handling',
      description: 'Test edge cases and error scenarios',
      icon: <AlertTriangle className="h-4 w-4" />,
      status: 'important'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            MVP Testing Suite
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Comprehensive testing environment for validating all core features before launch. 
            Create test users, follow guided testing scenarios, and verify functionality across user types.
          </p>
        </div>

        {/* Quick Guidelines */}
        <Card className="mb-8 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Testing Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {testingGuidelines.map((guideline, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  <div className="mt-1">
                    {guideline.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm">{guideline.title}</h4>
                      <Badge 
                        variant={guideline.status === 'critical' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {guideline.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{guideline.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Test Users
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Scenarios
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Setup Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <TestUserManager />
          </TabsContent>

          <TabsContent value="scenarios">
            <TestingDashboard />
          </TabsContent>

          <TabsContent value="setup">
            <Card>
              <CardHeader>
                <CardTitle>Testing Environment Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 1: Account Setup</h3>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">1. Create Test Users</p>
                    <p className="text-sm text-gray-600">
                      Use the "Test Users" tab to create accounts for all user types. 
                      This will set up individuals, establishments, promoters, and admin accounts.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">2. Prepare Multiple Browsers</p>
                    <p className="text-sm text-gray-600">
                      Open Chrome, Firefox, and Safari. You'll need multiple browser sessions 
                      to test real-time messaging between different user types.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 2: Core Feature Testing</h3>
                  <div className="grid gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Messaging System</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Test promoter-to-establishment communication</li>
                        <li>• Verify real-time message delivery</li>
                        <li>• Check read/unread status indicators</li>
                        <li>• Test message thread management</li>
                      </ul>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Event Management</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create events as promoter</li>
                        <li>• Set up multiple ticket types</li>
                        <li>• Test event publishing workflow</li>
                        <li>• Verify public visibility</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="font-medium mb-2">Swig Circuits (Bar Crawls)</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Create multi-venue circuits</li>
                        <li>• Configure venue order and timing</li>
                        <li>• Set up circuit pricing</li>
                        <li>• Test venue check-in process</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 3: Commerce Testing</h3>
                  <div className="bg-yellow-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">Ticket Purchase Flow</p>
                    <p className="text-sm text-gray-600">
                      Test the complete purchase process from event discovery to ticket generation. 
                      Verify QR code creation and ticket management.
                    </p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg space-y-2">
                    <p className="font-medium">Check-in Process</p>
                    <p className="text-sm text-gray-600">
                      Test both QR code scanning and manual ticket verification. 
                      Verify attendee status updates and duplicate prevention.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Phase 4: Cross-Platform Validation</h3>
                  <div className="bg-gray-100 p-4 rounded-lg space-y-3">
                    <p className="font-medium">Multi-Device Testing</p>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">Desktop Testing</p>
                        <ul className="text-gray-600 space-y-1">
                          <li>• Chrome (primary)</li>
                          <li>• Firefox</li>
                          <li>• Safari</li>
                          <li>• Edge</li>
                        </ul>
                      </div>
                      <div>
                        <p className="font-medium mb-1">Mobile Testing</p>
                        <ul className="text-gray-600 space-y-1">
                          <li>• iOS Safari</li>
                          <li>• Android Chrome</li>
                          <li>• Responsive design</li>
                          <li>• Touch interactions</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                  <p className="font-medium text-green-800 mb-2">Success Criteria</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>✓ All user types can authenticate successfully</li>
                    <li>✓ Real-time messaging works across browser sessions</li>
                    <li>✓ Events and circuits can be created and published</li>
                    <li>✓ Ticket purchase flow completes successfully</li>
                    <li>✓ Check-in process works with QR codes and manual entry</li>
                    <li>✓ All features work on mobile devices</li>
                    <li>✓ No critical errors in browser console</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TestingPage;
