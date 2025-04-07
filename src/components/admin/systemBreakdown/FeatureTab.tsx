
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import FeaturesTable from './FeaturesTable';
import { FeatureItem } from './types';

interface FeatureTabProps {
  features: FeatureItem[];
  title: string;
  description: string;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ features, title, description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <FeaturesTable features={features} title={title} />
      </CardContent>
    </Card>
  );
};

export default FeatureTab;
