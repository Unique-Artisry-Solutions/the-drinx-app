import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FeatureItem } from './types';
import { groupFeaturesByCategory, calculateCategoryProgress } from './utils/featureStatistics';
import { renderStatusBadge, renderDatabaseStatusBadge } from './utils/statusRenderers';
import { 
  Ticket, 
  Users, 
  Warehouse, 
  BarChart3, 
  Store, 
  Award, 
  MessagesSquare, 
  BadgeDollarSign, 
  Calendar, 
  ArrowRight,
  Database,
  Layout,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';

const categoryIcons: Record<string, React.ReactNode> = {
  'ticket-management': <Ticket className="h-5 w-5 text-purple-500" />,
  'sponsorship': <BadgeDollarSign className="h-5 w-5 text-emerald-500" />,
  'venue-partnership': <Users className="h-5 w-5 text-blue-500" />,
  'merchandise': <Store className="h-5 w-5 text-orange-500" />,
  'analytics': <BarChart3 className="h-5 w-5 text-indigo-500" />,
  'advertising': <BarChart3 className="h-5 w-5 text-red-500" />,
  'vip': <Award className="h-5 w-5 text-amber-500" />,
  'feedback': <MessagesSquare className="h-5 w-5 text-cyan-500" />,
  'integration': <Warehouse className="h-5 w-5 text-gray-500" />,
  'marketing': <Calendar className="h-5 w-5 text-pink-500" />
};

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
  'real-time': 'Real-time Features',
  'marketing': 'Marketing Tools'
};

const implementationPhases: Record<string, number> = {
  '6001': 1, '6002': 1, '6008': 1, '6021': 1,  // Phase 1: Basic functionality
  '6003': 2, '6007': 2, '6009': 2, '6019': 2, '6022': 2, // Phase 2: Core features
  '6004': 3, '6013': 3, '6015': 3, '6016': 3, '6020': 3, // Phase 3: Advanced features
  '6005': 4, '6006': 4, '6014': 4, '6017': 4, '6023': 4, // Phase 4: Enhancement features
  '6010': 5, '6011': 5, '6012': 5, '6018': 5  // Phase 5: Optional features
};

const getImplementationPhase = (featureId: string): number => {
  return implementationPhases[featureId] || 5; // Default to phase 5 if not found
};

interface PromoterRequirementsTabProps {
  features: FeatureItem[];
}

const PromoterRequirementsTab: React.FC<PromoterRequirementsTabProps> = ({ features }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeView, setActiveView] = useState<string>('categories');
  
  const categorizedFeatures = groupFeaturesByCategory(features);
  
  const overallProgress = calculateCategoryProgress(features);
  
  const categoryProgress: Record<string, { frontend: number, backend: number, overall: number }> = {};
  Object.keys(categorizedFeatures).forEach(category => {
    categoryProgress[category] = calculateCategoryProgress(categorizedFeatures[category]);
  });
  
  const orderedCategories = Object.keys(categorizedFeatures).sort((a, b) => {
    return categoryProgress[b].overall - categoryProgress[a].overall;
  });

  const phaseFeatures: Record<number, FeatureItem[]> = {};
  features.forEach(feature => {
    const phase = getImplementationPhase(feature.id);
    if (!phaseFeatures[phase]) phaseFeatures[phase] = [];
    phaseFeatures[phase].push(feature);
  });
  
  const renderFeatures = (categoryFeatures: FeatureItem[]) => {
    const sortedFeatures = [...categoryFeatures].sort((a, b) => 
      getImplementationPhase(a.id) - getImplementationPhase(b.id)
    );
    
    return sortedFeatures.map(feature => (
      <div key={feature.id} className="mb-6 border rounded-lg p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-medium">{feature.name}</h4>
              <Badge variant="outline" className="bg-blue-50">Phase {getImplementationPhase(feature.id)}</Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
          </div>
          <div className="flex gap-2">
            {renderStatusBadge(feature.status)}
            {renderDatabaseStatusBadge(feature.databaseStatus || feature.dbStatus)}
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="implementation-details">
            <AccordionTrigger className="text-sm font-medium">Implementation Details</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="h-4 w-4 text-slate-700" />
                    <h5 className="font-medium text-sm">Database Requirements</h5>
                  </div>
                  <p className="text-xs text-slate-700">{feature.dbRequirementsText || 'No specific database requirements defined.'}</p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <Layout className="h-4 w-4 text-slate-700" />
                    <h5 className="font-medium text-sm">UI Implementation</h5>
                  </div>
                  <p className="text-xs text-slate-700">
                    {feature.tags?.includes('signature') 
                      ? 'Signature feature requiring custom UI components and detailed design attention.' 
                      : 'Standard UI components with form controls and data visualization.'}
                  </p>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-md col-span-1 md:col-span-2">
                  <h5 className="font-medium text-sm mb-2">Implementation Steps</h5>
                  <div className="space-y-1">
                    {feature.testSteps && feature.testSteps.map((step, idx) => (
                      <div key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <ArrowRight className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </div>
                    ))}
                    {(!feature.testSteps || feature.testSteps.length === 0) && (
                      <p className="text-xs text-slate-700">No implementation steps defined.</p>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="dependencies">
            <AccordionTrigger className="text-sm font-medium">Dependencies & Timeline</AccordionTrigger>
            <AccordionContent>
              <div className="mt-2 flex flex-col sm:flex-row gap-4">
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ));
  };

  return (
    <div className="space-y-6">
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
              <h3 className="font-medium mb-2">Implementation Phases</h3>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Phase 1 (Basic):</span>
                  <span className="text-xs font-medium">{(phaseFeatures[1] || []).length} features</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Phase 2 (Core):</span>
                  <span className="text-xs font-medium">{(phaseFeatures[2] || []).length} features</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Phase 3 (Advanced):</span>
                  <span className="text-xs font-medium">{(phaseFeatures[3] || []).length} features</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Phase 4 (Enhancement):</span>
                  <span className="text-xs font-medium">{(phaseFeatures[4] || []).length} features</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs">Phase 5 (Optional):</span>
                  <span className="text-xs font-medium">{(phaseFeatures[5] || []).length} features</span>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Promoter System Development Plan</CardTitle>
          <CardDescription>View implementation details by category or implementation phase</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
            <TabsList className="mb-2">
              <TabsTrigger value="categories">By Category</TabsTrigger>
              <TabsTrigger value="phases">By Implementation Phase</TabsTrigger>
            </TabsList>
            
            <TabsContent value="categories">
              <Tabs value={activeCategory} onValueChange={setActiveCategory}>
                <div className="relative mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium flex items-center gap-1">
                      <Filter className="h-4 w-4" />
                      Filter by Category
                    </h3>
                  </div>
                  <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="inline-flex space-x-1 pb-1">
                      <TabsTrigger 
                        value="all" 
                        className="rounded-md px-3 py-1.5 text-xs font-medium"
                      >
                        All Features
                        <Badge variant="outline" className="ml-1.5 text-[10px] px-1">
                          {features.length}
                        </Badge>
                      </TabsTrigger>
                      
                      {orderedCategories.map(category => (
                        <TabsTrigger 
                          key={category} 
                          value={category} 
                          className="flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium"
                        >
                          <span className="flex items-center gap-1">
                            {categoryIcons[category]}
                            {categoryDisplayNames[category] || category}
                          </span>
                          <Badge variant="outline" className="ml-1.5 text-[10px] px-1">
                            {categorizedFeatures[category].length}
                          </Badge>
                        </TabsTrigger>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
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
            </TabsContent>
            
            <TabsContent value="phases">
              <Accordion type="single" collapsible defaultValue="phase-1">
                {[1, 2, 3, 4, 5].map(phase => {
                  const phaseTitle = [
                    "Basic Functionality", 
                    "Core Features", 
                    "Advanced Features",
                    "Enhancement Features",
                    "Optional Features"
                  ][phase-1];
                  
                  return (
                    <AccordionItem key={`phase-${phase}`} value={`phase-${phase}`}>
                      <AccordionTrigger className="hover:bg-slate-50 px-4 py-3 rounded-md">
                        <div className="flex items-center gap-2 w-full">
                          <Badge variant={phase === 1 ? "default" : "outline"}>Phase {phase}</Badge>
                          <span>{phaseTitle}</span>
                          <Badge variant="outline" className="ml-auto">
                            {(phaseFeatures[phase] || []).length} features
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
                        {phaseFeatures[phase] && phaseFeatures[phase].length > 0 ? (
                          renderFeatures(phaseFeatures[phase])
                        ) : (
                          <p className="text-sm text-gray-500 py-2">No features in this phase.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Database Schema & Integration Plan</CardTitle>
          <CardDescription>Database development strategy for promoter features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Database Tables</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-purple-500" />
                    Ticket Management Tables
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Badge variant="outline" className="mr-2">ticket_tiers</Badge> For various ticket levels and pricing</li>
                    <li><Badge variant="outline" className="mr-2">ticket_sales</Badge> Track all ticket sales transactions</li>
                    <li><Badge variant="outline" className="mr-2">ticket_redemptions</Badge> Track ticket usage at events</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BadgeDollarSign className="h-5 w-5 text-emerald-500" />
                    Sponsorship Tables
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Badge variant="outline" className="mr-2">sponsor_relationships</Badge> Track promoter-sponsor connections</li>
                    <li><Badge variant="outline" className="mr-2">sponsor_assets</Badge> Brand logos and marketing materials</li>
                    <li><Badge variant="outline" className="mr-2">sponsor_campaigns</Badge> Track sponsorship campaigns</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Venue Partnership Tables
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Badge variant="outline" className="mr-2">promoter_venue_agreements</Badge> Revenue sharing agreements</li>
                    <li><Badge variant="outline" className="mr-2">venue_communications</Badge> Communication history</li>
                    <li><Badge variant="outline" className="mr-2">venue_bookings</Badge> Event scheduling at venues</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-500" />
                    Analytics Tables
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li><Badge variant="outline" className="mr-2">event_analytics</Badge> Performance metrics for events</li>
                    <li><Badge variant="outline" className="mr-2">audience_metrics</Badge> Demographic and attendance data</li>
                    <li><Badge variant="outline" className="mr-2">campaign_performance</Badge> Marketing campaign results</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Integration Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Payment Systems</h4>
                  <p className="text-sm text-gray-600">Integrate with payment gateways for ticket sales and sponsor payments.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Notification System</h4>
                  <p className="text-sm text-gray-600">Connect with the platform's notification service for alerts and updates.</p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">User Authentication</h4>
                  <p className="text-sm text-gray-600">Extend existing authentication to include promoter-specific permissions.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromoterRequirementsTab;
