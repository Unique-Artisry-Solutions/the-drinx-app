
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ABTest {
  id: string;
  name: string;
  testType: 'email' | 'sms' | 'landing_page' | 'ad_creative';
  status: 'draft' | 'running' | 'completed' | 'paused';
  variantA: {
    name: string;
    content: string;
    metrics: {
      views: number;
      clicks: number;
      conversions: number;
      conversionRate: number;
    };
  };
  variantB: {
    name: string;
    content: string;
    metrics: {
      views: number;
      clicks: number;
      conversions: number;
      conversionRate: number;
    };
  };
  trafficSplit: number;
  duration: number;
  confidence: number;
  winner?: 'A' | 'B';
}

interface ABTestingPanelProps {
  campaignId: string;
  onTestCreate: (test: Omit<ABTest, 'id' | 'status' | 'confidence' | 'winner'>) => void;
}

export default function ABTestingPanel({ campaignId, onTestCreate }: ABTestingPanelProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('create');
  const [testData, setTestData] = useState({
    name: '',
    testType: 'email' as const,
    variantA: { name: 'Version A', content: '' },
    variantB: { name: 'Version B', content: '' },
    trafficSplit: 50,
    duration: 7
  });

  const [tests] = useState<ABTest[]>([
    {
      id: '1',
      name: 'Email Subject Line Test',
      testType: 'email',
      status: 'completed',
      variantA: {
        name: 'Urgent: Limited Time Offer',
        content: 'Subject: Urgent: Limited Time Offer!',
        metrics: { views: 500, clicks: 45, conversions: 12, conversionRate: 2.4 }
      },
      variantB: {
        name: 'Exclusive Event Access',
        content: 'Subject: Your Exclusive Event Access Inside',
        metrics: { views: 500, clicks: 67, conversions: 23, conversionRate: 4.6 }
      },
      trafficSplit: 50,
      duration: 7,
      confidence: 95,
      winner: 'B'
    },
    {
      id: '2',
      name: 'SMS Message Test',
      testType: 'sms',
      status: 'running',
      variantA: {
        name: 'Direct CTA',
        content: 'Event tonight! Get tickets: [link]',
        metrics: { views: 200, clicks: 34, conversions: 8, conversionRate: 4.0 }
      },
      variantB: {
        name: 'Engaging Question',
        content: 'Ready for an amazing night? Join us: [link]',
        metrics: { views: 200, clicks: 28, conversions: 6, conversionRate: 3.0 }
      },
      trafficSplit: 50,
      duration: 5,
      confidence: 78,
      winner: undefined
    }
  ]);

  const handleCreateTest = () => {
    if (!testData.name || !testData.variantA.content || !testData.variantB.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    onTestCreate({
      name: testData.name,
      testType: testData.testType,
      variantA: {
        ...testData.variantA,
        metrics: { views: 0, clicks: 0, conversions: 0, conversionRate: 0 }
      },
      variantB: {
        ...testData.variantB,
        metrics: { views: 0, clicks: 0, conversions: 0, conversionRate: 0 }
      },
      trafficSplit: testData.trafficSplit,
      duration: testData.duration
    });

    toast({
      title: 'A/B Test Created',
      description: 'Your A/B test has been created and will start running shortly'
    });

    setTestData({
      name: '',
      testType: 'email',
      variantA: { name: 'Version A', content: '' },
      variantB: { name: 'Version B', content: '' },
      trafficSplit: 50,
      duration: 7
    });
  };

  const getStatusColor = (status: ABTest['status']) => {
    switch (status) {
      case 'running': return 'default';
      case 'completed': return 'secondary';
      case 'draft': return 'outline';
      case 'paused': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          A/B Testing
        </h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create A/B Test</TabsTrigger>
          <TabsTrigger value="tests">Manage Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create A/B Test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    value={testData.name}
                    onChange={(e) => setTestData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter test name"
                  />
                </div>

                <div>
                  <Label htmlFor="test-type">Test Type</Label>
                  <Select 
                    value={testData.testType} 
                    onValueChange={(value: any) => setTestData(prev => ({ ...prev, testType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email Campaign</SelectItem>
                      <SelectItem value="sms">SMS Campaign</SelectItem>
                      <SelectItem value="landing_page">Landing Page</SelectItem>
                      <SelectItem value="ad_creative">Ad Creative</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Variant A</Label>
                  <Input
                    value={testData.variantA.name}
                    onChange={(e) => setTestData(prev => ({ 
                      ...prev, 
                      variantA: { ...prev.variantA, name: e.target.value }
                    }))}
                    placeholder="Variant A name"
                  />
                  <Textarea
                    value={testData.variantA.content}
                    onChange={(e) => setTestData(prev => ({ 
                      ...prev, 
                      variantA: { ...prev.variantA, content: e.target.value }
                    }))}
                    placeholder="Enter content for variant A..."
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Variant B</Label>
                  <Input
                    value={testData.variantB.name}
                    onChange={(e) => setTestData(prev => ({ 
                      ...prev, 
                      variantB: { ...prev.variantB, name: e.target.value }
                    }))}
                    placeholder="Variant B name"
                  />
                  <Textarea
                    value={testData.variantB.content}
                    onChange={(e) => setTestData(prev => ({ 
                      ...prev, 
                      variantB: { ...prev.variantB, content: e.target.value }
                    }))}
                    placeholder="Enter content for variant B..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="traffic-split">Traffic Split (%)</Label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm">A: {testData.trafficSplit}%</span>
                    <Input
                      id="traffic-split"
                      type="range"
                      min="10"
                      max="90"
                      value={testData.trafficSplit}
                      onChange={(e) => setTestData(prev => ({ ...prev, trafficSplit: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-sm">B: {100 - testData.trafficSplit}%</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration">Test Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    max="30"
                    value={testData.duration}
                    onChange={(e) => setTestData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  />
                </div>
              </div>

              <Button onClick={handleCreateTest} className="w-full">
                Create A/B Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid gap-6">
            {tests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                      <Badge variant="outline">
                        {test.testType}
                      </Badge>
                      {test.winner && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Winner: {test.winner}
                        </Badge>
                      )}
                    </div>
                  </div>
                  {test.status === 'running' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Confidence Level</span>
                        <span>{test.confidence}%</span>
                      </div>
                      <Progress value={test.confidence} className="h-2" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{test.variantA.name}</h4>
                        <Badge variant="outline">A</Badge>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {test.variantA.content}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{test.variantA.metrics.clicks}</div>
                          <div className="text-xs text-gray-600">Clicks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{test.variantA.metrics.conversionRate}%</div>
                          <div className="text-xs text-gray-600">Conv. Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{test.variantB.name}</h4>
                        <Badge variant="outline">B</Badge>
                      </div>
                      <div className="bg-gray-50 p-3 rounded text-sm">
                        {test.variantB.content}
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold">{test.variantB.metrics.clicks}</div>
                          <div className="text-xs text-gray-600">Clicks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold">{test.variantB.metrics.conversionRate}%</div>
                          <div className="text-xs text-gray-600">Conv. Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-6">
                    <Button variant="outline" size="sm">View Details</Button>
                    {test.status === 'running' && (
                      <>
                        <Button variant="outline" size="sm">Pause Test</Button>
                        <Button variant="outline" size="sm">End Test</Button>
                      </>
                    )}
                    {test.status === 'completed' && test.winner && (
                      <Button size="sm">Apply Winner</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
