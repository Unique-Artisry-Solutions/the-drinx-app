
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocFeature, DocSection } from './types';

interface DocSectionCardProps {
  section: DocSection;
  onFeatureSelect: (featureId: string) => void;
  filterQuery?: string;
}

const DocSectionCard: React.FC<DocSectionCardProps> = ({ 
  section, 
  onFeatureSelect,
  filterQuery = '' 
}) => {
  // Filter features by search query if provided
  const filteredFeatures = filterQuery
    ? section.features.filter(feature => 
        feature.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        feature.description.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : section.features;

  if (filteredFeatures.length === 0 && filterQuery !== '') {
    return null; // Don't show sections with no matching features
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{section.title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {filteredFeatures.length} {filteredFeatures.length === 1 ? 'feature' : 'features'}
          </Badge>
        </div>
        <CardDescription>{section.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <ul className="space-y-3">
          {filteredFeatures.map(feature => (
            <FeatureItem 
              key={feature.id} 
              feature={feature} 
              onSelect={() => onFeatureSelect(feature.id)} 
            />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

interface FeatureItemProps {
  feature: DocFeature;
  onSelect: () => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, onSelect }) => {
  return (
    <li>
      <button 
        onClick={onSelect}
        className="w-full text-left rounded-md p-2 hover:bg-gray-100 transition-colors flex items-center justify-between group"
      >
        <div>
          <h4 className="font-medium text-gray-900">{feature.title}</h4>
          <p className="text-sm text-gray-500 line-clamp-1">{feature.description}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
      </button>
    </li>
  );
};

export default DocSectionCard;
