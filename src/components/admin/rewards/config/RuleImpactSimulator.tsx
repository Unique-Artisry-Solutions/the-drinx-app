
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gauge, BarChart, TrendingUp, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface RuleImpactSimulatorProps {
  onRunSimulation?: (params: Record<string, any>) => void;
}

export function RuleImpactSimulator({ onRunSimulation }: RuleImpactSimulatorProps) {
  const [ruleType, setRuleType] = useState('points_multiplier');
  const [userSegment, setUserSegment] = useState('all');
  const [period, setPeriod] = useState(30);
  const [pointValue, setPointValue] = useState(100);
  const [multiplier, setMultiplier] = useState(1.5);
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  
  // Sample simulation data
  const simulationData = [
    { day: '01', users: 24, points: 2400, revenue: 120 },
    { day: '02', users: 18, points: 1800, revenue: 90 },
    { day: '03', users: 30, points: 3000, revenue: 150 },
    { day: '04', users: 42, points: 4200, revenue: 210 },
    { day: '05', users: 35, points: 3500, revenue: 175 },
    { day: '06', users: 28, points: 2800, revenue: 140 },
    { day: '07', users: 22, points: 2200, revenue: 110 },
  ];
  
  const simulationResults = {
    pointsAwarded: 19900,
    estimatedCost: 199,
    affectedUsers: 128,
    engagementLift: 12.5,
    revenueLift: 1250,
    roi: 6.28
  };

  const handleRunSimulation = () => {
    setSimulationStatus('running');
    
    // Simulate API call delay
    setTimeout(() => {
      if (onRunSimulation) {
        onRunSimulation({
          ruleType,
          userSegment,
          period,
          pointValue,
          multiplier
        });
      }
      setSimulationStatus('completed');
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          Rule Impact Simulator
        </CardTitle>
        <CardDescription>
          Test and measure the impact of reward rules before implementing them
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="rule-type">Rule Type</Label>
              <Select 
                value={ruleType} 
                onValueChange={setRuleType}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points_multiplier">Points Multiplier</SelectItem>
                  <SelectItem value="bonus_points">Bonus Points</SelectItem>
                  <SelectItem value="tier_upgrade">Tier Upgrade</SelectItem>
                  <SelectItem value="special_offer">Special Offer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="user-segment">Target User Segment</Label>
              <Select 
                value={userSegment} 
                onValueChange={setUserSegment}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users (&lt;30 days)</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="at_risk">At-Risk Users</SelectItem>
                  <SelectItem value="lapsed">Lapsed Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="simulation-period">Simulation Period (Days)</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[period]}
                  min={7}
                  max={90}
                  step={1}
                  onValueChange={([value]) => setPeriod(value)}
                />
                <span className="min-w-[30px] text-right text-sm">{period}</span>
              </div>
            </div>
            
            {ruleType === 'points_multiplier' && (
              <div>
                <Label htmlFor="point-multiplier">Point Multiplier</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[multiplier * 10]}
                    min={10}
                    max={50}
                    step={5}
                    onValueChange={([value]) => setMultiplier(value / 10)}
                  />
                  <span className="min-w-[30px] text-right text-sm">×{multiplier}</span>
                </div>
              </div>
            )}
            
            {ruleType === 'bonus_points' && (
              <div>
                <Label htmlFor="bonus-points">Bonus Points</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[pointValue]}
                    min={50}
                    max={1000}
                    step={50}
                    onValueChange={([value]) => setPointValue(value)}
                  />
                  <span className="min-w-[50px] text-right text-sm">{pointValue}</span>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleRunSimulation} 
              className="w-full"
              disabled={simulationStatus === 'running'}
            >
              {simulationStatus === 'running' ? 
                'Simulating...' : 
                simulationStatus === 'completed' ?
                'Run Simulation Again' :
                'Run Simulation'
              }
            </Button>
          </div>
          
          <div>
            {simulationStatus === 'completed' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md bg-muted/20">
                    <div className="text-sm text-muted-foreground">Points Awarded</div>
                    <div className="text-2xl font-bold">{simulationResults.pointsAwarded.toLocaleString()}</div>
                  </div>
                  <div className="p-3 border rounded-md bg-muted/20">
                    <div className="text-sm text-muted-foreground">Users Affected</div>
                    <div className="text-2xl font-bold">{simulationResults.affectedUsers}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-md bg-muted/20">
                    <div className="text-sm text-muted-foreground">Cost</div>
                    <div className="text-2xl font-bold">${simulationResults.estimatedCost.toLocaleString()}</div>
                  </div>
                  <div className="p-3 border rounded-md bg-muted/20">
                    <div className="text-sm text-muted-foreground">Estimated ROI</div>
                    <div className="text-2xl font-bold text-green-600">{simulationResults.roi}x</div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">
                    <TrendingUp className="h-4 w-4 inline mr-1" />
                    Projected Impact
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="font-medium text-green-600">+{simulationResults.engagementLift}%</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="font-medium text-green-600">+${simulationResults.revenueLift}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    <BarChart className="h-4 w-4 inline mr-1" />
                    7-Day Projection
                  </h3>
                  <div className="h-[150px] border rounded-md p-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={simulationData}
                        margin={{
                          top: 5,
                          right: 5,
                          left: 0,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="points" stroke="#8884d8" fill="#8884d880" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center p-6 bg-muted/20 rounded-md">
                <Gauge className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">Simulation Results Preview</h3>
                <p className="text-muted-foreground mb-6">
                  Configure your parameters and run a simulation to see the projected impact
                </p>
                {simulationStatus === 'running' && (
                  <div className="animate-pulse">
                    <BarChart className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm mt-2">Processing simulation...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
