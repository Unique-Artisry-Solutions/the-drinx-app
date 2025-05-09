
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  category: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ category }) => {
  // Define specific messages based on category
  const getCategorySpecificInfo = () => {
    switch (category) {
      case 'general':
        return {
          title: 'No General Settings',
          description: 'Basic system configuration settings will appear here.',
          buttonText: 'Add Setting',
        };
      case 'email':
        return {
          title: 'No Email Templates Found',
          description: 'Email templates for system notifications will appear here.',
          buttonText: 'Add Email Template',
        };
      case 'security':
        return {
          title: 'No Security Settings',
          description: 'Security-related configuration settings will appear here.',
          buttonText: 'Add Security Setting',
        };
      case 'api':
        return {
          title: 'No API Configurations',
          description: 'API integrations and configurations will appear here.',
          buttonText: 'Add API Configuration',
        };
      case 'payment':
        return {
          title: 'No Payment Gateways',
          description: 'Payment gateway configurations will appear here.',
          buttonText: 'Add Payment Gateway',
        };
      case 'features':
        return {
          title: 'No Feature Toggles',
          description: 'Feature flags and toggles will appear here.',
          buttonText: 'Add Feature Toggle',
        };
      case 'feature-tiers':
        return {
          title: 'No Feature Tiers',
          description: 'Feature access tier mappings will appear here.',
          buttonText: 'Add Tier Mapping',
        };
      case 'feature-analytics':
        return {
          title: 'No Feature Analytics',
          description: 'Usage analytics for features will appear here.',
          buttonText: 'Configure Analytics',
        };
      default:
        return {
          title: 'No Configuration Items',
          description: 'Configuration items will appear here when added.',
          buttonText: 'Add Item',
        };
    }
  };

  const { title, description, buttonText } = getCategorySpecificInfo();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-6">
        <p className="text-center text-sm text-muted-foreground mb-6">{description}</p>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
