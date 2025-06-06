
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWelcomeAutomation } from '@/hooks/useWelcomeAutomation';
import OnboardingWizard from './OnboardingWizard';
import OnboardingProgressTracker from './OnboardingProgressTracker';
import { Plus, Settings, BarChart3, Users } from 'lucide-react';

interface WelcomeAutomationDashboardProps {
  promoterId: string;
}

const WelcomeAutomationDashboard: React.FC<WelcomeAutomationDashboardProps> = ({ promoterId }) => {
  const { flows, flowsLoading } = useWelcomeAutomation(promoterId);
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Welcome Flow</h2>
          <Button variant="outline" onClick={() => setShowWizard(false)}>
            Back to Dashboard
          </Button>
        </div>
        <OnboardingWizard 
          promoterId={promoterId} 
          onComplete={() => setShowWizard(false)}
        />
      </div>
    );
  }

  if (flowsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">Loading welcome automation...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Welcome Automation</h2>
          <p className="text-muted-foreground">
            Onboard new followers with automated welcome sequences
          </p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Flow
        </Button>
      </div>

      <Tabs defaultValue="flows" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="flows">
            <Settings className="h-4 w-4 mr-2" />
            Flows
          </TabsTrigger>
          <TabsTrigger value="progress">
            <Users className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flows" className="space-y-6">
          {flows.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <div className="mb-4">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Welcome Flows Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first welcome automation flow to onboard new followers
                </p>
                <Button onClick={() => setShowWizard(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Flow
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {flows.map((flow) => (
                <Card key={flow.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{flow.flow_name}</CardTitle>
                        {flow.description && (
                          <p className="text-muted-foreground">{flow.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          flow.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {flow.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{flow.flow_config.duration_days} days</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Steps:</span>
                        <div className="font-medium">{flow.flow_config.total_steps}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">
                          {new Date(flow.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="progress">
          <OnboardingProgressTracker promoterId={promoterId} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Analytics coming soon...
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WelcomeAutomationDashboard;
