
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocFeature } from './types';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface DocFeatureDetailsProps {
  feature: DocFeature | null;
  onBack: () => void;
}

const DocFeatureDetails: React.FC<DocFeatureDetailsProps> = ({ feature, onBack }) => {
  if (!feature) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Feature Details</CardTitle>
          <CardDescription>Select a feature to view its implementation details</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">No feature selected</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'implemented': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'implemented': return 'default';
      case 'partial': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            ← Back to Features
          </Button>
          <Badge variant={getStatusColor(feature.status)} className="flex items-center gap-1">
            {getStatusIcon(feature.status)}
            {feature.status}
          </Badge>
        </div>
        <CardTitle>{feature.title}</CardTitle>
        <CardDescription>{feature.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">Category</h4>
          <Badge variant="outline">{feature.category}</Badge>
        </div>

        {feature.implementationTips && feature.implementationTips.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Implementation Tips</h4>
            <ul className="space-y-1">
              {feature.implementationTips.map((tip: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feature.testingSteps && feature.testingSteps.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Testing Steps</h4>
            <ol className="space-y-1">
              {feature.testingSteps.map((step: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 font-medium">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {feature.bestPractices && feature.bestPractices.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Best Practices</h4>
            <ul className="space-y-1">
              {feature.bestPractices.map((practice: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feature.troubleshooting && feature.troubleshooting.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Troubleshooting</h4>
            <ul className="space-y-1">
              {feature.troubleshooting.map((item: string, index: number) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <AlertCircle className="h-3 w-3 text-yellow-500 mt-1 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {feature.relatedFeatures && feature.relatedFeatures.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Related Features</h4>
            <div className="flex flex-wrap gap-2">
              {feature.relatedFeatures.map((relatedId: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {relatedId}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocFeatureDetails;
