
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { FeatureBusinessValueObject } from '../types';

interface BusinessValueSectionProps {
  values: FeatureBusinessValueObject[];
}

const BusinessValueSection: React.FC<BusinessValueSectionProps> = ({ values }) => {
  const priorityColorClasses = {
    high: {
      card: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-800',
      icon: 'text-purple-500',
    },
    medium: {
      card: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-800',
      icon: 'text-blue-500',
    },
    low: {
      card: 'border-gray-200',
      badge: 'bg-gray-100 text-gray-800',
      icon: 'text-gray-500',
    },
  };

  // If no values are provided, show a message
  if (!values || values.length === 0) {
    return (
      <div className="text-center py-12">
        <Star className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No business value data available</h3>
        <p className="text-gray-500 mt-2">Try analyzing features to generate business value insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {values.map((value) => {
        // Convert value.name to lowercase to match our keys
        const priority = value.name.toLowerCase().includes('high') ? 'high' : 
                         value.name.toLowerCase().includes('medium') ? 'medium' : 'low';
        const colors = priorityColorClasses[priority as keyof typeof priorityColorClasses];
        
        return (
          <Card key={value.name} className={`${colors.card} border`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Badge className={`mr-2 ${colors.badge}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Value
                </Badge>
                {value.name}
              </CardTitle>
              <CardDescription>{value.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Implementation Progress</span>
                  <span className="text-sm font-medium">{value.implementationRate}%</span>
                </div>
                <Progress value={value.implementationRate} className="h-2" />
              </div>
              
              <div className="space-y-3">
                {value.features.map((feature) => (
                  <div key={feature.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {feature.tags?.includes('signature') && (
                        <Star className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">{feature.name}</span>
                    </div>
                    <Badge className={feature.status === 'implemented' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                      {feature.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BusinessValueSection;
