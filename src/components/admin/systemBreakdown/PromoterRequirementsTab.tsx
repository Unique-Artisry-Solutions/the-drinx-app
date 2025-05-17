
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, AlertCircle, Clock } from 'lucide-react';
import { calculateFeatureStatistics } from './utils/featureStatistics';
import { FeatureItem } from './types';
import { 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  ResponsiveContainer 
} from 'recharts';

interface PromoterRequirementsTabProps {
  features: FeatureItem[];
}

const PromoterRequirementsTab: React.FC<PromoterRequirementsTabProps> = ({ features }) => {
  // Calculate various statistics
  const stats = useMemo(() => calculateFeatureStatistics(features), [features]);

  // Group features by tag
  const featuresByTag = useMemo(() => {
    const tagMap: Record<string, FeatureItem[]> = {};
    
    features.forEach(feature => {
      if (feature.tags && feature.tags.length > 0) {
        feature.tags.forEach(tag => {
          if (tag !== 'promoter') { // Skip the generic promoter tag
            if (!tagMap[tag]) {
              tagMap[tag] = [];
            }
            tagMap[tag].push(feature);
          }
        });
      }
    });
    
    return tagMap;
  }, [features]);

  // Format data for chart
  const categoryChartData = useMemo(() => {
    return Object.keys(featuresByTag).map(tag => ({
      name: tag,
      total: featuresByTag[tag].length,
      implemented: featuresByTag[tag].filter(f => f.status === 'implemented').length,
      inProgress: featuresByTag[tag].filter(f => f.status === 'in_progress').length,
    }));
  }, [featuresByTag]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Promoter Requirements</h1>
        <p className="text-gray-500 mb-6">
          Implementation status of promoter-specific features and functionalities
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalFeatures}</div>
            <p className="text-gray-500 mt-2">Total promoter features</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Implementation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.implementationRate}%
            </div>
            <div className="mt-2">
              <Progress value={stats.implementationRate} className="h-2" />
            </div>
            <p className="text-gray-500 mt-2">
              {stats.implementedFeatures} of {stats.totalFeatures} features implemented
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.databaseCompletionRate}%
            </div>
            <div className="mt-2">
              <Progress value={stats.databaseCompletionRate} className="h-2" />
            </div>
            <p className="text-gray-500 mt-2">
              {stats.dbCompleted} of {stats.totalFeatures} DB schemas completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Category Chart */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Feature Categories</CardTitle>
          <CardDescription>Features grouped by functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={categoryChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="implemented" name="Implemented" fill="#10b981" stackId="a" />
                <Bar dataKey="inProgress" name="In Progress" fill="#3b82f6" stackId="a" />
                <Bar dataKey="total" name="Planned" fill="#d1d5db" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Feature Categories */}
      <div className="space-y-6 mt-8">
        <h2 className="text-xl font-bold">Feature Categories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(featuresByTag).map(([tag, tagFeatures]) => {
            const implementedCount = tagFeatures.filter(f => f.status === 'implemented').length;
            const implementationRate = Math.round((implementedCount / tagFeatures.length) * 100);
            
            return (
              <Card key={tag} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg capitalize">{tag}</CardTitle>
                    <Badge variant={implementationRate >= 80 ? "default" : implementationRate >= 50 ? "secondary" : "outline"}>
                      {implementationRate}% Complete
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={implementationRate} className="h-2 mt-2 mb-4" />
                  <div className="space-y-3">
                    {tagFeatures.map(feature => (
                      <div key={feature.id} className="flex items-start">
                        {feature.status === 'implemented' ? (
                          <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : feature.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-300 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PromoterRequirementsTab;
