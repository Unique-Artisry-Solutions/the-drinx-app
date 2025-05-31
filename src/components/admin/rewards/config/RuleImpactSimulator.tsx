import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Calculator } from 'lucide-react';

interface RuleImpactSimulatorProps {
  rules: any[];
  onSimulationRun: (results: any) => void;
}

export function RuleImpactSimulator({ rules, onSimulationRun }: RuleImpactSimulatorProps) {
  const [simulationPeriod, setSimulationPeriod] = useState('30d');
  const [userSegment, setUserSegment] = useState('all');
  const [isRunning, setIsRunning] = useState(false);

  // Mock simulation data - preserved as placeholder
  const simulationData = [
    { scenario: 'Current', users: 1000, revenue: 50000, engagement: 75 },
    { scenario: 'With Rules', users: 1200, revenue: 65000, engagement: 88 },
    { scenario: 'Optimized', users: 1350, revenue: 72000, engagement: 92 }
  ];

  const impactMetrics = [
    { label: 'User Growth', value: '+20%', icon: Users, color: 'text-green-600' },
    { label: 'Revenue Impact', value: '+30%', icon: DollarSign, color: 'text-blue-600' },
    { label: 'Engagement', value: '+17%', icon: TrendingUp, color: 'text-purple-600' }
  ];

  const runSimulation = async () => {
    setIsRunning(true);
    
    // Mock simulation run - preserved as placeholder
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      period: simulationPeriod,
      segment: userSegment,
      metrics: impactMetrics,
      data: simulationData
    };
    
    onSimulationRun(results);
    setIsRunning(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Rule Impact Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Simulation Period</Label>
            <Select value={simulationPeriod} onValueChange={setSimulationPeriod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>User Segment</Label>
            <Select value={userSegment} onValueChange={setUserSegment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="new">New Users</SelectItem>
                <SelectItem value="returning">Returning Users</SelectItem>
                <SelectItem value="vip">VIP Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button 
              onClick={runSimulation} 
              disabled={isRunning || rules.length === 0}
              className="w-full"
            >
              {isRunning ? 'Running...' : 'Run Simulation'}
            </Button>
          </div>
        </div>

        {/* Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {impactMetrics.map((metric) => (
            <div key={metric.label} className="flex items-center gap-3 p-4 border rounded-lg">
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
              <div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
                <div className="text-xl font-bold">{metric.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Simulation Chart */}
        <div className="space-y-2">
          <Label>Projected Impact</Label>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="scenario" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="users" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rules Status */}
        <div className="space-y-2">
          <Label>Active Rules ({rules.length})</Label>
          <div className="flex flex-wrap gap-2">
            {rules.length === 0 ? (
              <Badge variant="outline">No rules configured</Badge>
            ) : (
              rules.map((rule, index) => (
                <Badge key={index} variant="default">
                  Rule {index + 1}
                </Badge>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
