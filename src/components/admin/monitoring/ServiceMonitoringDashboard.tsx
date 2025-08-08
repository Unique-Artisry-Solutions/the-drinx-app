
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ServiceMonitoringDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Monitoring Dashboard</CardTitle>
        <CardDescription>
          Monitor system services, health status, and performance metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            This dashboard has been enhanced with comprehensive security monitoring.
            Please use the Security Monitoring Dashboard for advanced security features.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceMonitoringDashboard;
