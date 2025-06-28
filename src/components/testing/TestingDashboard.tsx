
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Circle, 
  MessageSquare, 
  Calendar, 
  Users, 
  CreditCard,
  MapPin,
  Settings,
  Eye,
  Play,
  TestTube
} from 'lucide-react';

interface TestScenario {
  id: string;
  title: string;
  description: string;
  userType: string;
  steps: TestStep[];
  completed: boolean;
}

interface TestStep {
  id: string;
  description: string;
  action: string;
  expectedResult: string;
  completed: boolean;
}

const TestingDashboard: React.FC = () => {
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(new Set());
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const testScenarios: TestScenario[] = [
    {
      id: 'messaging-promoter-establishment',
      title: 'Promoter-Establishment Messaging',
      description: 'Test communication between promoters and establishments',
      userType: 'promoter',
      completed: false,
      steps: [
        {
          id: 'msg-1',
          description: 'Login as promoter (party_promoter@test.com)',
          action: 'Navigate to /login and sign in',
          expectedResult: 'Successfully logged in and redirected to promoter dashboard',
          completed: false
        },
        {
          id: 'msg-2',
          description: 'Access messaging system',
          action: 'Navigate to Messages section',
          expectedResult: 'Can see messaging interface',
          completed: false
        },
        {
          id: 'msg-3',
          description: 'Start conversation with establishment',
          action: 'Create new message thread with Downtown Bar',
          expectedResult: 'New conversation thread created',
          completed: false
        },
        {
          id: 'msg-4',
          description: 'Send initial message',
          action: 'Send: "Hi! I\'d like to discuss hosting an event at your venue."',
          expectedResult: 'Message sent successfully',
          completed: false
        },
        {
          id: 'msg-5',
          description: 'Switch to establishment account',
          action: 'Logout and login as downtown_bar@test.com',
          expectedResult: 'Logged in as establishment user',
          completed: false
        },
        {
          id: 'msg-6',
          description: 'View received message',
          action: 'Check messages section',
          expectedResult: 'Can see message from promoter with unread indicator',
          completed: false
        },
        {
          id: 'msg-7',
          description: 'Reply to promoter',
          action: 'Send: "Hello! We\'d be happy to discuss event options. What type of event?"',
          expectedResult: 'Reply sent successfully',
          completed: false
        },
        {
          id: 'msg-8',
          description: 'Verify real-time updates',
          action: 'Switch back to promoter account (new browser tab)',
          expectedResult: 'Can see establishment reply in real-time',
          completed: false
        }
      ]
    },
    {
      id: 'event-creation-flow',
      title: 'Event Creation & Management',
      description: 'Test complete event creation and management flow',
      userType: 'promoter',
      completed: false,
      steps: [
        {
          id: 'event-1',
          description: 'Login as promoter',
          action: 'Login as event_master@test.com',
          expectedResult: 'Successfully logged in to promoter dashboard',
          completed: false
        },
        {
          id: 'event-2',
          description: 'Create new event',
          action: 'Navigate to Events > Create Event',
          expectedResult: 'Event creation form loads',
          completed: false
        },
        {
          id: 'event-3',
          description: 'Fill event details',
          action: 'Create "Summer Rooftop Party" at Rooftop Lounge',
          expectedResult: 'Event form accepts all required information',
          completed: false
        },
        {
          id: 'event-4',
          description: 'Set ticket types',
          action: 'Add General Admission ($25) and VIP ($50) tickets',
          expectedResult: 'Multiple ticket types configured',
          completed: false
        },
        {
          id: 'event-5',
          description: 'Publish event',
          action: 'Change status from draft to published',
          expectedResult: 'Event is now publicly visible',
          completed: false
        },
        {
          id: 'event-6',
          description: 'Verify event visibility',
          action: 'Logout and browse as individual user',
          expectedResult: 'Event appears in public event listings',
          completed: false
        }
      ]
    },
    {
      id: 'swig-circuit-creation',
      title: 'Swig Circuit Creation & Management',
      description: 'Test swig circuit (bar crawl) creation process',
      userType: 'promoter',
      completed: false,
      steps: [
        {
          id: 'swig-1',
          description: 'Login as promoter',
          action: 'Login as party_promoter@test.com',
          expectedResult: 'Successfully logged in',
          completed: false
        },
        {
          id: 'swig-2',
          description: 'Navigate to Swig Circuits',
          action: 'Go to Swig Circuits section',
          expectedResult: 'Swig circuit management interface loads',
          completed: false
        },
        {
          id: 'swig-3',
          description: 'Create new circuit',
          action: 'Create "Downtown Bar Crawl" with 3 venues',
          expectedResult: 'Circuit creation form works',
          completed: false
        },
        {
          id: 'swig-4',
          description: 'Add participating venues',
          action: 'Add Downtown Bar, Rooftop Lounge, and Craft Brewery',
          expectedResult: 'Multiple venues added to circuit',
          completed: false
        },
        {
          id: 'swig-5',
          description: 'Set pricing and tickets',
          action: 'Configure circuit pricing and ticket options',
          expectedResult: 'Pricing configured successfully',
          completed: false
        },
        {
          id: 'swig-6',
          description: 'Publish circuit',
          action: 'Publish the swig circuit',
          expectedResult: 'Circuit is publicly available',
          completed: false
        }
      ]
    },
    {
      id: 'ticket-purchase-flow',
      title: 'Ticket Purchase Process',
      description: 'Test end-to-end ticket purchasing',
      userType: 'individual',
      completed: false,
      steps: [
        {
          id: 'purchase-1',
          description: 'Login as individual user',
          action: 'Login as alice@test.com',
          expectedResult: 'Successfully logged in',
          completed: false
        },
        {
          id: 'purchase-2',
          description: 'Browse events',
          action: 'Navigate to events page',
          expectedResult: 'Can see available events',
          completed: false
        },
        {
          id: 'purchase-3',
          description: 'Select event',
          action: 'Click on "Summer Rooftop Party"',
          expectedResult: 'Event details page loads',
          completed: false
        },
        {
          id: 'purchase-4',
          description: 'Add tickets to cart',
          action: 'Select 1 General Admission ticket',
          expectedResult: 'Ticket added to cart',
          completed: false
        },
        {
          id: 'purchase-5',
          description: 'Proceed to checkout',
          action: 'Click checkout button',
          expectedResult: 'Checkout process begins',
          completed: false
        },
        {
          id: 'purchase-6',
          description: 'Complete purchase',
          action: 'Fill payment details and submit',
          expectedResult: 'Purchase completed, ticket generated',
          completed: false
        },
        {
          id: 'purchase-7',
          description: 'Verify ticket',
          action: 'Check My Tickets section',
          expectedResult: 'Purchased ticket appears with QR code',
          completed: false
        }
      ]
    },
    {
      id: 'checkin-process',
      title: 'Check-in Process',
      description: 'Test QR code scanning and check-in functionality',
      userType: 'establishment',
      completed: false,
      steps: [
        {
          id: 'checkin-1',
          description: 'Login as establishment',
          action: 'Login as rooftop_lounge@test.com',
          expectedResult: 'Successfully logged in to establishment dashboard',
          completed: false
        },
        {
          id: 'checkin-2',
          description: 'Access event management',
          action: 'Navigate to Events > Summer Rooftop Party',
          expectedResult: 'Can see event details and attendee list',
          completed: false
        },
        {
          id: 'checkin-3',
          description: 'Open check-in scanner',
          action: 'Click "Scan QR Codes" or "Check-in Attendees"',
          expectedResult: 'QR scanner interface opens',
          completed: false
        },
        {
          id: 'checkin-4',
          description: 'Test manual check-in',
          action: 'Use manual ticket code entry instead of QR scan',
          expectedResult: 'Can manually enter ticket codes for check-in',
          completed: false
        },
        {
          id: 'checkin-5',
          description: 'Verify check-in status',
          action: 'Return to attendee list',
          expectedResult: 'Attendee status updated to "checked in"',
          completed: false
        },
        {
          id: 'checkin-6',
          description: 'Test duplicate check-in prevention',
          action: 'Try to check in the same ticket again',
          expectedResult: 'System prevents duplicate check-ins',
          completed: false
        }
      ]
    },
    {
      id: 'cross-platform-messaging',
      title: 'Cross-Platform Communication',
      description: 'Test messaging between different user types',
      userType: 'mixed',
      completed: false,
      steps: [
        {
          id: 'cross-1',
          description: 'Promoter to Individual messaging',
          action: 'Promoter sends message to event attendee',
          expectedResult: 'Individual receives message notification',
          completed: false
        },
        {
          id: 'cross-2',
          description: 'Individual to Promoter response',
          action: 'Individual replies to promoter message',
          expectedResult: 'Two-way communication works',
          completed: false
        },
        {
          id: 'cross-3',
          description: 'Establishment to Promoter',
          action: 'Establishment initiates conversation about venue booking',
          expectedResult: 'Promoter receives message',
          completed: false
        },
        {
          id: 'cross-4',
          description: 'Message read status',
          action: 'Check read/unread indicators across user types',
          expectedResult: 'Read status updates correctly',
          completed: false
        },
        {
          id: 'cross-5',
          description: 'Real-time updates',
          action: 'Send messages in one browser, check another',
          expectedResult: 'Messages appear in real-time',
          completed: false
        }
      ]
    }
  ];

  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const markScenarioCompleted = (scenarioId: string) => {
    setCompletedScenarios(prev => new Set([...prev, scenarioId]));
  };

  const getScenarioProgress = (scenario: TestScenario) => {
    const completedStepsCount = scenario.steps.filter(step => 
      completedSteps.has(step.id)
    ).length;
    return {
      completed: completedStepsCount,
      total: scenario.steps.length,
      percentage: Math.round((completedStepsCount / scenario.steps.length) * 100)
    };
  };

  const overallProgress = () => {
    const totalSteps = testScenarios.reduce((acc, scenario) => acc + scenario.steps.length, 0);
    const completedStepsCount = completedSteps.size;
    return {
      completed: completedStepsCount,
      total: totalSteps,
      percentage: Math.round((completedStepsCount / totalSteps) * 100)
    };
  };

  const progress = overallProgress();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            MVP Testing Dashboard
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-lg px-3 py-1">
              Overall Progress: {progress.percentage}% ({progress.completed}/{progress.total})
            </Badge>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-green-200">
              <CardContent className="p-4 text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {completedScenarios.size}
                </div>
                <div className="text-sm text-gray-600">Scenarios Completed</div>
              </CardContent>
            </Card>
            <Card className="border-blue-200">
              <CardContent className="p-4 text-center">
                <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {testScenarios.length - completedScenarios.size}
                </div>
                <div className="text-sm text-gray-600">Scenarios Remaining</div>
              </CardContent>
            </Card>
            <Card className="border-purple-200">
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">
                  {testScenarios.length}
                </div>
                <div className="text-sm text-gray-600">Total Test Scenarios</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Test Scenarios */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Scenarios</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="commerce">Commerce</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid gap-6">
            {testScenarios.map((scenario) => {
              const scenarioProgress = getScenarioProgress(scenario);
              return (
                <Card key={scenario.id} className="border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {completedScenarios.has(scenario.id) ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                          {scenario.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{scenario.description}</p>
                        <Badge variant="secondary">{scenario.userType}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {scenarioProgress.percentage}% Complete
                        </div>
                        <div className="text-xs text-gray-500">
                          {scenarioProgress.completed}/{scenarioProgress.total} steps
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${scenarioProgress.percentage}%` }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scenario.steps.map((step, index) => (
                        <div key={step.id} className="border rounded-lg p-3">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleStepCompleted(step.id)}
                              className="mt-1"
                            >
                              {completedSteps.has(step.id) ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                              )}
                            </button>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Step {index + 1}:</span>
                                <span>{step.description}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                <strong>Action:</strong> {step.action}
                              </div>
                              <div className="text-sm text-green-700">
                                <strong>Expected:</strong> {step.expectedResult}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {scenarioProgress.percentage === 100 && !completedScenarios.has(scenario.id) && (
                      <div className="mt-4 pt-4 border-t">
                        <Button 
                          onClick={() => markScenarioCompleted(scenario.id)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Mark Scenario as Completed
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="messaging">
          <div className="grid gap-6">
            {testScenarios
              .filter(s => s.id.includes('messaging') || s.id.includes('cross-platform'))
              .map((scenario) => {
                const scenarioProgress = getScenarioProgress(scenario);
                return (
                  <Card key={scenario.id} className="border">
                    {/* Same card structure as above */}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                            {scenario.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{scenario.description}</p>
                        </div>
                        <Badge variant="outline">{scenarioProgress.percentage}% Complete</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenario.steps.map((step, index) => (
                          <div key={step.id} className="border rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <button onClick={() => toggleStepCompleted(step.id)}>
                                {completedSteps.has(step.id) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1 space-y-1">
                                <div className="font-medium">Step {index + 1}: {step.description}</div>
                                <div className="text-sm text-gray-600">Action: {step.action}</div>
                                <div className="text-sm text-green-700">Expected: {step.expectedResult}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid gap-6">
            {testScenarios
              .filter(s => s.id.includes('event') || s.id.includes('swig'))
              .map((scenario) => {
                const scenarioProgress = getScenarioProgress(scenario);
                return (
                  <Card key={scenario.id} className="border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-purple-600" />
                            {scenario.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{scenario.description}</p>
                        </div>
                        <Badge variant="outline">{scenarioProgress.percentage}% Complete</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenario.steps.map((step, index) => (
                          <div key={step.id} className="border rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <button onClick={() => toggleStepCompleted(step.id)}>
                                {completedSteps.has(step.id) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1 space-y-1">
                                <div className="font-medium">Step {index + 1}: {step.description}</div>
                                <div className="text-sm text-gray-600">Action: {step.action}</div>
                                <div className="text-sm text-green-700">Expected: {step.expectedResult}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        <TabsContent value="commerce">
          <div className="grid gap-6">
            {testScenarios
              .filter(s => s.id.includes('purchase') || s.id.includes('checkin'))
              .map((scenario) => {
                const scenarioProgress = getScenarioProgress(scenario);
                return (
                  <Card key={scenario.id} className="border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-green-600" />
                            {scenario.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{scenario.description}</p>
                        </div>
                        <Badge variant="outline">{scenarioProgress.percentage}% Complete</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {scenario.steps.map((step, index) => (
                          <div key={step.id} className="border rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <button onClick={() => toggleStepCompleted(step.id)}>
                                {completedSteps.has(step.id) ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-400" />
                                )}
                              </button>
                              <div className="flex-1 space-y-1">
                                <div className="font-medium">Step {index + 1}: {step.description}</div>
                                <div className="text-sm text-gray-600">Action: {step.action}</div>
                                <div className="text-sm text-green-700">Expected: {step.expectedResult}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestingDashboard;
