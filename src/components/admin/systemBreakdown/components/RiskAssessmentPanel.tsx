
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface RiskAssessmentPanelProps {
  riskFactors: {
    security: number;
    performance: number;
    maintainability: number;
    scalability: number;
  };
  complianceItems: {
    total: number;
    compliant: number;
    pending: number;
    failed: number;
  };
  earlyWarnings: {
    critical: number;
    warning: number;
    info: number;
  };
}

const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  riskFactors,
  complianceItems,
  earlyWarnings
}) => {
  return (
    <div className="space-y-6">
      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Security Risks</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{riskFactors.security}</div>
              <Badge variant={riskFactors.security > 20 ? "destructive" : "outline"}>
                {riskFactors.security > 20 ? "High" : "Low"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Performance Risks</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{riskFactors.performance}</div>
              <Badge variant={riskFactors.performance > 15 ? "destructive" : "outline"}>
                {riskFactors.performance > 15 ? "High" : "Low"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Maintainability</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{riskFactors.maintainability}</div>
              <Badge variant={riskFactors.maintainability > 25 ? "destructive" : "outline"}>
                {riskFactors.maintainability > 25 ? "High" : "Low"}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Scalability</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">{riskFactors.scalability}</div>
              <Badge variant={riskFactors.scalability > 10 ? "destructive" : "outline"}>
                {riskFactors.scalability > 10 ? "High" : "Low"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{complianceItems.total}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{complianceItems.compliant}</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{complianceItems.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{complianceItems.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Compliance Rate</span>
              <span className="text-sm">{((complianceItems.compliant / complianceItems.total) * 100).toFixed(1)}%</span>
            </div>
            <Progress value={(complianceItems.compliant / complianceItems.total) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Early Warning System */}
      <Card>
        <CardHeader>
          <CardTitle>Early Warning System</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Critical Alerts</span>
              </div>
              <Badge variant="destructive">{earlyWarnings.critical}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Warning Alerts</span>
              </div>
              <Badge variant="secondary">{earlyWarnings.warning}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Info Alerts</span>
              </div>
              <Badge variant="outline">{earlyWarnings.info}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskAssessmentPanel;
