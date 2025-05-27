
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Users, Building, UserCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DashboardFeatureTabProps {
  adminFeatures: any[];
  establishmentFeatures: any[];
  individualFeatures: any[];
  promoterFeatures: any[];
  onAnalyzeFeatures: () => void;
  onCreateRelease: () => void;
}

export const DashboardFeatureTab: React.FC<DashboardFeatureTabProps> = ({
  adminFeatures,
  establishmentFeatures,
  individualFeatures,
  promoterFeatures,
  onAnalyzeFeatures,
  onCreateRelease
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFeatureTab, setActiveFeatureTab] = useState('admin');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'bg-green-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'planned': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'implemented': return 'default';
      case 'in-progress': return 'secondary';
      case 'planned': return 'outline';
      default: return 'destructive';
    }
  };

  const filterFeatures = (features: any[]) => {
    if (!searchTerm) return features;
    return features.filter(feature => 
      feature.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feature.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const FeatureList = ({ features, title, icon: Icon }: { features: any[], title: string, icon: any }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant="outline">{features.length} features</Badge>
      </div>
      
      <div className="grid gap-3">
        {filterFeatures(features).map((feature, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{feature.name || `Feature ${index + 1}`}</h4>
                  <Badge variant={getStatusVariant(feature.status || 'planned')}>
                    {feature.status || 'planned'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {feature.description || 'No description available'}
                </p>
                {feature.category && (
                  <Badge variant="outline" className="text-xs">
                    {feature.category}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Feature Management</h2>
          <p className="text-muted-foreground">
            Comprehensive view of all system features across user types
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onAnalyzeFeatures} variant="outline">
            <Database className="h-4 w-4 mr-2" />
            Analyze Features
          </Button>
          <Button onClick={onCreateRelease}>
            Create Release
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search features..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Feature Categories Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" />
              <div className="text-sm font-medium">Admin Features</div>
            </div>
            <div className="text-2xl font-bold mt-1">{adminFeatures.length}</div>
            <div className="text-xs text-muted-foreground">
              {adminFeatures.filter(f => f.status === 'implemented').length} implemented
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-500" />
              <div className="text-sm font-medium">Establishment</div>
            </div>
            <div className="text-2xl font-bold mt-1">{establishmentFeatures.length}</div>
            <div className="text-xs text-muted-foreground">
              {establishmentFeatures.filter(f => f.status === 'implemented').length} implemented
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCircle className="h-4 w-4 text-purple-500" />
              <div className="text-sm font-medium">Individual</div>
            </div>
            <div className="text-2xl font-bold mt-1">{individualFeatures.length}</div>
            <div className="text-xs text-muted-foreground">
              {individualFeatures.filter(f => f.status === 'implemented').length} implemented
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              <div className="text-sm font-medium">Promoter</div>
            </div>
            <div className="text-2xl font-bold mt-1">{promoterFeatures.length}</div>
            <div className="text-xs text-muted-foreground">
              {promoterFeatures.filter(f => f.status === 'implemented').length} implemented
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Tabs */}
      <Tabs value={activeFeatureTab} onValueChange={setActiveFeatureTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="establishment">Establishment</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="promoter">Promoter</TabsTrigger>
        </TabsList>

        <TabsContent value="admin">
          <FeatureList 
            features={adminFeatures} 
            title="Admin Features" 
            icon={Database}
          />
        </TabsContent>

        <TabsContent value="establishment">
          <FeatureList 
            features={establishmentFeatures} 
            title="Establishment Features" 
            icon={Building}
          />
        </TabsContent>

        <TabsContent value="individual">
          <FeatureList 
            features={individualFeatures} 
            title="Individual Features" 
            icon={UserCircle}
          />
        </TabsContent>

        <TabsContent value="promoter">
          <FeatureList 
            features={promoterFeatures} 
            title="Promoter Features" 
            icon={Users}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
