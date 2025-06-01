
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Database, 
  Server, 
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function SimpleSystemMonitor() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">System Monitor</h1>
        <p className="text-muted-foreground">
          Monitor your rewards system health and performance.
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Health</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="outline" className="text-green-600 border-green-200">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Response time: 45ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <Badge variant="outline" className="text-green-600 border-green-200">
                Healthy
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Query time: 12ms
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache System</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                Degraded
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Hit rate: 85%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>System performance over the last 24 hours</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">API Response Time</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">45ms avg</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Database Queries</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">1.2K/min</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Memory Usage</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">75% used</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="font-medium">Cache Hit Rate</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <span className="text-sm text-muted-foreground">85% hits</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
          <CardDescription>Latest system activities and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Cache refreshed successfully</span>
              <span className="text-xs text-muted-foreground ml-auto">2 min ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">High memory usage detected</span>
              <span className="text-xs text-muted-foreground ml-auto">15 min ago</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Database backup completed</span>
              <span className="text-xs text-muted-foreground ml-auto">1 hour ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
