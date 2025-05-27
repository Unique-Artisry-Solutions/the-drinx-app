
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Clock, 
  TrendingUp,
  CheckCircle,
  XCircle,
  Bell,
  FileText
} from 'lucide-react';

interface RiskFactor {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'compliance' | 'operational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: number;
  impact: number;
  riskScore: number;
  mitigationPlan: string;
  status: 'open' | 'mitigated' | 'monitoring';
  dueDate: string;
}

interface ComplianceItem {
  id: string;
  standard: string;
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'pending_review';
  lastAudit: string;
  nextAudit: string;
}

interface EarlyWarning {
  id: string;
  type: 'performance' | 'security' | 'capacity' | 'quality';
  severity: 'warning' | 'critical';
  message: string;
  threshold: number;
  currentValue: number;
  trend: 'improving' | 'stable' | 'degrading';
  actionRequired: boolean;
}

interface RiskAssessmentPanelProps {
  riskFactors: RiskFactor[];
  complianceItems: ComplianceItem[];
  earlyWarnings: EarlyWarning[];
}

const RiskAssessmentPanel: React.FC<RiskAssessmentPanelProps> = ({
  riskFactors,
  complianceItems,
  earlyWarnings
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low': return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant': return <Badge className="bg-green-100 text-green-800">Compliant</Badge>;
      case 'non_compliant': return <Badge className="bg-red-100 text-red-800">Non-Compliant</Badge>;
      case 'pending_review': return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>;
      case 'open': return <Badge className="bg-red-100 text-red-800">Open</Badge>;
      case 'mitigated': return <Badge className="bg-green-100 text-green-800">Mitigated</Badge>;
      case 'monitoring': return <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'degrading': return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
      default: return <TrendingUp className="h-4 w-4 text-gray-500" />;
    }
  };

  const criticalRisks = riskFactors.filter(r => r.severity === 'critical').length;
  const highRisks = riskFactors.filter(r => r.severity === 'high').length;
  const nonCompliantItems = complianceItems.filter(c => c.status === 'non_compliant').length;
  const criticalWarnings = earlyWarnings.filter(w => w.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Risk Assessment Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalRisks}</div>
              <p className="text-xs text-muted-foreground mt-1">Immediate attention required</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">High Risks</CardTitle>
                <Shield className="h-4 w-4 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{highRisks}</div>
              <p className="text-xs text-muted-foreground mt-1">Priority mitigation needed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
                <FileText className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{nonCompliantItems}</div>
              <p className="text-xs text-muted-foreground mt-1">Standards violations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <Bell className="h-4 w-4 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{criticalWarnings}</div>
              <p className="text-xs text-muted-foreground mt-1">Threshold breaches</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Risk Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Active Risk Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.slice(0, 5).map((risk) => (
              <div key={risk.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{risk.name}</h4>
                    {getSeverityBadge(risk.severity)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(risk.status)}
                    <span className="text-sm text-muted-foreground">Due: {risk.dueDate}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Probability</span>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.probability * 10} className="flex-1" />
                      <span className="text-sm font-medium">{risk.probability}/10</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Impact</span>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.impact * 10} className="flex-1" />
                      <span className="text-sm font-medium">{risk.impact}/10</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground">Risk Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={risk.riskScore} className="flex-1" />
                      <span className={`text-sm font-medium ${getSeverityColor(risk.severity)}`}>
                        {risk.riskScore}/100
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded p-3">
                  <span className="text-sm font-medium">Mitigation Plan:</span>
                  <p className="text-sm text-muted-foreground mt-1">{risk.mitigationPlan}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceItems.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{item.standard}</h4>
                    <p className="text-xs text-muted-foreground">{item.requirement}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>Last audit: {item.lastAudit}</span>
                      <span>Next: {item.nextAudit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    {item.status === 'compliant' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Early Warning System */}
        <Card>
          <CardHeader>
            <CardTitle>Early Warning System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earlyWarnings.map((warning) => (
                <div key={warning.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className={`h-4 w-4 ${warning.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'}`} />
                      <span className="font-medium text-sm capitalize">{warning.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(warning.trend)}
                      <Badge className={warning.severity === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                        {warning.severity}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{warning.message}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {warning.currentValue}</span>
                      <span>Threshold: {warning.threshold}</span>
                    </div>
                    <Progress 
                      value={(warning.currentValue / warning.threshold) * 100} 
                      className={warning.currentValue > warning.threshold ? 'bg-red-100' : ''} 
                    />
                  </div>
                  
                  {warning.actionRequired && (
                    <div className="mt-3 flex justify-end">
                      <Button size="sm" variant="outline">
                        Take Action
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentPanel;
