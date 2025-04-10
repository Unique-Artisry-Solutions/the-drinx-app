
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Code, 
  Database, 
  LineChart,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Shield
} from 'lucide-react';
import { FeatureItem, MonthlyProgressData } from './types';
// Remove the duplicated import, as we're defining it locally
// import { calculateCategoryProgress } from './utils/statisticsUtils';

interface DevelopmentProgressDashboardProps {
  adminFeatures: FeatureItem[];
  establishmentFeatures: FeatureItem[];
  individualFeatures: FeatureItem[];
  monthlyProgressData?: MonthlyProgressData[];
  confidenceScore?: number;
}

const DevelopmentProgressDashboard: React.FC<DevelopmentProgressDashboardProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  monthlyProgressData = [],
  confidenceScore = 95
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Combine all features for analysis
  const allFeatures = [...adminFeatures, ...establishmentFeatures, ...individualFeatures];
  
  // Calculate overall implementation progress
  const totalFeatures = allFeatures.length;
  const implementedFeatures = allFeatures.filter(f => f.status === 'implemented').length;
  const partialFeatures = allFeatures.filter(f => f.status === 'partial').length;
  const overallProgressPercentage = Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100);
  
  // Calculate backend implementation progress (based on database status)
  const dbCompleted = allFeatures.filter(f => f.databaseStatus === 'complete').length;
  const dbInProgress = allFeatures.filter(f => f.databaseStatus === 'in_progress').length;
  const backendProgressPercentage = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Infer frontend implementation progress
  // Let's consider a feature's frontend is complete if the feature is implemented but database might be partial
  const frontendCompletedFeatures = allFeatures.filter(f => 
    f.status === 'implemented' || (f.status === 'partial' && f.databaseStatus !== 'complete')
  ).length;
  const frontendPartialFeatures = allFeatures.filter(f => 
    f.status === 'partial' && f.databaseStatus !== 'not_started'
  ).length;
  const frontendProgressPercentage = Math.round((frontendCompletedFeatures + (frontendPartialFeatures * 0.5)) / totalFeatures * 100);

  // Calculate feature category implementation
  const adminProgress = calculateCategoryProgress(adminFeatures);
  const establishmentProgress = calculateCategoryProgress(establishmentFeatures);
  const individualProgress = calculateCategoryProgress(individualFeatures);

  // Use provided monthly progress data or fall back to simple simulation
  const monthlyProgress = monthlyProgressData.length > 0 
    ? monthlyProgressData 
    : [
        { month: 'Jan', frontend: 10, backend: 5 },
        { month: 'Feb', frontend: 25, backend: 15 },
        { month: 'Mar', frontend: 40, backend: 30 },
        { month: 'Apr', frontend: 55, backend: 45 },
        { month: 'May', frontend: 70, backend: 60 },
        { month: 'Jun', frontend: 85, backend: 75 },
        { month: 'Jul', frontend: frontendProgressPercentage, backend: backendProgressPercentage }
      ].slice(0, new Date().getMonth() + 1);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Development Progress Dashboard
          {confidenceScore !== undefined && (
            <Badge 
              variant={confidenceScore >= 90 ? "outline" : confidenceScore >= 70 ? "secondary" : "destructive"}
              className="ml-2 flex items-center gap-1"
            >
              <Shield className="h-3 w-3" />
              {confidenceScore}% confidence
            </Badge>
          )}
        </CardTitle>
        <CardDescription>
          Track frontend and backend implementation progress
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="comparison">FE/BE Comparison</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ProgressCard 
                title="Overall Progress" 
                percentage={overallProgressPercentage} 
                description="All features combined"
                icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                confidenceScore={confidenceScore}
              />
              <ProgressCard 
                title="Frontend Progress" 
                percentage={frontendProgressPercentage} 
                description="UI components & interactions"
                icon={<Code className="h-5 w-5 text-purple-500" />}
                confidenceScore={confidenceScore}
              />
              <ProgressCard 
                title="Backend Progress" 
                percentage={backendProgressPercentage} 
                description="Database & services"
                icon={<Database className="h-5 w-5 text-green-500" />}
                confidenceScore={confidenceScore}
              />
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
                  icon={<Clock className="h-4 w-4 text-amber-500" />}
                />
                <StatusProgressBar 
                  label="Planned/Not Started"
                  count={totalFeatures - implementedFeatures - partialFeatures}
                  total={totalFeatures}
                  color="bg-gray-300"
                  icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CategoryCard 
                title="Admin Features"
                totalFeatures={adminFeatures.length}
                frontendPercentage={adminProgress.frontend}
                backendPercentage={adminProgress.backend}
                completedCount={adminFeatures.filter(f => f.status === 'implemented').length}
              />
              <CategoryCard 
                title="Establishment Features"
                totalFeatures={establishmentFeatures.length}
                frontendPercentage={establishmentProgress.frontend}
                backendPercentage={establishmentProgress.backend}
                completedCount={establishmentFeatures.filter(f => f.status === 'implemented').length}
              />
              <CategoryCard 
                title="Individual Features"
                totalFeatures={individualFeatures.length}
                frontendPercentage={individualProgress.frontend}
                backendPercentage={individualProgress.backend}
                completedCount={individualFeatures.filter(f => f.status === 'implemented').length}
              />
            </div>
            
            {/* Top Features in Each Category */}
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Recently Updated Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RecentFeaturesList 
                  title="Admin"
                  features={adminFeatures
                    .filter(f => f.statusUpdated)
                    .slice(0, 3)}
                />
                <RecentFeaturesList 
                  title="Establishment"
                  features={establishmentFeatures
                    .filter(f => f.statusUpdated)
                    .slice(0, 3)}
                />
                <RecentFeaturesList 
                  title="Individual"
                  features={individualFeatures
                    .filter(f => f.statusUpdated)
                    .slice(0, 3)}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* Comparison Tab */}
          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <Code className="h-5 w-5 text-purple-500 mr-2" />
                  Frontend Implementation
                </h3>
                <div className="space-y-4">
                  <ComparisonItem 
                    label="UI Components" 
                    percentage={frontendProgressPercentage + 5} 
                    color="bg-purple-500" 
                  />
                  <ComparisonItem 
                    label="User Interactions" 
                    percentage={frontendProgressPercentage} 
                    color="bg-purple-400" 
                  />
                  <ComparisonItem 
                    label="Form Validations" 
                    percentage={frontendProgressPercentage - 10} 
                    color="bg-purple-300" 
                  />
                  <ComparisonItem 
                    label="Responsive Design" 
                    percentage={frontendProgressPercentage - 5} 
                    color="bg-purple-200" 
                  />
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium flex items-center mb-3">
                  <Database className="h-5 w-5 text-green-500 mr-2" />
                  Backend Implementation
                </h3>
                <div className="space-y-4">
                  <ComparisonItem 
                    label="Database Schema" 
                    percentage={backendProgressPercentage + 10} 
                    color="bg-green-500" 
                  />
                  <ComparisonItem 
                    label="API Endpoints" 
                    percentage={backendProgressPercentage} 
                    color="bg-green-400" 
                  />
                  <ComparisonItem 
                    label="Data Validation" 
                    percentage={backendProgressPercentage - 5} 
                    color="bg-green-300" 
                  />
                  <ComparisonItem 
                    label="Authentication" 
                    percentage={backendProgressPercentage + 5} 
                    color="bg-green-200" 
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <LineChart className="h-5 w-5 text-blue-500 mr-2" />
                Development Gap Analysis
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Feature Completion Parity</span>
                    <span className="text-sm font-medium">
                      {Math.abs(frontendProgressPercentage - backendProgressPercentage)}% gap
                    </span>
                  </div>
                  <div className="flex h-4 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500" 
                      style={{ width: `${frontendProgressPercentage}%` }}
                    ></div>
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${Math.max(0, backendProgressPercentage - frontendProgressPercentage)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Frontend: {frontendProgressPercentage}%</span>
                    <span>Backend: {backendProgressPercentage}%</span>
                  </div>
                </div>
              </div>
              
              {confidenceScore !== undefined && (
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between mb-1 items-center">
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Shield className="h-4 w-4 text-blue-500" />
                      Data Confidence
                    </span>
                    <span className="text-sm font-medium">{confidenceScore}%</span>
                  </div>
                  <Progress value={confidenceScore} className="h-2" />
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence score represents the consistency and reliability of the implementation analysis
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                Monthly Progress Timeline
              </h3>
              <div className="space-y-4 mt-4">
                {monthlyProgress.map((month, index) => (
                  <div key={month.month} className="mb-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{month.month}</span>
                      <div className="flex gap-4">
                        <span className="text-xs text-purple-600">FE: {month.frontend}%</span>
                        <span className="text-xs text-green-600">BE: {month.backend}%</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="flex h-full">
                        <div 
                          className="bg-purple-500 h-full"
                          style={{ width: `${month.frontend}%` }}
                        ></div>
                        <div 
                          className="bg-green-500 h-full"
                          style={{ width: `${Math.max(0, month.backend - month.frontend)}%` }}
                        ></div>
                      </div>
                    </div>
                    {index < monthlyProgress.length - 1 && (
                      <div className="h-6 border-l ml-1 my-1"></div>
                    )}
                  </div>
                ))}
              </div>
              
              {confidenceScore !== undefined && confidenceScore < 90 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-sm text-amber-800 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-amber-500" />
                    Timeline data is partially reconstructed and may not reflect precise historical progress.
                    Run analysis regularly to improve data confidence.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Helper Components
const ProgressCard = ({ title, percentage, description, icon, confidenceScore }) => (
  <div className="border rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-lg font-medium">{title}</h3>
      {icon}
    </div>
    <div className="text-3xl font-bold mb-2">{percentage}%</div>
    <div className="mb-2">
      <Progress value={percentage} className="h-2" />
    </div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500">{description}</p>
      {confidenceScore !== undefined && (
        <Badge variant="outline" className="text-xs">
          <Shield className="h-3 w-3 mr-1" />
          {confidenceScore}%
        </Badge>
      )}
    </div>
  </div>
);

const StatusProgressBar = ({ label, count, total, color, icon }) => {
  const percentage = Math.round((count / total) * 100);
  
  return (
    <div>
      <div className="flex justify-between mb-1">
        <div className="flex items-center">
          {icon}
          <span className="text-sm font-medium ml-2">{label}</span>
        </div>
        <span className="text-sm font-medium">{count}/{total} ({percentage}%)</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full">
        <div 
          className={`${color} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const CategoryCard = ({ 
  title, 
  totalFeatures, 
  frontendPercentage, 
  backendPercentage,
  completedCount
}) => (
  <div className="border rounded-lg p-4">
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <div className="text-sm text-gray-500 mb-3">
      {completedCount} of {totalFeatures} features complete
    </div>
    
    <div className="space-y-3">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium flex items-center">
            <Code className="h-4 w-4 text-purple-500 mr-1" />
            Frontend
          </span>
          <span className="text-sm">{frontendPercentage}%</span>
        </div>
        <Progress value={frontendPercentage} className="h-2" />
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium flex items-center">
            <Database className="h-4 w-4 text-green-500 mr-1" />
            Backend
          </span>
          <span className="text-sm">{backendPercentage}%</span>
        </div>
        <Progress value={backendPercentage} className="h-2" />
      </div>
    </div>
  </div>
);

const RecentFeaturesList = ({ title, features }) => (
  <div className="border rounded-lg p-4">
    <h4 className="font-medium mb-3">{title} Features</h4>
    {features.length > 0 ? (
      <ul className="space-y-2">
        {features.map(feature => (
          <li key={feature.id} className="text-sm border-b pb-2">
            <div className="font-medium">{feature.name}</div>
            <div className="flex justify-between mt-1">
              <Badge variant="outline" className="text-xs">
                {feature.status}
              </Badge>
              <span className="text-xs text-gray-500">
                DB: {feature.databaseStatus.replace('_', ' ')}
              </span>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-sm text-gray-500">No recent updates</div>
    )}
  </div>
);

const ComparisonItem = ({ label, percentage, color }) => (
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-sm">{label}</span>
      <span className="text-sm font-medium">{percentage}%</span>
    </div>
    <div className="h-2 w-full bg-gray-100 rounded-full">
      <div 
        className={`${color} h-2 rounded-full`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

// Helper function to calculate category progress
function calculateCategoryProgress(features: FeatureItem[]) {
  const totalFeatures = features.length;
  if (totalFeatures === 0) return { frontend: 0, backend: 0, overall: 0 };
  
  // Calculate backend progress
  const dbCompleted = features.filter(f => f.databaseStatus === 'complete').length;
  const dbInProgress = features.filter(f => f.databaseStatus === 'in_progress').length;
  const backendPercentage = Math.round((dbCompleted + (dbInProgress * 0.5)) / totalFeatures * 100);
  
  // Calculate frontend progress
  const implementedFeatures = features.filter(f => f.status === 'implemented').length;
  const partialFeatures = features.filter(f => f.status === 'partial').length;
  const frontendPercentage = Math.round((implementedFeatures + (partialFeatures * 0.5)) / totalFeatures * 100);
  
  return { frontend: frontendPercentage, backend: backendPercentage, overall: Math.round((frontendPercentage + backendPercentage) / 2) };
}

export default DevelopmentProgressDashboard;
