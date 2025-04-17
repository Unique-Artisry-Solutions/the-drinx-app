import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { FeatureItem } from './types';
import { renderStatusBadge, renderDatabaseStatusBadge } from './utils';

interface FeatureTabProps {
  features: FeatureItem[];
  title: string;
  description: string;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ features, title, description }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openFeatures, setOpenFeatures] = useState<string[]>([]);

  const toggleFeature = (featureId: string) => {
    setOpenFeatures(current => 
      current.includes(featureId) 
        ? current.filter(id => id !== featureId)
        : [...current, featureId]
    );
  };

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

  const renderDatabaseDetails = (feature: FeatureItem) => {
    if (!feature.dbRequirementsText) return null;
    
    return (
      <div>
        <h4 className="font-medium mb-2">Database Requirements</h4>
        <pre className="text-sm bg-slate-50 p-3 rounded-md whitespace-pre-wrap">
          {feature.dbRequirementsText}
        </pre>
      </div>
    );
  };

  const renderTestSteps = (steps?: string[]) => {
    if (!steps || steps.length === 0) return null;
    
    return (
      <div>
        <h4 className="font-medium mb-2">Test Steps</h4>
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="text-sm">
              {step}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const hasDetails = (feature: FeatureItem) => {
    return (feature.testSteps && feature.testSteps.length > 0) || feature.dbRequirementsText;
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
            <Collapsible
              key={feature.id}
              open={openFeatures.includes(feature.id)}
              onOpenChange={() => toggleFeature(feature.id)}
            >
              <div className="border rounded-lg p-4">
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
                  {hasDetails(feature) && (
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Details
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                          openFeatures.includes(feature.id) ? 'transform rotate-180' : ''
                        }`} />
                      </Button>
                    </CollapsibleTrigger>
                  )}
                </div>

                {hasDetails(feature) && (
                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t space-y-4">
                      {renderTestSteps(feature.testSteps)}
                      {renderDatabaseDetails(feature)}
                    </div>
                  </CollapsibleContent>
                )}
              </div>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureTab;
