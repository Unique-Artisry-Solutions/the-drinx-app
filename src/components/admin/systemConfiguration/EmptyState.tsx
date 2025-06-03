
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings, Mail, Shield, Code, CreditCard, ToggleRight, Layers, BarChart } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  // Original prop - now optional
  category?: string;
  // New direct props
  title?: string;
  description?: string;
  buttonText?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  category,
  title: directTitle,
  description: directDescription,
  buttonText: directButtonText,
  icon: directIcon
}) => {
  // Define specific messages based on category
  const getCategorySpecificInfo = () => {
    switch (category) {
      case 'general':
        return {
          title: 'No General Settings',
          description: 'Basic system configuration settings will appear here.',
          buttonText: 'Add Setting',
          icon: 'Settings'
        };
      case 'email':
        return {
          title: 'No Email Templates Found',
          description: 'Email templates for system notifications will appear here.',
          buttonText: 'Add Email Template',
          icon: 'Mail'
        };
      case 'security':
        return {
          title: 'No Security Settings',
          description: 'Security-related configuration settings will appear here.',
          buttonText: 'Add Security Setting',
          icon: 'Shield'
        };
      case 'api':
        return {
          title: 'No API Configurations',
          description: 'API integrations and configurations will appear here.',
          buttonText: 'Add API Configuration',
          icon: 'Code'
        };
      case 'payment':
        return {
          title: 'No Payment Gateways',
          description: 'Payment gateway configurations will appear here.',
          buttonText: 'Add Payment Gateway',
          icon: 'CreditCard'
        };
      case 'features':
        return {
          title: 'No Feature Toggles',
          description: 'Feature flags and toggles will appear here.',
          buttonText: 'Add Feature Toggle',
          icon: 'ToggleRight'
        };
      case 'feature-tiers':
        return {
          title: 'No Feature Tiers',
          description: 'Feature access tier mappings will appear here.',
          buttonText: 'Add Tier Mapping',
          icon: 'Layers'
        };
      case 'feature-analytics':
        return {
          title: 'No Feature Analytics',
          description: 'Usage analytics for features will appear here.',
          buttonText: 'Configure Analytics',
          icon: 'BarChart'
        };
      default:
        return {
          title: 'No Configuration Items',
          description: 'Configuration items will appear here when added.',
          buttonText: 'Add Item',
          icon: 'PlusCircle'
        };
    }
  };

  // Get category info or use default
  const categoryInfo = getCategorySpecificInfo();
  
  // Use direct props if provided, otherwise fall back to category-based content
  const title = directTitle || categoryInfo.title;
  const description = directDescription || categoryInfo.description;
  const buttonText = directButtonText || categoryInfo.buttonText;
  const iconName = directIcon || categoryInfo.icon;
  
  // Map icon name to Lucide icon component
  const getIconComponent = (iconName: string): LucideIcon => {
    switch (iconName) {
      case 'Settings': return Settings;
      case 'Mail': return Mail;
      case 'Shield': return Shield;
      case 'Code': return Code;
      case 'CreditCard': return CreditCard;
      case 'ToggleRight': return ToggleRight;
      case 'Layers': return Layers;
      case 'BarChart': return BarChart;
      default: return PlusCircle;
    }
  };
  
  const IconComponent = getIconComponent(iconName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center py-6">
        <div className="mb-4">
          <IconComponent size={32} className="text-muted-foreground" />
        </div>
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
