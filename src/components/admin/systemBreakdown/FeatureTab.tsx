
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FeatureItem } from './types';
import { renderStatusBadge, renderDatabaseStatusBadge } from './utils';
import FeatureDetailsModal from './components/FeatureDetailsModal';

interface FeatureTabProps {
  features: FeatureItem[];
  title: string;
  description: string;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ features, title, description }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);

  // Filter features based on search term and status filter
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || feature.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderTags = (tags?: string[]) => {
    if (!tags || tags.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="w-full md:w-2/3">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <Label htmlFor="status-filter">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger id="status-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
                <SelectItem value="partial">Partially Implemented</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="planned">Planned</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredFeatures.map((feature) => (
            <div key={feature.id} className="border rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <h3 className="text-lg font-medium">{feature.name}</h3>
                    <div className="flex items-center gap-2">
                      {renderStatusBadge(feature.status)}
                      {renderDatabaseStatusBadge(feature.databaseStatus)}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{feature.description}</p>
                  {renderTags(feature.tags)}
                </div>
                <div className="flex items-center gap-2">
                  {feature.testSteps && feature.testSteps.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedFeature(feature)}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedFeature && (
          <FeatureDetailsModal
            feature={selectedFeature}
            isOpen={!!selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureTab;

