import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSystemBreakdown } from './hooks/useSystemBreakdown';
import { useFeatureStatus } from './hooks/useFeatureStatus';
import SystemHeader from './SystemHeader';

const SystemBreakdownContentSimple: React.FC = () => {
  const systemData = useSystemBreakdown();
  const featureData = useFeatureStatus();
  
  // Calculate statistics safely
  const allFeatures = [
    ...featureData.adminFeatures,
    ...featureData.establishmentFeatures,
    ...featureData.individualFeatures,
    ...featureData.promoterFeatures
  ];
  
  const implementedCount = allFeatures.filter(f => f.status === 'implemented').length;
  const inProgressCount = allFeatures.filter(f => f.status === 'in_progress').length;
  const plannedCount = allFeatures.filter(f => f.status === 'planned').length;
  const blockedCount = allFeatures.filter(f => f.status === 'blocked').length;
  const overallProgress = allFeatures.length > 0 ? Math.round((implementedCount / allFeatures.length) * 100) : 0;

  const SimpleFeatureCard = ({ feature }: { feature: any }) => (
    <Card key={feature.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{feature.name}</CardTitle>
          <Badge variant={feature.status === 'implemented' ? 'default' : 'secondary'}>
            {feature.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{feature.description}</p>
        <Progress value={feature.implementationProgress || 0} className="h-2" />
        <div className="text-xs text-muted-foreground mt-1">
          {feature.implementationProgress || 0}% complete
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <SystemHeader
        onAnalyzeFeatures={systemData.handleAnalyzeFeatures}
        onExportCSV={systemData.handleExportCSV}
        analyzing={systemData.analyzing}
      />

      <Tabs value={systemData.activeTab} onValueChange={systemData.setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview ({allFeatures.length})</TabsTrigger>
          <TabsTrigger value="admin">Admin ({featureData.adminFeatures.length})</TabsTrigger>
          <TabsTrigger value="establishment">Establishment ({featureData.establishmentFeatures.length})</TabsTrigger>
          <TabsTrigger value="individual">Individual ({featureData.individualFeatures.length})</TabsTrigger>
          <TabsTrigger value="promoter">Promoter ({featureData.promoterFeatures.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Implementation Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">
                  {overallProgress}%
                  <span className="text-sm ml-2 font-normal text-muted-foreground">implemented</span>
                </div>
                
                <Progress value={overallProgress} className="w-full h-3 mb-4" />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-medium">{featureData.adminFeatures.length}</div>
                    <div className="text-sm text-muted-foreground">Admin Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">{featureData.establishmentFeatures.length}</div>
                    <div className="text-sm text-muted-foreground">Establishment Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">{featureData.individualFeatures.length}</div>
                    <div className="text-sm text-muted-foreground">Individual Features</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-medium">{featureData.promoterFeatures.length}</div>
                    <div className="text-sm text-muted-foreground">Promoter Features</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{implementedCount}</div>
                  <div className="text-sm text-muted-foreground">Implemented</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{plannedCount}</div>
                  <div className="text-sm text-muted-foreground">Planned</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">{blockedCount}</div>
                  <div className="text-sm text-muted-foreground">Blocked</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureData.adminFeatures.map(feature => (
                  <SimpleFeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="establishment">
          <Card>
            <CardHeader>
              <CardTitle>Establishment Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureData.establishmentFeatures.map(feature => (
                  <SimpleFeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <Card>
            <CardHeader>
              <CardTitle>Individual Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureData.individualFeatures.map(feature => (
                  <SimpleFeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promoter">
          <Card>
            <CardHeader>
              <CardTitle>Promoter Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureData.promoterFeatures.map(feature => (
                  <SimpleFeatureCard key={feature.id} feature={feature} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemBreakdownContentSimple;