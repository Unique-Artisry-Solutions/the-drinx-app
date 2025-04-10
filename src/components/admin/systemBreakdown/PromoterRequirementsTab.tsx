import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FeatureItem } from './types';
import { groupFeaturesByCategory, calculateCategoryProgress } from './utils/featureStatistics';
import { renderStatusBadge, renderDatabaseStatusBadge } from './utils/statusRenderers';
import { Ticket, Users, Warehouse, Presentation, Store, Award, MessagesSquare, BadgeDollarSign } from 'lucide-react';

// Map category names to icons
const categoryIcons: Record<string, React.ReactNode> = {
  'ticket-management': <Ticket className="h-5 w-5 text-purple-500" />,
  'sponsorship': <BadgeDollarSign className="h-5 w-5 text-emerald-500" />,
  'venue-partnership': <Users className="h-5 w-5 text-blue-500" />,
  'merchandise': <Store className="h-5 w-5 text-orange-500" />,
  'analytics': <Presentation className="h-5 w-5 text-indigo-500" />,
  'advertising': <Presentation className="h-5 w-5 text-red-500" />,
  'vip': <Award className="h-5 w-5 text-amber-500" />,
  'feedback': <MessagesSquare className="h-5 w-5 text-cyan-500" />,
  'integration': <Warehouse className="h-5 w-5 text-gray-500" />
};

// Map category names to friendly display names
const categoryDisplayNames: Record<string, string> = {
  'ticket-management': 'Ticket Management',
  'sponsorship': 'Sponsorship System',
  'venue-partnership': 'Venue Partnerships',
  'merchandise': 'Merchandise Management',
  'analytics': 'Performance Analytics',
  'advertising': 'Advertising Tools',
  'vip': 'VIP Experiences',
  'feedback': 'Feedback System',
  'integration': 'Integrations',
  'marketplace': 'Marketplace',
  'communication': 'Communication',
  'real-time': 'Real-time Features'
};

interface PromoterRequirementsTabProps {
  features: FeatureItem[];
}

const PromoterRequirementsTab: React.FC<PromoterRequirementsTabProps> = ({ features }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Group features by category
  const categorizedFeatures = groupFeaturesByCategory(features);
  
  // Calculate overall progress
  const overallProgress = calculateCategoryProgress(features);
  
  // Calculate progress for each category
  const categoryProgress: Record<string, { frontend: number, backend: number, overall: number }> = {};
  Object.keys(categorizedFeatures).forEach(category => {
    categoryProgress[category] = calculateCategoryProgress(categorizedFeatures[category]);
  });
  
  // Order categories by overall progress (descending)
  const orderedCategories = Object.keys(categorizedFeatures).sort((a, b) => {
    return categoryProgress[b].overall - categoryProgress[a].overall;
  });
  
  const renderFeatures = (categoryFeatures: FeatureItem[]) => {
    return categoryFeatures.map(feature => (
      <div key={feature.id} className="mb-6 border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="text-lg font-medium">{feature.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
          </div>
          <div className="flex gap-2">
            {renderStatusBadge(feature.status)}
            {renderDatabaseStatusBadge(feature.databaseStatus)}
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Database Requirements */}
          <div className="bg-slate-50 p-3 rounded-md">
            <h5 className="font-medium text-sm mb-2">Database Requirements</h5>
            <p className="text-xs text-slate-700">{feature.dbRequirementsText || 'No specific database requirements defined.'}</p>
          </div>
          
          {/* Implementation Steps */}
          <div className="bg-slate-50 p-3 rounded-md">
            <h5 className="font-medium text-sm mb-2">Implementation Steps</h5>
            <div className="space-y-1">
              {feature.testSteps && feature.testSteps.map((step, idx) => (
                <div key={idx} className="text-xs text-slate-700">• {step}</div>
              ))}
              {(!feature.testSteps || feature.testSteps.length === 0) && (
                <p className="text-xs text-slate-700">No implementation steps defined.</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Dependencies and Timeline */}
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <h5 className="font-medium text-xs mb-1">Dependencies</h5>
            <div className="flex flex-wrap gap-1">
              {feature.dependsOn && feature.dependsOn.length > 0 ? (
                feature.dependsOn.map(depId => {
                  const depFeature = features.find(f => f.id === depId);
                  return (
                    <Badge key={depId} variant="outline" className="bg-blue-50">
                      {depFeature ? depFeature.name : `Feature ${depId}`}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-xs text-slate-500">No dependencies</span>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <h5 className="font-medium text-xs mb-1">Scheduled For</h5>
            <span className="text-xs">{feature.scheduledFor || 'Not scheduled'}</span>
          </div>
          
          <div className="flex-1">
            <h5 className="font-medium text-xs mb-1">Implementation Progress</h5>
            <div className="flex items-center gap-2">
              <Progress value={feature.implementationProgress || 0} className="h-2" />
              <span className="text-xs">{feature.implementationProgress || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Overview card */}
      <Card>
        <CardHeader>
          <CardTitle>Promoter System Implementation Plan</CardTitle>
          <CardDescription>Comprehensive plan for implementing the promoter system features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Overall Progress</h3>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs w-24">Frontend:</span>
                <Progress value={overallProgress.frontend} className="h-2" />
                <span className="text-xs">{overallProgress.frontend}%</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs w-24">Backend:</span>
                <Progress value={overallProgress.backend} className="h-2" />
                <span className="text-xs">{overallProgress.backend}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs w-24">Overall:</span>
                <Progress value={overallProgress.overall} className="h-2" />
                <span className="text-xs">{overallProgress.overall}%</span>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Feature Status</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Implemented:</span>
                    <span className="text-xs font-medium">{features.filter(f => f.status === 'implemented').length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">In Progress:</span>
                    <span className="text-xs font-medium">{features.filter(f => f.status === 'in_progress').length}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Planned:</span>
                    <span className="text-xs font-medium">{features.filter(f => f.status === 'planned').length}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">Blocked:</span>
                    <span className="text-xs font-medium">{features.filter(f => f.status === 'blocked').length}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Categories</h3>
              <div className="space-y-1">
                {orderedCategories.map(category => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {categoryIcons[category] || <div className="w-5 h-5" />}
                      <span className="text-xs">{categoryDisplayNames[category] || category}</span>
                    </div>
                    <span className="text-xs font-medium">{categoryProgress[category].overall}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Features by category */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Categories</CardTitle>
          <CardDescription>Browse promoter features by category</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="mb-4 flex flex-wrap">
              <TabsTrigger value="all">All Features</TabsTrigger>
              {orderedCategories.map(category => (
                <TabsTrigger key={category} value={category} className="flex items-center gap-1">
                  {categoryIcons[category]}
                  {categoryDisplayNames[category] || category}
                  <Badge variant="outline" className="ml-1 text-xs">
                    {categorizedFeatures[category].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {renderFeatures(features)}
            </TabsContent>
            
            {orderedCategories.map(category => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {categoryIcons[category] || <div className="w-6 h-6" />}
                    <h3 className="font-medium">{categoryDisplayNames[category] || category}</h3>
                  </div>
                  <Progress value={categoryProgress[category].overall} className="w-32 h-2" />
                </div>
                {renderFeatures(categorizedFeatures[category])}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoterRequirementsTab;
