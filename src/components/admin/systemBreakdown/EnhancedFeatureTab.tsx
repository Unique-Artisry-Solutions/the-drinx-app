
import React, { useState } from 'react';
import { FeatureItem } from './types';
import { FeatureDetailCard } from './shared/FeatureDetailCard';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface EnhancedFeatureTabProps {
  features: FeatureItem[];
  title: string;
  userType: string;
}

const EnhancedFeatureTab: React.FC<EnhancedFeatureTabProps> = ({
  features,
  title,
  userType
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'all' | 'phases' | 'simple'>('all');

  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && feature.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-500">Features for {userType} users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search features..."
            className="pl-8"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="bg-white border rounded-md p-1 flex">
            <Button 
              variant={filterStatus === 'all' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="text-xs h-8"
            >
              All
            </Button>
            <Button 
              variant={filterStatus === 'implemented' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus('implemented')}
              className="text-xs h-8"
            >
              Implemented
            </Button>
            <Button 
              variant={filterStatus === 'in_progress' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus('in_progress')}
              className="text-xs h-8"
            >
              In Progress
            </Button>
            <Button 
              variant={filterStatus === 'planned' ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus('planned')}
              className="text-xs h-8"
            >
              Planned
            </Button>
          </div>
          
          <div className="bg-white border rounded-md p-1 flex items-center">
            <Filter className="h-4 w-4 text-gray-500 ml-2" />
            <select 
              className="bg-transparent border-none text-sm focus:outline-none px-1"
              value={viewMode}
              onChange={e => setViewMode(e.target.value as 'all' | 'phases' | 'simple')}
            >
              <option value="all">Detailed View</option>
              <option value="phases">Phases View</option>
              <option value="simple">Simple View</option>
            </select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Features ({features.length})</TabsTrigger>
          <TabsTrigger value="updated">
            Updated ({features.filter(f => f.statusUpdated).length})
          </TabsTrigger>
          <TabsTrigger value="needsAttention">
            Needs Attention ({features.filter(f => f.status !== 'implemented').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFeatures.map(feature => (
              <FeatureDetailCard 
                key={feature.id} 
                feature={feature} 
                showPhases={viewMode === 'all' || viewMode === 'phases'}
                showDetails={viewMode === 'all'}
              />
            ))}
            
            {filteredFeatures.length === 0 && (
              <div className="col-span-full p-8 text-center border rounded-lg bg-slate-50">
                <p className="text-gray-500">No features match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="updated" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFeatures.filter(f => f.statusUpdated).map(feature => (
              <FeatureDetailCard 
                key={feature.id} 
                feature={feature} 
                showPhases={viewMode === 'all' || viewMode === 'phases'}
                showDetails={viewMode === 'all'}
              />
            ))}
            
            {filteredFeatures.filter(f => f.statusUpdated).length === 0 && (
              <div className="col-span-full p-8 text-center border rounded-lg bg-slate-50">
                <p className="text-gray-500">No recently updated features match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="needsAttention" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFeatures.filter(f => f.status !== 'implemented').map(feature => (
              <FeatureDetailCard 
                key={feature.id} 
                feature={feature} 
                showPhases={viewMode === 'all' || viewMode === 'phases'}
                showDetails={viewMode === 'all'}
              />
            ))}
            
            {filteredFeatures.filter(f => f.status !== 'implemented').length === 0 && (
              <div className="col-span-full p-8 text-center border rounded-lg bg-slate-50">
                <p className="text-gray-500">No features requiring attention match your search criteria.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedFeatureTab;
