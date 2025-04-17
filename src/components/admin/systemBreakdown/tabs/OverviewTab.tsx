
import React from 'react';

import { ProgressSnapshot, FeatureItem } from '../types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Shield, AlertTriangle } from 'lucide-react';
import { BarChart3, Code, Database } from 'lucide-react';

import StatusProgressBar from '../components/StatusProgressBar';
import { getStatusPriority, getAttentionLabel } from '../utils/statusRenderers';

interface OverviewTabProps {
  overallProgressPercentage: number;
  frontendProgressPercentage: number;
  backendProgressPercentage: number;
  implementedFeatures: number;
  partialFeatures: number;
  totalFeatures: number;
  confidenceScore?: number;
  currentSnapshot?: ProgressSnapshot;
  // New props for needs attention section
  plannedFeatures?: number;
  blockedFeatures?: number;
  needsAttentionFeatures?: FeatureItem[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  overallProgressPercentage,
  frontendProgressPercentage,
  backendProgressPercentage,
  implementedFeatures,
  partialFeatures,
  totalFeatures,
  confidenceScore,
  currentSnapshot,
  plannedFeatures = 0,
  blockedFeatures = 0,
  needsAttentionFeatures = []
}) => {
  console.log("OverviewTab props:", { 
    overallProgressPercentage,
    frontendProgressPercentage,
    backendProgressPercentage,
    implementedFeatures,
    partialFeatures,
    totalFeatures,
    plannedFeatures,
    blockedFeatures
  });

  // Calculate counts for remaining features
  const remainingFeatures = totalFeatures - implementedFeatures;
  const needsAttentionCount = partialFeatures + plannedFeatures + blockedFeatures;

  // Sort needs attention features by priority
  const sortedNeedsAttention = [...needsAttentionFeatures]
    .sort((a, b) => getStatusPriority(b.status) - getStatusPriority(a.status))
    .slice(0, 5); // Show top 5 most important

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium">Overall Progress</h3>
            <BarChart3 className="h-5 w-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{overallProgressPercentage}%</div>
          <div className="mb-2">
            <Progress value={overallProgressPercentage} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">All features combined</p>
            {confidenceScore !== undefined && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {confidenceScore}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium">Frontend Progress</h3>
            <Code className="h-5 w-5 text-purple-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{frontendProgressPercentage}%</div>
          <div className="mb-2">
            <Progress value={frontendProgressPercentage} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">UI components & interactions</p>
            {confidenceScore !== undefined && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {confidenceScore}%
              </Badge>
            )}
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-medium">Backend Progress</h3>
            <Database className="h-5 w-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold mb-2">{backendProgressPercentage}%</div>
          <div className="mb-2">
            <Progress value={backendProgressPercentage} className="h-2" />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Database & services</p>
            {confidenceScore !== undefined && (
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                {confidenceScore}%
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-3">Feature Status Breakdown</h3>
        <div className="space-y-3">
          <StatusProgressBar 
            label="Implemented"
            count={implementedFeatures}
            total={totalFeatures}
            color="bg-green-500"
            icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          />
          <StatusProgressBar 
            label="Partial"
            count={partialFeatures}
            total={totalFeatures}
            color="bg-amber-500"
            icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          />
          <StatusProgressBar 
            label="Planned/Not Started"
            count={plannedFeatures}
            total={totalFeatures}
            color="bg-gray-300"
            icon={<Clock className="h-4 w-4 text-gray-500" />}
          />
          {blockedFeatures > 0 && (
            <StatusProgressBar 
              label="Blocked"
              count={blockedFeatures}
              total={totalFeatures}
              color="bg-red-400"
              icon={<AlertCircle className="h-4 w-4 text-red-500" />}
            />
          )}
        </div>
      </div>

      {/* New Needs Attention Section */}
      {needsAttentionCount > 0 && (
        <div className="mt-6 border border-amber-200 rounded-lg p-4 bg-amber-50">
          <h3 className="text-lg font-medium mb-3 text-amber-800 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Needs Attention ({needsAttentionCount} features)
          </h3>

          {sortedNeedsAttention.length > 0 ? (
            <div className="space-y-3">
              {sortedNeedsAttention.map(feature => (
                <div key={feature.id} className="p-3 bg-white border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description.slice(0, 80)}...</p>
                      {getAttentionLabel(feature.status) && (
                        <Badge className="mt-2" variant={feature.status === 'blocked' ? 'destructive' : 'outline'}>
                          {getAttentionLabel(feature.status)}
                        </Badge>
                      )}
                    </div>
                    <Badge className={
                      feature.status === 'blocked' ? 'bg-red-500' : 
                      feature.status === 'partial' ? 'bg-amber-500' : 
                      feature.status === 'planned' ? 'bg-gray-500' : 'bg-blue-500'
                    }>
                      {feature.status}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {needsAttentionCount > sortedNeedsAttention.length && (
                <div className="text-center text-sm text-amber-700 mt-2">
                  + {needsAttentionCount - sortedNeedsAttention.length} more features need attention
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No features currently need attention.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OverviewTab;
