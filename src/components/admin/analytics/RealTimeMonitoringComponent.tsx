
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Users, Clock, BarChart, Server, Gauge } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Function to generate mock real-time data
const generateMockRealtimeData = () => {
  const now = new Date();
  const timeString = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  
  return {
    time: timeString,
    activeUsers: Math.floor(Math.random() * 20) + 40,
    pointsPerMinute: Math.floor(Math.random() * 50) + 100,
    responseTime: Math.floor(Math.random() * 15) + 30,
    systemLoad: Math.floor(Math.random() * 20) + 30,
  };
};

const RealTimeMonitoringComponent = () => {
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState('healthy'); // 'healthy', 'warning', 'critical'
  const [refreshInterval, setRefreshInterval] = useState(5); // seconds
  
  useEffect(() => {
    // Initialize with some data
    const initialData = Array(10).fill(0).map(() => generateMockRealtimeData());
    setRealtimeData(initialData);
    
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      setRealtimeData(prevData => {
        const newData = [...prevData.slice(-19), generateMockRealtimeData()];
        
        // Update system status based on latest metrics
        const latestMetrics = newData[newData.length - 1];
        if (latestMetrics.responseTime > 40 || latestMetrics.systemLoad > 45) {
          setSystemStatus('warning');
        } else if (latestMetrics.responseTime > 50 || latestMetrics.systemLoad > 55) {
          setSystemStatus('critical');
        } else {
          setSystemStatus('healthy');
        }
        
        return newData;
      });
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  const latestData = realtimeData.length > 0 ? realtimeData[realtimeData.length - 1] : {
    activeUsers: 0,
    pointsPerMinute: 0,
    responseTime: 0,
    systemLoad: 0
  };
  
  const statusColors = {
    healthy: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500'
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Real-Time System Monitor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline">Refreshing every {refreshInterval}s</Badge>
          <div className="flex items-center">
            <span className="text-sm mr-2">Status:</span>
            <Badge variant={systemStatus === 'healthy' ? 'default' : 'destructive'} className="capitalize">
              <span className={`mr-1 h-2 w-2 rounded-full ${statusColors[systemStatus as keyof typeof statusColors]}`}></span>
              {systemStatus}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Active Users
                </span>
                <span className="text-xl font-bold">{latestData.activeUsers}</span>
              </div>
              <Progress value={latestData.activeUsers} max={100} className="h-1" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <BarChart className="h-4 w-4 mr-1" />
                  Points/Minute
                </span>
                <span className="text-xl font-bold">{latestData.pointsPerMinute}</span>
              </div>
              <Progress value={latestData.pointsPerMinute} max={200} className="h-1" />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Response Time
                </span>
                <span className="text-xl font-bold">{latestData.responseTime} ms</span>
              </div>
              <Progress 
                value={latestData.responseTime} 
                max={60} 
                className={`h-1 ${latestData.responseTime > 45 ? 'bg-amber-500' : latestData.responseTime > 55 ? 'bg-red-500' : ''}`}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground flex items-center">
                  <Server className="h-4 w-4 mr-1" />
                  System Load
                </span>
                <span className="text-xl font-bold">{latestData.systemLoad}%</span>
              </div>
              <Progress 
                value={latestData.systemLoad} 
                max={100} 
                className={`h-1 ${latestData.systemLoad > 45 ? 'bg-amber-500' : latestData.systemLoad > 55 ? 'bg-red-500' : ''}`}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Live Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                'activeUsers': { label: 'Active Users', color: '#8884d8' },
                'pointsPerMinute': { label: 'Points/Minute', color: '#82ca9d' },
                'responseTime': { label: 'Response Time (ms)', color: '#ff7300' },
                'systemLoad': { label: 'System Load (%)', color: '#0088ff' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={realtimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="activeUsers" stroke="#8884d8" dot={false} />
                  <Line type="monotone" dataKey="pointsPerMinute" stroke="#82ca9d" dot={false} />
                  <Line type="monotone" dataKey="responseTime" stroke="#ff7300" dot={false} />
                  <Line type="monotone" dataKey="systemLoad" stroke="#0088ff" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <div className="text-xs text-muted-foreground mt-2">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeMonitoringComponent;
